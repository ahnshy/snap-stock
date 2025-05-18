// app/api/public-stocks/route.ts
import { NextResponse } from 'next/server'

const SERVICE_KEY = process.env.DATA_GO_KR_SERVICE_KEY!
if (!SERVICE_KEY) {
    throw new Error('DATA_GO_KR_SERVICE_KEY 환경변수가 설정되지 않았습니다.')
}

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

    for (let offset = 0; offset < MAX_LOOKBACK_DAYS; offset++) {
        const dt = new Date(nowKst)
        dt.setDate(nowKst.getDate() - offset)
        const basDt = formatYmd(dt)

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
        const exactDateItems = list.filter((it: any) => it.basDt === basDt)
        if (exactDateItems.length === 0) {
            continue
        }

        basDtFound = basDt
        items = exactDateItems
        break
    }

    if (items.length === 0) {
        return NextResponse.json({ suggestions: [] })
    }

    const filtered = items.filter(it => it.itmsNm.includes(q))
    const exact   = filtered.filter(it => it.itmsNm === q)
    const fuzzy   = filtered.filter(it => it.itmsNm !== q)
    const sorted  = [...exact, ...fuzzy].slice(0, SUGGESTION_LIMIT)

    const suggestions = sorted.map(it => ({
        code: it.srtnCd,
        name: it.itmsNm,
        price: Number(it.clpr),
    }))

    return NextResponse.json({
        basDt: basDtFound,
        suggestions
    })
}
