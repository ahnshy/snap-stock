// app/api/quote/[slug]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import * as iconv from "iconv-lite";
import { Buffer } from "buffer";

type StockPrices = Array<Array<string | number>>;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug: symbol } = await params;
    if (!symbol) {
        return NextResponse.json({ error: "symbol is required" }, { status: 400 });
    }

    const url =
        `https://api.finance.naver.com/siseJson.naver` +
        `?symbol=${symbol}` +
        `&requestType=0` +
        `&count=1` +
        `&timeframe=day`;

    try {
        const res = await fetch(url, {
            headers: { Referer: "https://finance.naver.com" },
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const buf = Buffer.from(await res.arrayBuffer());
        const raw = iconv.decode(buf, "euc-kr").trim(); //Decode EUC-KR → UTF-8
        const jsonText = raw
            .replace(/'/g, '"')
            .replace(/,(\s*\])/g, "$1");

        const parsed: unknown = JSON.parse(jsonText);
        if (!Array.isArray(parsed)) {
            return NextResponse.json({ error: "invalid data format" }, { status: 500 });
        }

        const items = parsed as StockPrices;
        if (items.length < 2 || items[1].length < 5) {
            return NextResponse.json({ error: "price not found" }, { status: 500 });
        }

        const rawPrice = items[1][4];
        const price =
            typeof rawPrice === "string"
                ? Number(rawPrice.replace(/,/g, ""))
                : typeof rawPrice === "number"
                    ? rawPrice
                    : NaN;

        if (Number.isNaN(price)) {
            throw new Error(`invalid price "${rawPrice}"`);
        }

        return NextResponse.json({ price });
    } catch (err) {
        console.error("Error fetching Naver Finance quote:", err);
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
            { error: "failed to fetch quote", message },
            { status: 500 }
        );
    }
}
