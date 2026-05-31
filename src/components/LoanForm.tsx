import React from "react";
import type { LoanInputs } from "../loanUtils";

interface Props {
  inputs: LoanInputs;
  onChange: (inputs: LoanInputs) => void;
}

export default function LoanForm({ inputs, onChange }: Props) {
  const update = (field: keyof LoanInputs, value: string | number | "years" | "months") => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Paramètres du prêt</h2>

      {/* Montant */}
      <div className="space-y-1.5">
        <label htmlFor="principal" className="block text-sm font-medium text-slate-600">
          Montant emprunté (MAD)
        </label>
        <div className="relative">
          <input
            id="principal"
            type="number"
            min={0}
            step={1000}
            value={inputs.principal || ""}
            onChange={(e) => update("principal", parseFloat(e.target.value) || 0)}
            placeholder="Ex. : 200 000"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">DH</span>
        </div>
      </div>

      {/* Taux annuel */}
      <div className="space-y-1.5">
        <label htmlFor="annualRate" className="block text-sm font-medium text-slate-600">
          Taux annuel (%)
        </label>
        <div className="relative">
          <input
            id="annualRate"
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={inputs.annualRate === 0 ? "0" : inputs.annualRate || ""}
            onChange={(e) => update("annualRate", parseFloat(e.target.value) || 0)}
            placeholder="Ex. : 3.5"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">%</span>
        </div>
      </div>

      {/* Durée */}
      <div className="space-y-1.5">
        <label htmlFor="durationValue" className="block text-sm font-medium text-slate-600">
          Durée
        </label>
        <div className="flex gap-2">
          <input
            id="durationValue"
            type="number"
            min={1}
            step={1}
            value={inputs.durationValue || ""}
            onChange={(e) => update("durationValue", parseInt(e.target.value) || 0)}
            placeholder={inputs.durationUnit === "years" ? "Ex. : 20" : "Ex. : 240"}
            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <select
            value={inputs.durationUnit}
            onChange={(e) => update("durationUnit", e.target.value as "years" | "months")}
            aria-label="Unité de durée"
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
          >
            <option value="years">Années</option>
            <option value="months">Mois</option>
          </select>
        </div>
      </div>
    </div>
  );
}
