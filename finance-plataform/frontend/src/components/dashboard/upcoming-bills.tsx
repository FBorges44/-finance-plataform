import { CalendarClock, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";

const bills = [{ name: "Fatura Nubank", date: "vence em 8 dias", value: "R$ 1.240,50" }, { name: "Internet", date: "vence em 12 dias", value: "R$ 119,90" }, { name: "Energia", date: "vence em 15 dias", value: "R$ 186,40" }];

export function UpcomingBills() {
  return <Card><div className="flex items-start justify-between"><div><p className="eyebrow">Próximos vencimentos</p><h2 className="mt-1 text-lg font-bold">Contas no radar</h2></div><CalendarClock size={19} className="text-slate-950" /></div><div className="mt-5 divide-y divide-slate-100">{bills.map((bill) => <div key={bill.name} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium text-slate-900">{bill.name}</p><p className="mt-1 text-xs text-slate-500">{bill.date}</p></div><p className="font-semibold text-slate-950">{bill.value}</p></div>)}</div><a href="/invoices" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-950">Ver todos <ChevronRight size={14} /></a></Card>;
}