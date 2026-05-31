import React, { useState } from "react";
import type { LoanResults } from "../loanUtils";
import type { AmortizationRow } from "../loanUtils";
import { formatEur } from "../loanUtils";

interface Props {
  results: LoanResults;
  amortization: AmortizationRow[];
}

type ChartMode = "donut" | "balance";

/* ---- Donut Chart ---- */
function DonutChart({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  if (total <= 0) return null;

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 72;
  const strokeWidth = 26;

  const circumference = 2 * Math.PI * r;
  const capitalRatio = principal / total;
  const capitalArc = circumference * capitalRatio;
  const interestArc = circumference * (1 - capitalRatio);

  // Starting at top (−90°)
  const capitalOffset = 0;
  const interestOffset = -(circumference * capitalRatio);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width={size} height={size} role="img" aria-label="Répartition capital / intérêts">
          {/* Background circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
          {/* Capital arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${capitalArc} ${circumference - capitalArc}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="butt"
            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
          />
          {/* Interest arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${interestArc} ${circumference - interestArc}`}
            strokeDashoffset={circumference * 0.25 + interestOffset}
            strokeLinecap="butt"
            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
          />
          {/* Center label */}
          <text x={cx} y={cy - 8} textAnchor="middle" className="text-xs" fill="#64748b" fontSize={11} fontFamily="Inter, sans-serif">
            Capital
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="#1e293b" fontSize={13} fontWeight={700} fontFamily="Inter, sans-serif">
            {(capitalRatio * 100).toFixed(1)}%
          </text>
        </svg>
      </div>
      {/* Legend */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
          <div>
            <div className="font-medium text-slate-700">Capital</div>
            <div className="text-slate-500 text-xs">{formatEur(principal)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-violet-500" />
          <div>
            <div className="font-medium text-slate-700">Intérêts</div>
            <div className="text-slate-500 text-xs">{formatEur(interest)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Balance Line Chart ---- */
function BalanceChart({ amortization }: { amortization: AmortizationRow[] }) {
  if (amortization.length === 0) return null;

  const W = 480;
  const H = 180;
  const padL = 60;
  const padR = 16;
  const padT = 12;
  const padB = 36;

  const maxBalance = amortization[0].remainingBalance + amortization[0].principal;
  const n = amortization.length;

  const xScale = (i: number) => padL + ((i / (n - 1)) * (W - padL - padR));
  const yScale = (v: number) => padT + ((1 - v / maxBalance) * (H - padT - padB));

  // Build polyline points for remaining balance
  const balancePoints = amortization
    .map((row, i) => `${xScale(i)},${yScale(row.remainingBalance)}`)
    .join(" ");

  // Y axis ticks
  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (maxBalance * i) / yTicks);

  // X axis ticks (years)
  const xTickEvery = Math.ceil(n / 8);
  const xTicks: number[] = [];
  for (let i = 0; i < n; i += xTickEvery) xTicks.push(i);
  if (!xTicks.includes(n - 1)) xTicks.push(n - 1);

  const formatK = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M€`;
    if (v >= 1_000) return `${Math.round(v / 1_000)}k€`;
    return `${Math.round(v)}€`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W }}
        role="img"
        aria-label="Évolution du capital restant dû"
        className="mx-auto"
      >
        {/* Grid lines */}
        {yTickValues.map((v, i) => (
          <line
            key={i}
            x1={padL}
            y1={yScale(v)}
            x2={W - padR}
            y2={yScale(v)}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        ))}

        {/* Y axis labels */}
        {yTickValues.map((v, i) => (
          <text
            key={i}
            x={padL - 6}
            y={yScale(v) + 4}
            textAnchor="end"
            fill="#94a3b8"
            fontSize={9}
            fontFamily="Inter, sans-serif"
          >
            {formatK(v)}
          </text>
        ))}

        {/* X axis labels (month → année) */}
        {xTicks.map((idx) => (
          <text
            key={idx}
            x={xScale(idx)}
            y={H - padB + 14}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={9}
            fontFamily="Inter, sans-serif"
          >
            {idx % 12 === 0 ? `A${idx / 12}` : `M${idx + 1}`}
          </text>
        ))}

        {/* Area fill */}
        <polygon
          points={`${padL},${H - padB} ${balancePoints} ${xScale(n - 1)},${H - padB}`}
          fill="#3b82f6"
          fillOpacity={0.08}
        />

        {/* Balance line */}
        <polyline
          points={balancePoints}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Axis lines */}
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#cbd5e1" strokeWidth={1} />
      </svg>
    </div>
  );
}

/* ---- Main Component ---- */
export default function LoanChart({ results, amortization }: Props) {
  const [mode, setMode] = useState<ChartMode>("donut");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Visualisation</h2>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm">
          <button
            onClick={() => setMode("donut")}
            className={`px-4 py-1.5 font-medium transition ${
              mode === "donut"
                ? "bg-blue-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Répartition
          </button>
          <button
            onClick={() => setMode("balance")}
            className={`px-4 py-1.5 font-medium transition ${
              mode === "balance"
                ? "bg-blue-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Capital restant
          </button>
        </div>
      </div>

      <div className="flex justify-center py-2">
        {mode === "donut" ? (
          <DonutChart principal={results.principal} interest={results.totalInterest} />
        ) : (
          <BalanceChart amortization={amortization} />
        )}
      </div>
    </div>
  );
}
