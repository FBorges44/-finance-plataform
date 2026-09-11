"use client";

import { FormEvent, useEffect, useState } from "react";

import { createCategory, createTransaction, deleteTransaction, getAccounts, getCategories, getTransactions, updateTransaction, type Account, type Category, type Transaction } from "@/lib/api";

const formatCurrency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");

export function TransactionsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    account_id: "",
    description: "",
    category: "",
    transaction_type: "expense" as "income" | "expense",
    amount: "",
    transaction_date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    const token = localStorage.getItem("folio_access_token");
    if (!token) {
      queueMicrotask(() => {
        setError("Faça login para visualizar suas transações.");
        setIsLoading(false);
      });
      return;
    }

    Promise.all([getAccounts(token), getTransactions(token), getCategories(token)])
      .then(([loadedAccounts, loadedTransactions, loadedCategories]) => {
        setAccounts(loadedAccounts);
        setTransactions(loadedTransactions);
        setCategories(loadedCategories);
        setForm((current) => ({ ...current, account_id: current.account_id || loadedAccounts[0]?.id || "" }));
      })
      .catch(() => setError("Não foi possível carregar suas transações."))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem("folio_access_token");
    if (!token || !form.account_id) return;

    const amount = Number(form.amount.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        amount,
      };
      const transaction = editingId ? await updateTransaction(token, editingId, payload) : await createTransaction(token, payload);
      setTransactions((current) => editingId ? current.map((item) => item.id === editingId ? transaction : item) : [transaction, ...current]);
      setEditingId(null);
      setForm((current) => ({ ...current, description: "", category: "", amount: "" }));
    } catch {
      setError("Não foi possível salvar a transação. Confira os dados e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem("folio_access_token");
    if (!token || !window.confirm("Excluir esta transação?")) return;
    try {
      await deleteTransaction(token, id);
      setTransactions((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("Não foi possível excluir a transação.");
    }
  }

  function startEditing(transaction: Transaction) {
    setEditingId(transaction.id);
    setForm({ account_id: transaction.account_id, description: transaction.description, category: transaction.category, transaction_type: transaction.transaction_type, amount: String(transaction.amount), transaction_date: transaction.transaction_date });
  }

  async function handleCreateCategory() {
    const token = localStorage.getItem("folio_access_token");
    const name = window.prompt("Nome da nova categoria");
    if (!token || !name?.trim()) return;
    try {
      const category = await createCategory(token, { name: name.trim(), category_type: form.transaction_type });
      setCategories((current) => [...current, category]);
      setForm((current) => ({ ...current, category: category.name }));
    } catch {
      setError("Não foi possível criar a categoria.");
    }
  }

  return <div className="space-y-7">
    <section><p className="eyebrow">Movimentações</p><h2 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Transações</h2><p className="mt-2 text-sm text-slate-500">Registre receitas e despesas para acompanhar sua vida financeira.</p></section>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <form className="surface-card space-y-4 p-6" onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold">Nova transação</h3>
        <label className="block text-sm font-medium">Conta<select className="field mt-2" value={form.account_id} onChange={(event) => setForm({ ...form, account_id: event.target.value })} required><option value="">Selecione uma conta</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name} · {account.institution}</option>)}</select></label>
        <label className="block text-sm font-medium">Descrição<input className="field mt-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Ex.: Mercado" required /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Tipo<select className="field mt-2" value={form.transaction_type} onChange={(event) => setForm({ ...form, transaction_type: event.target.value as "income" | "expense" })}><option value="expense">Despesa</option><option value="income">Receita</option></select></label><label className="block text-sm font-medium">Valor<input className="field mt-2" inputMode="decimal" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0,00" required /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Categoria<select className="field mt-2" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required><option value="">Selecione uma categoria</option>{categories.filter((category) => category.category_type === form.transaction_type).map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></label><label className="block text-sm font-medium">Data<input className="field mt-2" type="date" value={form.transaction_date} onChange={(event) => setForm({ ...form, transaction_date: event.target.value })} required /></label></div>
        <div className="flex gap-2"><button className="button-primary flex-1 justify-center" type="submit" disabled={isSaving || accounts.length === 0}>{isSaving ? "Salvando..." : editingId ? "Atualizar transação" : "Adicionar transação"}</button><button className="select-button" type="button" onClick={handleCreateCategory}>Nova categoria</button></div>
        {editingId && <button className="text-xs font-semibold text-slate-500 underline" type="button" onClick={() => { setEditingId(null); setForm((current) => ({ ...current, description: "", category: "", amount: "" })); }}>Cancelar edição</button>}
        {accounts.length === 0 && !isLoading && <p className="text-xs text-slate-500">Cadastre uma conta antes de adicionar movimentações.</p>}
      </form>
      <section className="surface-card overflow-hidden"><div className="border-b border-slate-100 p-6"><h3 className="text-lg font-bold">Histórico recente</h3><p className="mt-1 text-sm text-slate-500">As últimas movimentações das suas contas.</p></div>{isLoading ? <p className="p-6 text-sm text-slate-500">Carregando transações...</p> : transactions.length === 0 ? <p className="p-6 text-sm text-slate-500">Nenhuma transação registrada.</p> : <div className="divide-y divide-slate-100">{transactions.map((transaction) => <div className="flex items-center gap-4 p-4" key={transaction.id}><div className={`grid size-10 shrink-0 place-items-center rounded-xl text-lg ${transaction.transaction_type === "income" ? "bg-emerald-100" : "bg-orange-100"}`}>{transaction.transaction_type === "income" ? "↑" : "↓"}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{transaction.description}</p><p className="text-xs text-slate-500">{transaction.category} · {formatDate(transaction.transaction_date)}</p></div><strong className={transaction.transaction_type === "income" ? "text-emerald-700" : "text-slate-950"}>{transaction.transaction_type === "income" ? "+ " : "- "}{formatCurrency(transaction.amount)}</strong><button className="text-xs font-semibold text-slate-500 underline" onClick={() => startEditing(transaction)}>Editar</button><button className="text-xs font-semibold text-red-600 underline" onClick={() => handleDelete(transaction.id)}>Excluir</button></div>)}</div>}</section>
    </section>
  </div>;
}
