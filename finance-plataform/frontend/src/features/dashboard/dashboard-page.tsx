"use client";

import { useEffect, useState } from "react";

import { FinancialSummary } from "@/components/dashboard/financial-summary";
import { getDashboardSummary, type DashboardSummary } from "@/lib/api";

const emptySummary: DashboardSummary = {
  net_worth: 0,
  total_balance: 0,
  income: 0,
  expenses: 0,
  cash_flow: 0,
  accounts_count: 0,
  cards_count: 0,
  transactions_count: 0,
};

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      const token = localStorage.getItem("folio_access_token");
      if (!token) {
        setError("Faça login para visualizar seu dashboard.");
        setIsLoading(false);
        return;
      }

      getDashboardSummary(token)
        .then(setSummary)
        .catch(() => setError("Não foi possível carregar seus dados financeiros."))
        .finally(() => setIsLoading(false));
    });
  }, []);

  return <div className="space-y-7"><section><p className="eyebrow">Seu panorama financeiro</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">Seu Folio está pronto.</h2><p className="mt-2 text-sm text-slate-500">Comece adicionando sua primeira conta.</p></section>{isLoading ? <div className="surface-card p-6 text-sm text-slate-500">Carregando seus dados...</div> : <FinancialSummary data={summary} />}<section className="grid gap-4 sm:grid-cols-3"><div className="surface-card p-5"><p className="text-xs text-slate-500">Contas</p><p className="mt-2 text-2xl font-bold">{summary.accounts_count}</p></div><div className="surface-card p-5"><p className="text-xs text-slate-500">Cartões</p><p className="mt-2 text-2xl font-bold">{summary.cards_count}</p></div><div className="surface-card p-5"><p className="text-xs text-slate-500">Transações</p><p className="mt-2 text-2xl font-bold">{summary.transactions_count}</p></div></section>{error ? <div className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700" role="alert">{error}</div> : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="font-semibold text-slate-950">Nenhuma movimentação ainda</p><p className="mt-2 text-sm text-slate-500">Quando o módulo de contas estiver disponível, seu primeiro saldo aparecerá aqui.</p></div>}</div>;
}
