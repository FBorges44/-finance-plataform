"use client";

import { ArrowDownLeft, ArrowUpRight, CalendarClock, ChevronRight, CircleAlert, CreditCard, MoreHorizontal, Plus, Sparkles, Target, Wallet } from "lucide-react";

const bars = [34, 48, 42, 67, 53, 72, 61, 84, 69, 91, 77, 88];
const transactions = [
  { title: "Salário mensal", category: "Receitas", date: "Hoje, 09:12", amount: "+ R$ 4.500,00", positive: true, icon: ArrowDownLeft },
  { title: "Mercado do bairro", category: "Alimentação", date: "Ontem, 18:40", amount: "− R$ 186,40", positive: false, icon: Wallet },
  { title: "Assinatura streaming", category: "Lazer", date: "08 set, 08:05", amount: "− R$ 39,90", positive: false, icon: CreditCard },
];

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Wallet; tone: string }) {
  return (
    <article className="surface-card relative overflow-hidden p-5">
      <div className={`mb-7 grid size-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

export function DashboardView() {
  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Seu panorama financeiro</p>
          <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">Olá, Francisco <span className="text-orange-400">✦</span></h2>
          <p className="mt-2 text-sm text-slate-500">Um retrato calmo das suas escolhas até aqui.</p>
        </div>
        <button className="button-primary"><Plus size={17} /> Nova movimentação</button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Patrimônio líquido" value="R$ 125.430" detail="↑ 6,8% desde janeiro" icon={Sparkles} tone="bg-lime-200 text-lime-900" />
        <MetricCard label="Saldo total" value="R$ 18.270" detail="Disponível em 4 contas" icon={Wallet} tone="bg-sky-100 text-sky-800" />
        <MetricCard label="Receitas no mês" value="R$ 6.840" detail="↑ 12,4% vs. agosto" icon={ArrowDownLeft} tone="bg-emerald-100 text-emerald-800" />
        <MetricCard label="Despesas no mês" value="R$ 3.214" detail="↓ 4,1% vs. agosto" icon={ArrowUpRight} tone="bg-orange-100 text-orange-800" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div><p className="eyebrow">Ritmo do mês</p><h3 className="mt-1 text-lg font-bold">Fluxo de caixa</h3></div>
            <button className="select-button">Últimos 12 meses <ChevronRight size={14} /></button>
          </div>
          <div className="mt-8 flex h-52 items-end gap-2 border-b border-slate-100 pb-0 sm:gap-4">
            {bars.map((height, index) => <div key={index} className="group flex h-full flex-1 flex-col justify-end"><div className={`rounded-t-lg transition-all group-hover:opacity-80 ${index > 8 ? "bg-[#10252a]" : "bg-slate-200"}`} style={{ height: `${height}%` }} /><span className="mt-3 text-center text-[10px] text-slate-400">{["Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"][index]}</span></div>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#10252a]" /> Receitas</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-slate-200" /> Despesas</span><span className="ml-auto font-semibold text-emerald-700">Saldo positivo este mês</span></div>
        </article>

        <article className="surface-card overflow-hidden p-5 sm:p-6">
          <div className="flex items-start justify-between"><div><p className="eyebrow">Onde vai seu dinheiro</p><h3 className="mt-1 text-lg font-bold">Gastos por categoria</h3></div><button className="icon-button" aria-label="Mais opções"><MoreHorizontal size={18} /></button></div>
          <div className="mx-auto mt-8 grid size-44 place-items-center rounded-full" style={{ background: "conic-gradient(#f5b89b 0 32%, #b8d9c4 32% 56%, #b9c7ed 56% 73%, #d9d5c9 73% 100%)" }}><div className="grid size-28 place-items-center rounded-full bg-white"><span className="text-center"><strong className="block text-xl">R$ 3.214</strong><small className="text-[10px] text-slate-500">este mês</small></span></div></div>
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">{[["Alimentação", "32%", "bg-[#f5b89b]"], ["Casa", "24%", "bg-[#b8d9c4]"], ["Transporte", "17%", "bg-[#b9c7ed]"], ["Outros", "27%", "bg-[#d9d5c9]"]].map(([label, value, color]) => <div key={label} className="flex items-center gap-2"><i className={`size-2 rounded-full ${color}`} /><span className="text-slate-500">{label}</span><b className="ml-auto">{value}</b></div>)}</div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="eyebrow">Movimentações recentes</p><h3 className="mt-1 text-lg font-bold">Últimas transações</h3></div><a href="/transactions" className="text-xs font-semibold text-slate-500 hover:text-slate-950">Ver todas <ChevronRight className="inline" size={14} /></a></div>
          <div className="mt-5 divide-y divide-slate-100">{transactions.map(({ title, category, date, amount, positive, icon: Icon }) => <div key={title} className="flex items-center gap-3 py-3"><span className={`grid size-10 place-items-center rounded-xl ${positive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}><Icon size={17} /></span><span className="min-w-0 flex-1"><b className="block truncate text-sm">{title}</b><small className="text-xs text-slate-500">{category} · {date}</small></span><strong className={positive ? "text-sm text-emerald-700" : "text-sm"}>{amount}</strong></div>)}</div>
        </article>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <article className="surface-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">Próximos vencimentos</p><h3 className="mt-1 text-lg font-bold">Nada fora do radar</h3></div><CalendarClock size={19} className="text-orange-400" /></div><div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50 p-3"><span><b className="block text-sm">Fatura Nubank</b><small className="text-xs text-slate-500">vence em 8 dias</small></span><strong className="text-sm">R$ 1.240</strong></div></article>
          <article className="surface-card bg-[#10252a] p-5 text-white sm:p-6"><div className="flex items-start justify-between"><div><p className="eyebrow text-lime-300">Sua próxima conquista</p><h3 className="mt-1 text-lg font-bold">Reserva de emergência</h3></div><Target size={19} className="text-lime-300" /></div><div className="mt-5 flex items-end justify-between"><div><strong className="text-2xl">75%</strong><small className="ml-2 text-xs text-slate-400">concluído</small></div><span className="text-xs text-slate-400">R$ 7.500 / R$ 10.000</span></div><div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-lime-300" /></div></article>
        </div>
      </section>

      <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-900"><CircleAlert size={16} /><span><b>Visão demonstrativa:</b> estes números serão substituídos pelos seus dados quando a API financeira estiver conectada.</span></div>
    </div>
  );
}
