import { ImageResponse } from "next/og";
import { getService, startingPrice } from "@/lib/catalog";
import { currentMarket } from "@/lib/current-market";
import { convert, formatMoney } from "@/lib/pricing";
import { CATEGORY_MAP } from "@/lib/taxonomy";

export const alt = "Serva service preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ market: string; slug: string }> }) {
  const { slug } = await params;
  const market = await currentMarket();
  const service = await getService(slug);
  const [c1, c2] = service?.art.palette ?? ["#6D3BFF", "#B18CFF"];
  const price = service ? formatMoney(convert(startingPrice(service), market), market, { trim: true }) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          color: "#16123A",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#16123A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#FFC93C" }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#FFFFFF" }}>serva.</div>
          <div style={{ marginLeft: "auto", background: "#FFFFFF", borderRadius: 999, padding: "10px 24px", fontSize: 26, fontWeight: 700 }}>
            {`${market.country} · ${market.currency}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", background: "#FFFFFF", borderRadius: 40, padding: 48, gap: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#6D3BFF" }}>
            {service ? CATEGORY_MAP[service.category].label.toUpperCase() : "SERVA"}
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>{service?.name ?? "Branding services"}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
            <div style={{ fontSize: 30, color: "#4A4668", maxWidth: 700 }}>{service?.tagline ?? ""}</div>
            {price && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ fontSize: 22, color: "#6B6788" }}>Starting at</div>
                <div style={{ fontSize: 56, fontWeight: 800 }}>{price}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
