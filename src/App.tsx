import React, { useMemo, useState } from "react";
import LoanForm from "./components/LoanForm";
import SummaryCards from "./components/SummaryCards";
import LoanChart from "./components/LoanChart";
import AmortizationTable from "./components/AmortizationTable";
import { computeLoan, computeAmortization } from "./loanUtils";
import type { LoanInputs } from "./loanUtils";

const DEFAULT_INPUTS: LoanInputs = {
  principal: 200000,
  annualRate: 3.5,
  durationValue: 20,
  durationUnit: "years",
};

export default function App() {
  const [inputs, setInputs] = useState<LoanInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => computeLoan(inputs), [inputs]);
  const amortization = useMemo(
    () => (results ? computeAmortization(inputs) : []),
    [inputs, results]
  );

  const hasError =
    inputs.principal <= 0 ||
    inputs.durationValue <= 0 ||
    inputs.annualRate < 0;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">Calculatrice de prêt</h1>
            <p className="text-xs text-slate-500 leading-tight">Mensualités, intérêts et tableau d&apos;amortissement</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-1 space-y-4">
            <LoanForm inputs={inputs} onChange={setInputs} />

            {/* Info note */}
            <p className="text-xs text-slate-500 px-1 leading-relaxed">
              Formule d&apos;amortissement classique à taux fixe.
              Les résultats sont indicatifs et n&apos;incluent pas les frais annexes.
            </p>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-5">
            {hasError ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-700 font-medium">
                Veuillez saisir un montant emprunté et une durée valides (supérieurs à 0).
              </div>
            ) : results ? (
              <>
                <SummaryCards results={results} />
                <LoanChart results={results} amortization={amortization} />
                <AmortizationTable rows={amortization} />
              </>
            ) : null}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <p className="text-center text-xs text-slate-500">
          Calculs 100% navigateur — aucune donnée transmise — Licence MIT
        </p>
      </footer>
    </div>
  );
}
