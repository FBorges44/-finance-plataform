import { Target } from "lucide-react";

import { Card } from "@/components/ui/card";

export function GoalsPreview() {
  return <Card className="bg-slate-950 text-white"><div className="flex items-start justify-between"><div><p className="eyebrow text-slate-400">Sua próxima conquista</p><h2 className="mt-1 text-lg font-bold">Reserva de emergência</h2></div><Target size={19} className="text-white" /></div><div className="mt-5 flex items-end justify-between"><div><strong className="text-2xl">75%</strong><small className="ml-2 text-xs text-slate-400">concluído</small></div><span className="text-xs text-slate-400">R$ 7.500 / R$ 10.000</span></div><div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-white" /></div></Card>;
}