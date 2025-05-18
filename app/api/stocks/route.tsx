// app/api/public-stocks/route.ts
import { NextResponse } from 'next/server'

const SERVICE_KEY = process.env.DATA_GO_KR_SERVICE_KEY!
if (!SERVICE_KEY) {
    throw new Error('DATA_GO_KR_SERVICE_KEY 환경변수가 설정되지 않았습니다.')
}

/**
 * 시스템 로컬 시간을 UTC로 보정 → +9시간 → KST Date 반환
 */
function getKstDate(date: Date = new Date()): Date {
    const utcMillis = date.getTime() + date.getTimezoneOffset() * 60000
    const kstMillis = utcMillis + 9 * 60 * 60 * 1000
    return new Date(kstMillis)
}

function formatYmd(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}${m}${d}`
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    if (!q) {
        return NextResponse.json(
            { error: '필수 파라미터 q(종목명)가 없습니다.' },
            { status: 400 }
        )
    }

    const MAX_LOOKBACK_DAYS = 5
    const PAGE_SIZE = 1000
    const SUGGESTION_LIMIT = 15
    const nowKst = getKstDate()

    let basDtFound: string | null = null
    let items: any[] = []

    // 1) 오늘(KST)부터 최대 5거래일 전까지 순차 탐색
    for (let offset = 0; offset < MAX_LOOKBACK_DAYS; offset++) {
        // KST 기준 날짜 계산
        const dt = new Date(nowKst)
        dt.setDate(nowKst.getDate() - offset)
        const basDt = formatYmd(dt)

        // API 호출 (basDt만 지정)
        const url = new URL(
            'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo'
        )
        url.searchParams.set('serviceKey', SERVICE_KEY)
        url.searchParams.set('numOfRows', PAGE_SIZE.toString())
        url.searchParams.set('pageNo', '1')
        url.searchParams.set('resultType', 'json')
        url.searchParams.set('basDt', basDt)

        const res = await fetch(url.toString())
        if (!res.ok) continue
        const json = await res.json()
        if (json.response?.header?.resultCode !== '00') continue

        const raw = json.response.body?.items?.item
        if (!raw) continue

        const list = Array.isArray(raw) ? raw : [raw]
        // **여기서 실제 API가 주는 basDt 필드를 확인** — 요청한 basDt와 일치하는 항목만 남깁니다.
        const exactDateItems = list.filter((it: any) => it.basDt === basDt)
        if (exactDateItems.length === 0) {
            // 요청일과 일치하는 데이터가 없으면(=fallback된 이전 거래일) 건너뜁니다.
            continue
        }

        basDtFound = basDt
        items = exactDateItems
        break
    }

    if (items.length === 0) {
        return NextResponse.json({ suggestions: [] })
    }

    // 2) 종목명으로 필터 → 완전일치 우선정렬 → 최대 15개 추출 → code/name/종가 응답
    const filtered = items.filter(it => it.itmsNm.includes(q))
    const exact   = filtered.filter(it => it.itmsNm === q)
    const fuzzy   = filtered.filter(it => it.itmsNm !== q)
    const sorted  = [...exact, ...fuzzy].slice(0, SUGGESTION_LIMIT)

    const suggestions = sorted.map(it => ({
        code: it.srtnCd,
        name: it.itmsNm,
        price: Number(it.clpr),  // clpr = “종가” 입니다
    }))

    // 디버깅을 위해 실제 사용된 거래일도 리턴해 보세요.
    return NextResponse.json({
        basDt: basDtFound,
        suggestions
    })
}
