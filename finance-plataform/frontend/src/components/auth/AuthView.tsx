"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { login, register } from "@/lib/api";

export function AuthView({ mode }: { mode: "login" | "register" | "forgot" | "reset" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = {
    login: ["Bom te ver de volta", "Entre para continuar cuidando do seu dinheiro.", "Entrar na minha conta"],
    register: ["Comece pelo que importa", "Um espaço mais claro para suas decisões financeiras.", "Criar minha conta"],
    forgot: ["Recupere seu acesso", "Enviaremos um link seguro para redefinir sua senha.", "Enviar link de recuperação"],
    reset: ["Crie uma nova senha", "Escolha uma senha forte para proteger sua conta.", "Salvar nova senha"],
  }[mode];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode !== "login" && mode !== "register") return;
    setError("");
    setIsSubmitting(true);
    try {
      if (mode === "register") {
        await register(email, password);
      }
      const response = await login(email, password);
      localStorage.setItem("folio_access_token", response.access_token);
      router.push("/dashboard");
    } catch {
      setError(mode === "register" ? "Não foi possível criar a conta. Verifique os dados." : "Não foi possível entrar. Verifique seu e-mail e senha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <main className="grid min-h-screen bg-white lg:grid-cols-[0.82fr_1.18fr]">
    <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white font-black text-slate-950">F</span><span className="font-bold tracking-tight">Folio</span></Link><div className="max-w-md"><p className="eyebrow text-slate-400">Finanças com presença</p><h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-[-0.05em]">Clareza para o dinheiro que move sua vida.</h1><p className="mt-6 text-sm leading-7 text-slate-400">Um lugar para olhar suas escolhas com mais contexto, menos ruído e bastante autonomia.</p></div><p className="text-xs text-slate-500">Privacidade desde o primeiro passo.</p></section>
    <section className="flex items-center justify-center px-5 py-12 sm:px-10"><div className="w-full max-w-md"><div className="mb-10 lg:hidden"><Link href="/" className="flex items-center gap-3 font-bold"><span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">F</span> Folio</Link></div><div className="mb-8"><p className="eyebrow">Conta pessoal</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">{copy[0]}</h2><p className="mt-2 text-sm text-slate-500">{copy[1]}</p></div><form className="space-y-4" onSubmit={handleSubmit}>{mode !== "reset" && <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700">Email</span><span className="relative block"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className="field pl-10" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" required={mode === "login" || mode === "register"} /></span></label>}{mode !== "forgot" && <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700">Senha</span><span className="relative block"><LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className="field pl-10 pr-10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" required={mode === "login" || mode === "register"} minLength={mode === "register" ? 8 : undefined} /><Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /></span></label>}{mode === "register" && <label className="flex items-start gap-2 text-xs text-slate-500"><input type="checkbox" className="mt-0.5" required /> Aceito os termos de uso e a política de privacidade.</label>}{error && <p className="text-sm text-slate-700" role="alert">{error}</p>}<button className="button-primary w-full disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? "Processando..." : copy[2]} <ArrowRight size={16} /></button></form><div className="mt-7 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-slate-700" /> Seus dados são protegidos desde o primeiro acesso.</div><div className="mt-8 text-center text-sm text-slate-500">{mode === "login" ? <>Ainda não tem conta? <Link className="font-semibold text-slate-950" href="/register">Criar conta</Link></> : <Link className="font-semibold text-slate-950" href="/login">Voltar para o login</Link>}</div></div></section>
  </main>;
}
