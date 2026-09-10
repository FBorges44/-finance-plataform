import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function BudgetPreview() {
  return <Card><div className="flex items-center justify-between"><div><p className="eyebrow">Planejamento</p><h2 className="mt-1 text-lg font-bold">Orçamento do mês</h2></div><Badge tone="positive">Dentro do limite</Badge></div><div className="mt-6 flex items-end justify-between"><span className="text-sm text-slate-500">R$ 3.214 de R$ 5.000</span><strong className="text-lg">64%</strong></div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full w-[64%] rounded-full bg-[#10252a]" /></div></Card>;
}