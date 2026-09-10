import { ArrowDownLeft, ArrowUpRight, Sparkles, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { DashboardSummary as DashboardSummaryData } from "@/lib/api";

const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function FinancialSummary({ data }: { data: DashboardSummaryData }) {
  const summary = [
    { label: "Patrimônio líquido", value: data.net_worth, description: "Dados reais da sua conta", icon: Sparkles, tone: "bg-slate-950 text-white" },
    { label: "Saldo total", value: data.total_balance, description: `${data.accounts_count} contas cadastradas`, icon: Wallet, tone: "bg-slate-200 text-slate-950" },
    { label: "Receitas no mês", value: data.income, description: "Nenhuma receita registrada", icon: ArrowDownLeft, tone: "bg-slate-100 text-slate-700" },
    { label: "Despesas no mês", value: data.expenses, description: "Nenhuma despesa registrada", icon: ArrowUpRight, tone: "bg-slate-300 text-slate-950" },
  ];

  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{summary.map(({ label, value, description, icon: Icon, tone }) => <Card key={label} className="relative overflow-hidden"><div className={`mb-7 grid size-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{formatCurrency(value)}</p><p className="mt-2 text-xs text-slate-500">{description}</p></Card>)}</section>;
}