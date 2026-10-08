import { useId, type ReactNode } from "react";
import type { ArtKind } from "@/lib/types";

type Props = {
  kind: ArtKind;
  palette: [string, string, string, string];
  /** 0 = hero, 1 = close-up, 2 = pattern, 3 = in context. */
  variant?: number;
  title: string;
  className?: string;
};

const isLight = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 186;
};

type Ctx = { accent: string; dark: string; light: string; c1: string; c2: string };

/** Abstract placeholder brand mark used across all mock-ups. */
function Mark({ x, y, s, c, bg }: { x: number; y: number; s: number; c: Ctx; bg?: string }) {
  const r = s / 2;
  return (
    <g transform={`translate(${x - r} ${y - r})`}>
      <circle cx={r} cy={r} r={r} fill={bg ?? c.accent} />
      <path
        d={`M${r * 0.45} ${r * 1.15} a${r * 0.55} ${r * 0.55} 0 1 1 ${r * 1.1} 0`}
        fill="none"
        stroke={bg ? c.accent : c.dark}
        strokeWidth={r * 0.28}
        strokeLinecap="round"
      />
      <circle cx={r} cy={r * 1.15} r={r * 0.17} fill={bg ? c.accent : c.dark} />
    </g>
  );
}

const Bars = ({ x, y, w, c, rows = 3, gap = 10 }: { x: number; y: number; w: number; c: string; rows?: number; gap?: number }) => (
  <g fill={c}>
    {Array.from({ length: rows }, (_, i) => (
      <rect key={i} x={x} y={y + i * gap} width={w * (i === rows - 1 ? 0.6 : 1 - i * 0.12)} height={4} rx={2} opacity={i ? 0.45 : 0.85} />
    ))}
  </g>
);

