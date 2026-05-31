import React from "react";
import type { LoanResults } from "../loanUtils";
import { formatEur } from "../loanUtils";

interface Props {
  results: LoanResults;
}

interface CardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

function Card({ label, value, sub, accent = "blue" }: CardProps) {
  const accentMap: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    violet: "from-violet-500 to-violet-600",
  };
  const gradient = accentMap[accent] ?? accentMap["blue"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />
      <div className="p-5">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 truncate">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

export default function SummaryCards({ results }: Props) {
  const { monthlyPayment, totalCost, totalInterest, nMonths } = results;

  const years = Math.floor(nMonths / 12);
  const months = nMonths % 12;
  const durationLabel =
    years > 0 && months > 0
      ? `sur ${years} an${years > 1 ? "s" : ""} et ${months} mois`
      : years > 0
      ? `sur ${years} an${years > 1 ? "s" : ""}`
      : `sur ${months} mois`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        label="Mensualité"
        value={formatEur(monthlyPayment)}
        sub={durationLabel}
        accent="blue"
      />
      <Card
        label="Coût total"
        value={formatEur(totalCost)}
        sub="capital + intérêts"
        accent="violet"
      />
      <Card
        label="Intérêts totaux"
        value={formatEur(totalInterest)}
        sub={`${((totalInterest / totalCost) * 100).toFixed(1)}% du coût total`}
        accent="emerald"
      />
    </div>
  );
}
