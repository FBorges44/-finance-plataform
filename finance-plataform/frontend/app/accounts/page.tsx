"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { createAccount, deleteAccount, getAccounts, updateAccount, type Account } from "@/lib/api";

const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({ name: "", institution: "", accountType: "checking", initialBalance: "0" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("folio_access_token");
    if (!token) return;
    getAccounts(token).then(setAccounts).catch(() => setError("Não foi possível carregar suas contas."));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem("folio_access_token");
    if (!token) return setError("Faça login para cadastrar uma conta.");
    const balance = Number(form.initialBalance.replace(",", "."));
    if (!editingId && !Number.isFinite(balance)) return setError("Informe um saldo inicial válido.");
    setIsSubmitting(true); setError("");
    try {
      const account = editingId
        ? await updateAccount(token, editingId, { name: form.name, institution: form.institution, account_type: form.accountType })
        : await createAccount(token, { name: form.name, institution: form.institution, account_type: form.accountType, initial_balance: balance });
      setAccounts((current) => editingId ? current.map((item) => item.id === editingId ? account : item) : [...current, account]);
      cancelEditing();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar a conta.");
    } finally { setIsSubmitting(false); }
  }

  function startEditing(account: Account) {
    setEditingId(account.id);
    setForm({ name: account.name, institution: account.institution, accountType: account.account_type, initialBalance: String(account.balance) });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm({ name: "", institution: "", accountType: "checking", initialBalance: "0" });
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem("folio_access_token");
    if (!token || !window.confirm("Excluir esta conta? As transações serão preservadas.")) return;
    try { await deleteAccount(token, id); setAccounts((current) => current.filter((account) => account.id !== id)); } catch { setError("Não foi possível excluir a conta."); }
  }

  return <AppShell><div className="space-y-7"><section><p className="eyebrow">Base financeira</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Contas</h2><p className="mt-2 text-sm text-slate-500">Cadastre onde seu dinheiro está guardado.</p></section>{error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}<div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><section className="surface-card p-6"><h3 className="text-lg font-bold">Suas contas</h3>{accounts.length === 0 ? <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center"><p className="font-semibold">Você ainda não possui contas cadastradas</p><p className="mt-2 text-sm text-slate-500">Adicione sua primeira conta ao lado.</p></div> : <div className="mt-5 divide-y divide-slate-100">{accounts.map((account) => <div key={account.id} className="flex items-center gap-3 py-4"><div className="min-w-0 flex-1"><p className="font-semibold">{account.name}</p><p className="mt-1 text-xs text-slate-500">{account.institution} · {account.account_type}</p></div><strong>{formatCurrency(Number(account.balance))}</strong><button className="text-xs font-semibold underline" onClick={() => startEditing(account)}>Editar</button><button className="text-xs font-semibold text-red-600 underline" onClick={() => handleDelete(account.id)}>Excluir</button></div>)}</div>}</section><section className="surface-card p-6"><h3 className="text-lg font-bold">{editingId ? "Editar conta" : "Adicionar conta"}</h3><form className="mt-5 space-y-4" onSubmit={handleSubmit}><label className="block text-sm font-medium">Nome<input className="field mt-2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nubank" required /></label><label className="block text-sm font-medium">Instituição<input className="field mt-2" value={form.institution} onChange={(event) => setForm({ ...form, institution: event.target.value })} placeholder="Nubank" required /></label><label className="block text-sm font-medium">Tipo<select className="field mt-2" value={form.accountType} onChange={(event) => setForm({ ...form, accountType: event.target.value })}><option value="checking">Conta corrente</option><option value="savings">Poupança</option><option value="wallet">Carteira</option></select></label>{!editingId && <label className="block text-sm font-medium">Saldo inicial<input className="field mt-2" type="number" step="0.01" value={form.initialBalance} onChange={(event) => setForm({ ...form, initialBalance: event.target.value })} /></label>}<button className="button-primary w-full" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : editingId ? "Atualizar conta" : "Adicionar conta"}</button>{editingId && <button type="button" className="text-xs underline" onClick={cancelEditing}>Cancelar</button>}</form></section></div></div></AppShell>;
}
