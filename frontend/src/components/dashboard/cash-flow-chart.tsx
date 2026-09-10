import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";

const bars = [34, 48, 42, 67, 53, 72, 61, 84, 69, 91, 77, 88];
const months = ["Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"];

export function CashFlowChart() {
  return <Card className="min-h-[360px]"><div className="flex items-start justify-between"><div><p className="eyebrow">Ritmo do mês</p><h2 className="mt-1 text-lg font-bold">Fluxo de caixa</h2></div><button className="select-button">Últimos 12 meses <ChevronRight size={14} /></button></div><div className="mt-8 flex h-52 items-end gap-2 border-b border-slate-100 sm:gap-4">{bars.map((height, index) => <div key={months[index]} className="group flex h-full flex-1 flex-col justify-end"><div className={`rounded-t-lg transition-all group-hover:opacity-80 ${index > 8 ? "bg-slate-950" : "bg-slate-200"}`} style={{ height: `${height}%` }} /><span className="mt-3 text-center text-[10px] text-slate-400">{months[index]}</span></div>)}</div><div className="mt-5 flex flex-wrap gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-slate-950" /> Receitas</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-slate-200" /> Despesas</span><span className="ml-auto font-semibold text-slate-950">Saldo positivo este mês</span></div></Card>;
}