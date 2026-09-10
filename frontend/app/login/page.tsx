"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { login } from "@/lib/api";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			const response = await login(email, password);
			localStorage.setItem("folio_access_token", response.access_token);
			router.push("/dashboard");
		} catch {
			setError("Não foi possível entrar. Verifique seu e-mail e senha.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="min-h-screen bg-slate-950 text-white">
			<div className="grid min-h-screen lg:grid-cols-2">
				<section className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 lg:flex">
					<div className="relative z-10 flex w-full flex-col justify-between">
						<Link href="/" className="w-fit">
							<div className="text-2xl font-semibold tracking-tight">Folio</div>
							<div className="mt-0.5 text-sm text-slate-500">finanças pessoais</div>
						</Link>

						<div className="max-w-lg">
							<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Controle financeiro</p>
							<h1 className="mt-5 text-5xl font-semibold leading-tight tracking-tight">
								Entenda seu dinheiro.
								<br />
								<span className="text-slate-400">Tome melhores decisões.</span>
							</h1>
							<p className="mt-6 max-w-md text-base leading-7 text-slate-400">
								Organize suas contas, cartões, investimentos e objetivos financeiros em um único lugar.
							</p>
						</div>

						<div className="text-sm text-slate-600">© {new Date().getFullYear()} Folio</div>
					</div>
					<div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-slate-800/40 blur-3xl" />
					<div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-slate-800/30 blur-3xl" />
				</section>

				<section className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-slate-950">
					<div className="w-full max-w-md">
						<Link href="/" className="mb-12 block w-fit lg:hidden">
							<div className="text-2xl font-semibold tracking-tight">Folio</div>
							<div className="text-sm text-slate-500">finanças pessoais</div>
						</Link>

						<div>
							<h2 className="text-3xl font-semibold tracking-tight">Bem-vindo de volta</h2>
							<p className="mt-2 text-sm text-slate-500">Entre na sua conta para continuar.</p>
						</div>

						<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
							<div>
								<label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
								<input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" autoComplete="email" required className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" />
							</div>

							<div>
								<div className="mb-2 flex items-center justify-between gap-4">
									<label htmlFor="password" className="block text-sm font-medium text-slate-700">Senha</label>
									<Link href="/forgot-password" className="text-sm font-medium text-slate-700 transition hover:text-slate-950">Esqueci minha senha</Link>
								</div>
								<div className="relative">
									<input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" autoComplete="current-password" required className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10" />
									<button type="button" onClick={() => setShowPassword((visible) => !visible)} className="icon-button absolute right-2 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							{error && <p className="text-sm text-slate-700" role="alert">{error}</p>}
							<button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60 active:scale-[0.99]">{isSubmitting ? "Entrando..." : "Entrar"}</button>
						</form>

						<p className="mt-8 text-center text-sm text-slate-500">
							Ainda não possui uma conta? <Link href="/register" className="font-semibold text-slate-950 hover:underline">Criar conta</Link>
						</p>
						<p className="mt-10 text-center text-xs leading-5 text-slate-400">Ao entrar, você concorda com os termos de uso e a política de privacidade do Folio.</p>
					</div>
				</section>
			</div>
		</main>
	);
}
