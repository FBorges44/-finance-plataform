"use client";

import { FormEvent, useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { createAccount, getAccounts, type Account } from "@/lib/api";

const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [initialBalance, setInitialBalance] = useState("0");
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
    if (!token) {
      setError("Faça login para cadastrar uma conta.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const account = await createAccount(token, { name, institution, account_type: accountType, initial_balance: Number(initialBalance.replace(",", ".")) || 0 });
      setAccounts((current) => [...current, account]);
      setName("");
      setInstitution("");
      setInitialBalance("0");
    } catch {
      setError("Não foi possível salvar a conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AppShell><div className="space-y-7"><section><p className="eyebrow">Base financeira</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Contas</h2><p className="mt-2 text-sm text-slate-500">Cadastre onde seu dinheiro está guardado.</p></section><div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><section className="surface-card p-6"><h3 className="text-lg font-bold">Suas contas</h3>{accounts.length === 0 ? <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center"><p className="font-semibold">Você ainda não possui contas cadastradas</p><p className="mt-2 text-sm text-slate-500">Adicione sua primeira conta ao lado.</p></div> : <div className="mt-5 divide-y divide-slate-100">{accounts.map((account) => <div key={account.id} className="flex items-center justify-between py-4"><div><p className="font-semibold">{account.name}</p><p className="mt-1 text-xs text-slate-500">{account.institution} · {account.account_type}</p></div><strong>{formatCurrency(Number(account.balance))}</strong></div>)}</div>}</section><section className="surface-card p-6"><h3 className="text-lg font-bold">Adicionar conta</h3><form className="mt-5 space-y-4" onSubmit={handleSubmit}><label className="block text-sm font-medium">Nome<input className="field mt-2" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nubank" required /></label><label className="block text-sm font-medium">Instituição<input className="field mt-2" value={institution} onChange={(event) => setInstitution(event.target.value)} placeholder="Nubank" required /></label><label className="block text-sm font-medium">Tipo<select className="field mt-2" value={accountType} onChange={(event) => setAccountType(event.target.value)}><option value="checking">Conta corrente</option><option value="savings">Poupança</option><option value="wallet">Carteira</option></select></label><label className="block text-sm font-medium">Saldo inicial<input className="field mt-2" type="number" step="0.01" value={initialBalance} onChange={(event) => setInitialBalance(event.target.value)} /></label>{error && <p className="text-sm text-slate-700" role="alert">{error}</p>}<button className="button-primary w-full disabled:opacity-60" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Adicionar conta"}</button></form></section></div></div></AppShell>;
}
