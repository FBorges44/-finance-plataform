"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";

import { getCurrentUser, login, register, requestPasswordReset, resetPassword } from "@/lib/api";

type AuthMode = "login" | "register" | "forgot" | "reset";

const copy: Record<AuthMode, { title: string; description: string; action: string }> = {
  login: { title: "Bom te ver de volta", description: "Entre para continuar cuidando do seu dinheiro.", action: "Entrar na minha conta" },
  register: { title: "Comece pelo que importa", description: "Um espaço mais claro para suas decisões financeiras.", action: "Criar minha conta" },
  forgot: { title: "Recupere seu acesso", description: "A recuperação de senha estará disponível em breve.", action: "Enviar link de recuperação" },
  reset: { title: "Crie uma nova senha", description: "A redefinição de senha estará disponível em breve.", action: "Salvar nova senha" },
};

export function AuthView({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== "login" && mode !== "register") return;
    const token = localStorage.getItem("folio_session_ready");
    if (!token) return;

    getCurrentUser(token)
      .then(() => router.replace("/dashboard"))
      .catch(() => localStorage.removeItem("folio_session_ready"));
  }, [mode, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "forgot") {
      setError("");
      setMessage("");
      setIsSubmitting(true);
      try {
        await requestPasswordReset(email);
        setMessage("Se houver uma conta para este e-mail, enviaremos as instruções de recuperação.");
      } catch {
        setError("Não foi possível solicitar a recuperação.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (mode === "reset") {
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) {
        setError("Link de recuperação inválido ou expirado.");
        return;
      }
      setError("");
      setIsSubmitting(true);
      try {
        await resetPassword(token, password);
        router.replace("/login");
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Não foi possível redefinir a senha.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (mode !== "login" && mode !== "register") {
      setError("Essa etapa ainda não está disponível.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      if (mode === "register") await register(email, password);
      await login(email, password);
      localStorage.setItem("folio_session_ready", "true");
      router.replace("/dashboard");
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "";
      if (mode === "register" && message.toLowerCase().includes("já cadastrado")) {
        setError("Este e-mail já possui uma conta. Entre usando a opção de login.");
      } else if (mode === "register" && message) {
        setError(message);
      } else {
        setError(mode === "register" ? "Não foi possível criar a conta." : "Não foi possível entrar. Verifique seu e-mail e senha.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isAuthForm = true;
  return <main className="grid min-h-screen bg-white lg:grid-cols-[0.82fr_1.18fr]">
    <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white font-black text-slate-950">F</span><span className="font-bold tracking-tight">Folio</span></Link><div className="max-w-md"><p className="eyebrow text-slate-400">Finanças com presença</p><h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-[-0.05em]">Clareza para o dinheiro que move sua vida.</h1><p className="mt-6 text-sm leading-7 text-slate-400">Um lugar para olhar suas escolhas com mais contexto, menos ruído e bastante autonomia.</p></div><p className="text-xs text-slate-500">Privacidade desde o primeiro passo.</p></section>
    <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10"><div className="w-full max-w-md"><div className="mb-10 lg:hidden"><Link href="/" className="flex items-center gap-3 font-bold"><span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">F</span> Folio</Link></div><div className="mb-8"><p className="eyebrow">Conta pessoal</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.04em]">{copy[mode].title}</h2><p className="mt-2 text-sm text-slate-500">{copy[mode].description}</p></div>
      <form className="space-y-4" onSubmit={handleSubmit}>{mode !== "reset" && <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700">E-mail</span><span className="relative block"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className="field pl-10" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" autoComplete="email" required={isAuthForm} /></span></label>}{mode !== "forgot" && <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700">Senha</span><span className="relative block"><LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className="field pl-10 pr-10" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" autoComplete={mode === "login" ? "current-password" : "new-password"} required={isAuthForm} minLength={mode === "register" ? 8 : undefined} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="icon-button absolute right-2 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>}{mode === "register" && <label className="flex items-start gap-2 text-xs text-slate-500"><input type="checkbox" className="mt-0.5" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required /> Aceito os termos de uso e a política de privacidade.</label>}{mode === "login" && <div className="text-right"><Link href="/forgot-password" className="text-xs font-semibold text-slate-600 hover:text-slate-950">Esqueci minha senha</Link></div>}{error && <p className="text-sm text-red-700" role="alert">{error}</p>}<button className="button-primary w-full justify-center disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? "Aguarde..." : copy[mode].action}</button></form>
      <p className="mt-8 text-center text-sm text-slate-500">{mode === "register" ? "Já possui uma conta?" : "Ainda não possui uma conta?"} <Link href={mode === "register" ? "/login" : "/register"} className="font-semibold text-slate-950 hover:underline">{mode === "register" ? "Entrar" : "Criar conta"}</Link></p>
    </div></section>
  </main>;
}
