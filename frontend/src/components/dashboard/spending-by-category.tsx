import { MoreHorizontal } from "lucide-react";

import { Card } from "@/components/ui/card";

const categories = [["Alimentação", "32%", "bg-slate-950"], ["Casa", "24%", "bg-slate-500"], ["Transporte", "17%", "bg-slate-300"], ["Outros", "27%", "bg-slate-200"]];

export function SpendingByCategory() {
  return <Card className="overflow-hidden"><div className="flex items-start justify-between"><div><p className="eyebrow">Onde vai seu dinheiro</p><h2 className="mt-1 text-lg font-bold">Gastos por categoria</h2></div><button className="icon-button" aria-label="Mais opções"><MoreHorizontal size={18} /></button></div><div className="mx-auto mt-8 grid size-44 place-items-center rounded-full" style={{ background: "conic-gradient(#111111 0 32%, #64748b 32% 56%, #cbd5e1 56% 73%, #e2e8f0 73% 100%)" }}><div className="grid size-28 place-items-center rounded-full bg-white"><span className="text-center"><strong className="block text-xl">R$ 3.214</strong><small className="text-[10px] text-slate-500">este mês</small></span></div></div><div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">{categories.map(([label, value, color]) => <div key={label} className="flex items-center gap-2"><i className={`size-2 rounded-full ${color}`} /><span className="text-slate-500">{label}</span><b className="ml-auto">{value}</b></div>)}</div></Card>;
}