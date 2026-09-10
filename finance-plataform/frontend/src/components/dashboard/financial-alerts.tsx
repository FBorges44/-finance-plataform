import { CircleAlert } from "lucide-react";

import { Card } from "@/components/ui/card";

export function FinancialAlerts() {
  return <Card className="border-slate-300 bg-slate-100"><div className="flex gap-3 text-slate-950"><CircleAlert size={18} className="mt-0.5 shrink-0" /><div><h2 className="font-semibold">Atenção à fatura</h2><p className="mt-1 text-sm leading-6">Sua fatura Nubank vence em 8 dias e representa 38% do orçamento deste mês.</p></div></div></Card>;
}