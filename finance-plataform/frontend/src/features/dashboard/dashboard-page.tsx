"use client";

import { useEffect, useState } from "react";

import { FinancialSummary } from "@/components/dashboard/financial-summary";
import { getDashboardSummary, getTransactions, type DashboardSummary, type Transaction } from "@/lib/api";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const token = localStorage.getItem("folio_access_token");
      if (!token) {
        setError("Faça login para visualizar seu dashboard.");
        setIsLoading(false);
        return;
      }

      Promise.all([getDashboardSummary(token), getTransactions(token)])
        .then(([loadedSummary, loadedTransactions]) => { setSummary(loadedSummary); setTransactions(loadedTransactions.slice(0, 5)); })
        .catch(() => setError("Não foi possível carregar seus dados financeiros."))
        .finally(() => setIsLoading(false));
    });
  }, []);

  const money = (value: number) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return <div className="space-y-7"><section><p className="eyebrow">Seu panorama financeiro</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">Seu Folio está pronto.</h2><p className="mt-2 text-sm text-slate-500">Resumo calculado a partir das suas contas e movimentações.</p></section>{isLoading ? <div className="surface-card p-6 text-sm text-slate-500">Carregando seus dados...</div> : <FinancialSummary data={summary} />}<section className="grid gap-4 sm:grid-cols-3"><div className="surface-card p-5"><p className="text-xs text-slate-500">Contas</p><p className="mt-2 text-2xl font-bold">{summary.accounts_count}</p></div><div className="surface-card p-5"><p className="text-xs text-slate-500">Cartões</p><p className="mt-2 text-2xl font-bold">{summary.cards_count}</p></div><div className="surface-card p-5"><p className="text-xs text-slate-500">Transações no mês</p><p className="mt-2 text-2xl font-bold">{summary.transactions_count}</p></div></section>{error ? <div className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700" role="alert">{error}</div> : <section className="surface-card overflow-hidden"><div className="border-b border-slate-100 p-6"><h3 className="text-lg font-bold">Últimas movimentações</h3><p className="mt-1 text-sm text-slate-500">Dados reais das suas transações.</p></div>{transactions.length === 0 ? <p className="p-6 text-sm text-slate-500">Nenhuma movimentação registrada.</p> : <div className="divide-y divide-slate-100">{transactions.map((transaction) => <div className="flex items-center gap-4 p-4" key={transaction.id}><div className={`grid size-9 place-items-center rounded-xl ${transaction.transaction_type === "income" ? "bg-emerald-100" : "bg-orange-100"}`}>{transaction.transaction_type === "income" ? "↑" : "↓"}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{transaction.description}</p><p className="text-xs text-slate-500">{transaction.category} · {transaction.transaction_date}</p></div><strong className={transaction.transaction_type === "income" ? "text-emerald-700" : "text-slate-950"}>{transaction.transaction_type === "income" ? "+ " : "- "}{money(transaction.amount)}</strong></div>)}</div>}</section>}</div>;
}
