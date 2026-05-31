import React, { useState } from "react";
import type { AmortizationRow } from "../loanUtils";
import { formatEur } from "../loanUtils";

interface Props {
  rows: AmortizationRow[];
}

const PAGE_SIZE = 24;

export default function AmortizationTable({ rows }: Props) {
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const visibleRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (rows.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition"
        aria-expanded={expanded}
      >
        <h2 className="text-lg font-semibold text-slate-800">
          Tableau d&apos;amortissement
          <span className="ml-2 text-sm font-normal text-slate-400">({rows.length} mois)</span>
        </h2>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Tableau d'amortissement mensuel">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-16">
                    Mois
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Mensualité
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Capital
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Intérêts
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Capital restant
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, idx) => (
                  <tr
                    key={row.month}
                    className={`border-b border-slate-100 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    } hover:bg-blue-50/40 transition-colors`}
                  >
                    <td className="px-4 py-2.5 text-slate-500 font-medium">{row.month}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-800">
                      {formatEur(row.payment)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-blue-600 font-medium">
                      {formatEur(row.principal)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-violet-500 font-medium">
                      {formatEur(row.interest)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-700">
                      {formatEur(row.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500">
                Mois {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, rows.length)} sur {rows.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  aria-label="Page précédente"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  &#8592; Préc.
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pageIdx =
                    totalPages <= 7
                      ? i
                      : page < 4
                      ? i
                      : page > totalPages - 4
                      ? totalPages - 7 + i
                      : page - 3 + i;
                  return (
                    <button
                      key={pageIdx}
                      onClick={() => setPage(pageIdx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        pageIdx === page
                          ? "bg-blue-500 text-white"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {pageIdx + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  aria-label="Page suivante"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  Suiv. &#8594;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