function draw(kind: ArtKind, c: Ctx): ReactNode {
  const { accent, dark, light } = c;
  switch (kind) {
    case "logo":
      return (
        <g>
          <g fill="none" stroke={light} strokeOpacity={0.35} strokeWidth={1.2}>
            <circle cx={200} cy={140} r={92} />
            <circle cx={200} cy={140} r={60} />
            <line x1={80} y1={140} x2={320} y2={140} />
            <line x1={200} y1={30} x2={200} y2={250} />
          </g>
          <rect x={135} y={75} width={130} height={130} rx={34} fill={light} />
          <Mark x={200} y={140} s={78} c={c} />
          <rect x={150} y={226} width={100} height={10} rx={5} fill={light} />
          <rect x={170} y={244} width={60} height={6} rx={3} fill={light} opacity={0.6} />
        </g>
      );
    case "identity":
      return (
        <g>
          <rect x={70} y={70} width={150} height={170} rx={16} fill={light} />
          <Mark x={145} y={125} s={56} c={c} />
          <Bars x={95} y={175} w={100} c={dark} />
          {[accent, dark, c.c2, light].map((col, i) => (
            <circle key={i} cx={262 + (i % 2) * 52} cy={100 + Math.floor(i / 2) * 52} r={22} fill={col} stroke={light} strokeWidth={4} />
          ))}
          <text x={290} y={232} textAnchor="middle" fontSize={48} fontWeight={700} fill={light}>
            Aa
          </text>
        </g>
      );
    case "social":
      return (
        <g>
          <rect x={140} y={40} width={120} height={225} rx={22} fill={dark} />
          <rect x={148} y={60} width={104} height={195} rx={10} fill={light} />
          <Mark x={170} y={80} s={22} c={c} />
          <rect x={188} y={74} width={50} height={5} rx={2.5} fill={dark} opacity={0.7} />
          <rect x={188} y={84} width={34} height={4} rx={2} fill={dark} opacity={0.35} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect
              key={i}
              x={152 + (i % 3) * 33}
              y={100 + Math.floor(i / 3) * 33}
              width={31}
              height={31}
              rx={4}
              fill={[accent, c.c1, c.c2][(i + Math.floor(i / 3)) % 3]}
            />
          ))}
          <g transform="translate(270 70)">
            <rect width={74} height={40} rx={20} fill={light} />
            <path d="M22 14c-4-5-12-1-8 6l8 7 8-7c4-7-4-11-8-6z" fill={c.c2 === light ? accent : "#FF5FA2"} />
            <text x={36} y={26} fontSize={13} fontWeight={700} fill={dark}>2.4k</text>
          </g>
          <circle cx={110} cy={210} r={26} fill={accent} />
          <path d="M100 210l7 7 14-14" stroke={dark} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "web":
      return (
        <g>
          <rect x={60} y={55} width={280} height={190} rx={14} fill={light} />
          <rect x={60} y={55} width={280} height={24} rx={14} fill={dark} opacity={0.08} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={76 + i * 12} cy={67} r={4} fill={[c.c2 === light ? "#FF6A4D" : "#FF6A4D", "#FFC93C", "#2BD9A0"][i]} />
          ))}
          <Mark x={88} y={98} s={18} c={c} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={230 + i * 30} y={95} width={22} height={5} rx={2.5} fill={dark} opacity={0.4} />
          ))}
          <rect x={80} y={125} width={120} height={12} rx={6} fill={dark} />
          <rect x={80} y={143} width={90} height={12} rx={6} fill={dark} />
          <Bars x={80} y={166} w={110} c={dark} rows={2} />
          <rect x={80} y={195} width={64} height={22} rx={11} fill={accent} />
          <rect x={215} y={118} width={105} height={105} rx={14} fill={c.c2} />
          <circle cx={267} cy={170} r={30} fill={accent} />
          <rect x={245} y={190} width={60} height={18} rx={9} fill={light} opacity={0.9} />
        </g>
      );
    case "motion":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={70 + i * 18} y={120 + i * 14} width={90 - i * 25} height={8} rx={4} fill={light} opacity={0.6 - i * 0.15} />
          ))}
          <circle cx={215} cy={140} r={70} fill={light} />
          <Mark x={215} y={140} s={84} c={c} />
          <circle cx={300} cy={80} r={14} fill={accent} />
          <circle cx={318} cy={210} r={9} fill={light} opacity={0.7} />
          <rect x={80} y={240} width={240} height={8} rx={4} fill={light} opacity={0.35} />
          <rect x={80} y={240} width={150} height={8} rx={4} fill={accent} />
          <circle cx={230} cy={244} r={9} fill={light} />
        </g>
      );
    case "deck":
      return (
        <g>
          <rect x={110} y={50} width={220} height={140} rx={12} fill={light} opacity={0.5} />
          <rect x={90} y={70} width={220} height={140} rx={12} fill={light} opacity={0.75} />
          <rect x={70} y={90} width={220} height={140} rx={12} fill={light} />
          <rect x={88} y={108} width={90} height={9} rx={4.5} fill={dark} />
          <Bars x={88} y={126} w={70} c={dark} rows={2} />
          {[38, 62, 48, 80].map((h, i) => (
            <rect key={i} x={190 + i * 22} y={210 - h} width={14} height={h} rx={3} fill={i === 3 ? accent : c.c1} />
          ))}
          <circle cx={120} cy={185} r={22} fill="none" stroke={accent} strokeWidth={10} strokeDasharray="90 140" />
          <circle cx={120} cy={185} r={22} fill="none" stroke={dark} strokeOpacity={0.12} strokeWidth={10} />
        </g>
      );
    case "mug":
      return (
        <g>
          <ellipse cx={200} cy={250} rx={92} ry={10} fill={dark} opacity={0.15} />
          <path d="M268 140a34 34 0 0 1 0 68" fill="none" stroke={light} strokeWidth={16} />
          <path d="M268 140a34 34 0 0 1 0 68" fill="none" stroke={dark} strokeOpacity={0.08} strokeWidth={16} />
          <path d="M130 108h140v118a22 22 0 0 1-22 22h-96a22 22 0 0 1-22-22z" fill={light} />
          <rect x={130} y={108} width={140} height={14} fill={dark} opacity={0.06} />
          <ellipse cx={200} cy={108} rx={70} ry={10} fill={dark} opacity={0.85} />
          <Mark x={200} y={175} s={58} c={c} />
          <g fill="none" stroke={light} strokeWidth={5} strokeLinecap="round" opacity={0.75}>
            <path d="M180 88c-10-12 10-18 0-32" />
            <path d="M205 84c-10-12 10-18 0-32" />
            <path d="M230 88c-10-12 10-18 0-32" />
          </g>
        </g>
      );
    case "tote":
      return (
        <g>
          <path d="M160 110v-20a40 40 0 0 1 80 0v20" fill="none" stroke={dark} strokeWidth={8} strokeLinecap="round" />
          <path d="M120 110h160l12 145H108z" fill={light} />
          <path d="M120 110h160l2 18H118z" fill={dark} opacity={0.06} />
          <Mark x={200} y={175} s={60} c={c} />
          <rect x={160} y={218} width={80} height={8} rx={4} fill={dark} opacity={0.8} />
        </g>
      );
    case "apparel":
      return (
        <g>
          <path
            d="M150 70l30-12q20 18 40 0l30 12 45 38-26 32-19-14v130H150V126l-19 14-26-32z"
            fill={light}
          />
          <path d="M180 58q20 18 40 0" fill="none" stroke={dark} strokeOpacity={0.2} strokeWidth={4} />
          <Mark x={200} y={135} s={46} c={c} />
          <rect x={170} y={170} width={60} height={7} rx={3.5} fill={dark} opacity={0.75} />
          <rect x={182} y={183} width={36} height={5} rx={2.5} fill={dark} opacity={0.35} />
        </g>
      );
    case "bottle":
      return (
        <g>
          <ellipse cx={200} cy={262} rx={60} ry={8} fill={dark} opacity={0.15} />
          <rect x={178} y={30} width={44} height={30} rx={8} fill={dark} />
          <rect x={184} y={58} width={32} height={18} fill={dark} opacity={0.75} />
          <rect x={160} y={74} width={80} height={186} rx={30} fill={light} />
          <rect x={168} y={86} width={10} height={160} rx={5} fill={light} opacity={0.6} />
          <rect x={160} y={110} width={80} height={10} fill={accent} />
          <Mark x={200} y={170} s={44} c={c} />
          <rect x={180} y={205} width={40} height={6} rx={3} fill={dark} opacity={0.6} />
        </g>
      );
    case "notebook":
      return (
        <g transform="rotate(-8 200 150)">
          <rect x={126} y={52} width={160} height={210} rx={12} fill={dark} opacity={0.25} transform="translate(8 8)" />
          <rect x={126} y={52} width={160} height={210} rx={12} fill={light} />
          <rect x={126} y={52} width={18} height={210} rx={6} fill={dark} opacity={0.1} />
          <rect x={262} y={52} width={10} height={210} fill={accent} />
          <path d="M240 262v28l10-8 10 8v-28" fill={c.c1} />
          <Mark x={206} y={138} s={60} c={c} />
          <rect x={176} y={186} width={60} height={7} rx={3.5} fill={dark} opacity={0.6} />
        </g>
      );
    case "giftbox":
      return (
        <g>
          <ellipse cx={200} cy={262} rx={100} ry={10} fill={dark} opacity={0.15} />
          <rect x={115} y={140} width={170} height={120} rx={10} fill={light} />
          <rect x={105} y={112} width={190} height={36} rx={10} fill={light} />
          <rect x={105} y={140} width={190} height={8} fill={dark} opacity={0.06} />
          <rect x={190} y={112} width={20} height={148} fill={accent} />
          <path d="M200 112c-30-40-62-10-30 0zM200 112c30-40 62-10 30 0z" fill={accent} stroke={accent} strokeWidth={6} strokeLinejoin="round" />
          <Mark x={152} y={200} s={36} c={c} />
          <Bars x={228} y={190} w={42} c={dark} rows={3} gap={9} />
        </g>
      );
    case "pen":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${-20 + i * 30} ${i * 26}) rotate(-28 200 150)`}>
              <rect x={70} y={136} width={230} height={26} rx={13} fill={[light, accent, dark][i]} />
              <path d="M300 136l40 13-40 13z" fill={[light, accent, dark][i]} opacity={0.85} />
              <path d="M330 146l10 3-10 3z" fill={dark} />
              <rect x={90} y={130} width={70} height={8} rx={4} fill={i === 2 ? light : dark} opacity={0.5} />
              {i === 0 && <Mark x={200} y={149} s={18} c={c} />}
            </g>
          ))}
        </g>
      );
    case "copy":
      return (
        <g>
          <text x={80} y={150} fontSize={150} fontWeight={800} fill={light} opacity={0.9}>
            “
          </text>
          <rect x={150} y={90} width={180} height={140} rx={16} fill={light} />
          <rect x={170} y={112} width={120} height={12} rx={6} fill={dark} />
          <rect x={170} y={132} width={90} height={12} rx={6} fill={accent} />
          <Bars x={170} y={160} w={130} c={dark} rows={4} gap={11} />
          <circle cx={110} cy={225} r={24} fill={accent} />
          <text x={110} y={233} textAnchor="middle" fontSize={22} fontWeight={700} fill={dark}>Aa</text>
        </g>
      );
    case "illustration":
      return (
        <g>
          <path d="M90 230c-20-80 60-150 130-130s110 70 90 130z" fill={light} opacity={0.25} />
          <circle cx={200} cy={150} r={70} fill={accent} />
          <circle cx={178} cy={138} r={9} fill={dark} />
          <circle cx={222} cy={138} r={9} fill={dark} />
          <circle cx={181} cy={135} r={3} fill={light} />
          <circle cx={225} cy={135} r={3} fill={light} />
          <path d="M178 168q22 20 44 0" fill="none" stroke={dark} strokeWidth={7} strokeLinecap="round" />
          <circle cx={160} cy={160} r={8} fill="#FF5FA2" opacity={0.6} />
          <circle cx={240} cy={160} r={8} fill="#FF5FA2" opacity={0.6} />
          <path d="M300 60l7 16 17 2-13 11 4 17-15-9-15 9 4-17-13-11 17-2z" fill={light} />
          <path d="M95 75l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill={light} />
          <path d="M300 220l40-40" stroke={light} strokeWidth={10} strokeLinecap="round" />
          <path d="M292 228l12-4-8-8z" fill={dark} />
        </g>
      );
    case "packaging":
      return (
        <g>
          <ellipse cx={200} cy={262} rx={120} ry={10} fill={dark} opacity={0.15} />
          <path d="M150 110l70-30 70 30-70 30z" fill={light} />
          <path d="M150 110v120l70 30V140z" fill={light} opacity={0.85} />
          <path d="M290 110v120l-70 30V140z" fill={accent} />
          <Mark x={185} y={185} s={36} c={c} />
          <rect x={95} y={160} width={60} height={95} rx={12} fill={light} />
          <rect x={100} y={145} width={50} height={22} rx={6} fill={dark} />
          <rect x={95} y={190} width={60} height={34} fill={c.c1} />
          <rect x={107} y={202} width={36} height={6} rx={3} fill={light} />
        </g>
      );
    case "camera":
      return (
        <g>
          <rect x={95} y={95} width={210} height={140} rx={22} fill={dark} />
          <rect x={150} y={75} width={70} height={30} rx={8} fill={dark} />
          <rect x={110} y={108} width={34} height={14} rx={7} fill={accent} />
          <circle cx={200} cy={165} r={52} fill={light} />
          <circle cx={200} cy={165} r={38} fill={c.c1} />
          <circle cx={200} cy={165} r={22} fill={dark} />
          <circle cx={190} cy={155} r={7} fill={light} opacity={0.8} />
          <circle cx={278} cy={115} r={7} fill={light} opacity={0.8} />
          <path d="M310 60l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2z" fill={light} />
        </g>
      );
    case "video":
      return (
        <g>
          <rect x={65} y={60} width={270} height={155} rx={16} fill={dark} />
          <rect x={75} y={70} width={250} height={135} rx={10} fill={c.c1} />
          <circle cx={130} cy={110} r={22} fill={accent} opacity={0.8} />
          <path d="M75 205l70-60 50 40 40-30 90 50z" fill={dark} opacity={0.25} />
          <circle cx={200} cy={137} r={30} fill={light} />
          <path d="M192 122l24 15-24 15z" fill={dark} />
          <rect x={65} y={232} width={270} height={8} rx={4} fill={light} opacity={0.4} />
          <rect x={65} y={232} width={160} height={8} rx={4} fill={accent} />
          <circle cx={225} cy={236} r={9} fill={light} />
        </g>
      );
    case "headshot":
      return (
        <g>
          {[0, 1, 2].map((i) => {
            const x = 70 + i * 90;
            const y = i === 1 ? 60 : 85;
            return (
              <g key={i}>
                <rect x={x} y={y} width={80} height={150} rx={14} fill={light} />
                <rect x={x + 6} y={y + 6} width={68} height={100} rx={10} fill={[c.c1, accent, c.c2][i]} />
                <circle cx={x + 40} cy={y + 46} r={17} fill={dark} opacity={0.85} />
                <path d={`M${x + 12} ${y + 106}c0-30 56-30 56 0z`} fill={dark} opacity={0.85} />
                <rect x={x + 14} y={y + 118} width={52} height={6} rx={3} fill={dark} opacity={0.75} />
                <rect x={x + 22} y={y + 130} width={36} height={5} rx={2.5} fill={dark} opacity={0.35} />
              </g>
            );
          })}
        </g>
      );
    case "card":
      return (
        <g>
          <g transform="rotate(-12 200 150)">
            <rect x={110} y={95} width={200} height={115} rx={10} fill={dark} opacity={0.2} transform="translate(6 10)" />
            <rect x={110} y={95} width={200} height={115} rx={10} fill={dark} />
            <Mark x={210} y={152} s={50} c={c} />
          </g>
          <g transform="rotate(6 200 150)">
            <rect x={90} y={130} width={200} height={115} rx={10} fill={dark} opacity={0.2} transform="translate(6 10)" />
            <rect x={90} y={130} width={200} height={115} rx={10} fill={light} />
            <Mark x={125} y={165} s={34} c={c} />
            <rect x={110} y={200} width={90} height={8} rx={4} fill={dark} />
            <Bars x={110} y={214} w={70} c={dark} rows={2} gap={9} />
            <rect x={250} y={140} width={30} height={6} rx={3} fill={accent} />
          </g>
        </g>
      );
    case "flyer":
      return (
        <g transform="rotate(-6 200 150)">
          <rect x={125} y={35} width={160} height={225} rx={8} fill={dark} opacity={0.2} transform="translate(8 8)" />
          <rect x={125} y={35} width={160} height={225} rx={8} fill={light} />
          <rect x={137} y={47} width={136} height={110} rx={6} fill={c.c1} />
          <circle cx={235} cy={100} r={38} fill={accent} />
          <path d="M137 157l50-55 40 40 46-30v45z" fill={dark} opacity={0.8} />
          <rect x={140} y={172} width={110} height={12} rx={6} fill={dark} />
          <rect x={140} y={190} width={80} height={12} rx={6} fill={dark} />
          <Bars x={140} y={212} w={120} c={dark} rows={2} />
          <rect x={140} y={235} width={58} height={14} rx={7} fill={accent} />
        </g>
      );
    case "rollup":
      return (
        <g>
          <ellipse cx={200} cy={268} rx={80} ry={8} fill={dark} opacity={0.18} />
          <rect x={148} y={20} width={104} height={8} rx={3} fill={dark} />
          <rect x={150} y={26} width={100} height={226} fill={light} />
          <rect x={150} y={26} width={100} height={110} fill={accent} />
          <circle cx={200} cy={81} r={34} fill={light} />
          <Mark x={200} y={81} s={44} c={c} />
          <rect x={162} y={150} width={76} height={10} rx={5} fill={dark} />
          <Bars x={162} y={170} w={76} c={dark} rows={3} />
          <rect x={170} y={215} width={60} height={16} rx={8} fill={dark} />
          <rect x={136} y={250} width={128} height={14} rx={7} fill={dark} />
        </g>
      );
    case "backdrop":
      return (
        <g>
          <path d="M200 0L120 260h160z" fill={light} opacity={0.08} />
          <ellipse cx={200} cy={268} rx={160} ry={10} fill={dark} opacity={0.2} />
          <rect x={55} y={50} width={290} height={190} rx={6} fill={light} />
          {Array.from({ length: 20 }, (_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x = 85 + col * 58 + (row % 2 ? 29 : 0);
            const y = 78 + row * 46;
            return x < 335 ? (
              row % 2 ? (
                <rect key={i} x={x - 18} y={y - 5} width={36} height={10} rx={5} fill={dark} opacity={0.75} />
              ) : (
                <Mark key={i} x={x} y={y} s={26} c={c} />
              )
            ) : null;
          })}
          <rect x={60} y={240} width={8} height={30} fill={dark} />
          <rect x={332} y={240} width={8} height={30} fill={dark} />
        </g>
      );
    case "sticker":
      return (
        <g>
          {[
            { x: 140, y: 110, r: 52, rot: -10, f: accent },
            { x: 255, y: 105, r: 42, rot: 12, f: light },
            { x: 215, y: 205, r: 48, rot: 0, f: c.c1 },
            { x: 115, y: 215, r: 30, rot: 0, f: dark },
          ].map((s, i) => (
            <g key={i} transform={`rotate(${s.rot} ${s.x} ${s.y})`}>
              <circle cx={s.x + 3} cy={s.y + 6} r={s.r + 6} fill={dark} opacity={0.18} />
              <circle cx={s.x} cy={s.y} r={s.r + 6} fill={light} />
              <circle cx={s.x} cy={s.y} r={s.r} fill={s.f} />
              <Mark x={s.x} y={s.y} s={s.r * 1.1} c={c} bg={s.f === light ? undefined : light} />
            </g>
          ))}
          <path d="M320 180l6 14 15 2-11 10 3 15-13-7-13 7 3-15-11-10 15-2z" fill={light} />
        </g>
      );
    case "letterhead":
      return (
        <g>
          <g transform="rotate(8 270 190)">
            <rect x={200} y={140} width={150} height={95} rx={6} fill={dark} opacity={0.2} transform="translate(6 8)" />
            <rect x={200} y={140} width={150} height={95} rx={6} fill={light} />
            <path d="M200 140l75 50 75-50" fill="none" stroke={dark} strokeOpacity={0.2} strokeWidth={3} />
            <Mark x={225} y={210} s={22} c={c} />
          </g>
          <g transform="rotate(-5 160 150)">
            <rect x={80} y={35} width={160} height={220} rx={6} fill={dark} opacity={0.2} transform="translate(6 8)" />
            <rect x={80} y={35} width={160} height={220} rx={6} fill={light} />
            <Mark x={110} y={65} s={30} c={c} />
            <rect x={132} y={58} width={60} height={7} rx={3.5} fill={dark} />
            <rect x={132} y={70} width={40} height={5} rx={2.5} fill={dark} opacity={0.4} />
            <Bars x={98} y={100} w={120} c={dark} rows={4} gap={12} />
            <Bars x={98} y={160} w={120} c={dark} rows={3} gap={12} />
            <rect x={80} y={240} width={160} height={15} fill={accent} />
          </g>
        </g>
      );
  }
}

const VARIANT_TRANSFORM = [
  "",
  "translate(200 150) scale(1.32) translate(-200 -150)",
  "translate(200 150) scale(0.82) translate(-200 -150)",
  "translate(200 150) rotate(-4) scale(0.92) translate(-200 -150)",
];

/** Decorative-but-meaningful product visual, rendered as accessible SVG. */
export function ServiceArt({ kind, palette, variant = 0, title, className }: Props) {
  const uid = useId().replace(/:/g, "");
  const [c1, c2, accent, ink] = palette;
  const ctx: Ctx = { c1, c2, accent, dark: isLight(ink) ? "#16123A" : ink, light: "#FFFFFF" };
  const v = variant % 4;

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={v === 3 ? "#FBFAF7" : c1} />
          <stop offset="1" stopColor={v === 3 ? "#F1EDFF" : c2} />
        </linearGradient>
        <pattern id={`p${uid}`} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="#FFFFFF" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#g${uid})`} />
      {v === 2 && <rect width="400" height="300" fill={`url(#p${uid})`} />}
      {v === 3 ? (
        <>
          <circle cx="320" cy="60" r="90" fill={c1} opacity="0.35" />
          <circle cx="60" cy="260" r="80" fill={c2} opacity="0.45" />
          <rect x="0" y="250" width="400" height="50" fill={ctx.dark} opacity="0.05" />
        </>
      ) : (
        <>
          <circle cx="345" cy="40" r="70" fill="#FFFFFF" opacity="0.14" />
          <circle cx="40" cy="275" r="90" fill="#FFFFFF" opacity="0.1" />
        </>
      )}
      <g transform={VARIANT_TRANSFORM[v]}>{draw(kind, ctx)}</g>
    </svg>
  );
}
