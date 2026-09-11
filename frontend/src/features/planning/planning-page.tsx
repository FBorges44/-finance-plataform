"use client";

import { FormEvent, useEffect, useState } from "react";
import { createBudget, createGoal, createInvestment, getBudgets, getGoals, getInvestments, getReport, type Budget, type Goal, type Investment, type Report } from "@/lib/api";

type Mode = "goals" | "budgets" | "investments" | "net-worth" | "reports";
const money = (value: number) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function PlanningPage({ mode }: { mode: Mode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [form, setForm] = useState<Record<string, string>>({ name: "", target_amount: "", current_amount: "0", deadline: "", category: "", limit_amount: "", month: new Date().toISOString().slice(0, 7) + "-01", asset_type: "", amount: "", institution: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("folio_access_token");
    if (!token) { queueMicrotask(() => setError("Faça login para continuar.")); return; }
    const request = mode === "goals" ? getGoals(token).then(setGoals) : mode === "budgets" ? getBudgets(token).then(setBudgets) : mode === "investments" ? getInvestments(token).then(setInvestments) : getReport(token).then(setReport);
    request.catch(() => setError("Não foi possível carregar os dados."));
  }, [mode]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const token = localStorage.getItem("folio_access_token");
    if (!token) return;
    setSaving(true); setError("");
    try {
      if (mode === "goals") { const item = await createGoal(token, { name: form.name, target_amount: Number(form.target_amount.replace(",", ".")), current_amount: Number(form.current_amount.replace(",", ".")), deadline: form.deadline || null }); setGoals((items) => [item, ...items]); }
      if (mode === "budgets") { const item = await createBudget(token, { category: form.category, limit_amount: Number(form.limit_amount.replace(",", ".")), month: form.month }); setBudgets((items) => [item, ...items]); }
      if (mode === "investments") { const item = await createInvestment(token, { name: form.name, asset_type: form.asset_type, amount: Number(form.amount.replace(",", ".")), institution: form.institution }); setInvestments((items) => [item, ...items]); }
      setForm((current) => ({ ...current, name: "", target_amount: "", current_amount: "0", deadline: "", category: "", limit_amount: "", asset_type: "", amount: "", institution: "" }));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível salvar."); } finally { setSaving(false); }
  }

  const titles = { goals: ["Metas financeiras", "Planeje objetivos e acompanhe o progresso."], budgets: ["Orçamento", "Defina limites por categoria e acompanhe o uso."], investments: ["Investimentos", "Registre sua carteira e acompanhe o patrimônio."], "net-worth": ["Patrimônio líquido", "Saldo das contas mais investimentos registrados."], reports: ["Relatórios", "Resumo calculado a partir dos seus dados reais."] }[mode];
  return <div className="space-y-7"><section><p className="eyebrow">Folio finances</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.04em]">{titles[0]}</h2><p className="mt-2 text-sm text-slate-500">{titles[1]}</p></section>{error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    {(mode === "goals" || mode === "budgets" || mode === "investments") && <form className="surface-card grid gap-4 p-6 md:grid-cols-2" onSubmit={submit}><h3 className="text-lg font-bold md:col-span-2">Novo registro</h3>{mode === "goals" && <><input className="field" placeholder="Nome da meta" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><input className="field" inputMode="decimal" placeholder="Valor alvo" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} required /><input className="field" inputMode="decimal" placeholder="Valor já guardado" value={form.current_amount} onChange={(e) => setForm({ ...form, current_amount: e.target.value })} /><input className="field" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></>}{mode === "budgets" && <><input className="field" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /><input className="field" inputMode="decimal" placeholder="Limite mensal" value={form.limit_amount} onChange={(e) => setForm({ ...form, limit_amount: e.target.value })} required /><input className="field" type="date" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required /></>}{mode === "investments" && <><input className="field" placeholder="Nome do investimento" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><input className="field" placeholder="Tipo de ativo" value={form.asset_type} onChange={(e) => setForm({ ...form, asset_type: e.target.value })} required /><input className="field" inputMode="decimal" placeholder="Valor investido" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /><input className="field" placeholder="Instituição" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required /></>}<button className="button-primary md:col-span-2" disabled={saving}>{saving ? "Salvando..." : "Salvar registro"}</button></form>}
    {mode === "goals" && <div className="grid gap-4 md:grid-cols-2">{goals.map((item) => <article className="surface-card p-5" key={item.id}><h3 className="font-bold">{item.name}</h3><p className="mt-2 text-sm text-slate-500">{money(item.current_amount)} de {money(item.target_amount)}</p><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-lime-400" style={{ width: `${Math.min(100, item.current_amount / item.target_amount * 100)}%` }} /></div></article>)}</div>}
    {mode === "budgets" && <div className="grid gap-4 md:grid-cols-2">{budgets.map((item) => <article className="surface-card p-5" key={item.id}><h3 className="font-bold">{item.category}</h3><p className="mt-2 text-sm text-slate-500">{money(item.spent_amount)} usados de {money(item.limit_amount)}</p><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-400" style={{ width: `${Math.min(100, item.spent_amount / item.limit_amount * 100)}%` }} /></div></article>)}</div>}
    {mode === "investments" && <div className="grid gap-4 md:grid-cols-2">{investments.map((item) => <article className="surface-card p-5" key={item.id}><h3 className="font-bold">{item.name}</h3><p className="mt-1 text-xs text-slate-500">{item.asset_type} · {item.institution}</p><strong className="mt-5 block text-xl">{money(item.amount)}</strong></article>)}</div>}
    {(mode === "net-worth" || mode === "reports") && report && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["Receitas", report.income], ["Despesas", report.expenses], ["Fluxo de caixa", report.cash_flow], ["Saldo em contas", report.account_balance], ["Investimentos", report.investments], ["Patrimônio líquido", report.net_worth]].map(([label, value]) => <article className="surface-card p-5" key={String(label)}><p className="text-xs text-slate-500">{label}</p><strong className="mt-2 block text-2xl">{money(Number(value))}</strong></article>)}</div>}
    {mode === "reports" && report && <article className="surface-card p-6"><h3 className="text-lg font-bold">Despesas por categoria</h3>{Object.entries(report.by_category).map(([category, value]) => <div className="mt-4 flex justify-between border-b border-slate-100 pb-3 text-sm" key={category}><span>{category}</span><strong>{money(Number(value))}</strong></div>)}</article>}
  </div>;
}
