"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu, Plus, Search, X } from "lucide-react";
import { useState } from "react";

import {
  mobileNavigation,
  pageMeta,
  primaryNavigation,
  secondaryNavigation,
} from "@/lib/navigation";

function NavItem({
  label,
  href,
  icon: Icon,
  onClick,
}: {
  label: string;
  href: string;
  icon: typeof primaryNavigation[number]["icon"];
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-lime-300 text-slate-950 shadow-[0_8px_20px_rgba(190,242,100,0.14)]"
          : "text-slate-300 hover:bg-white/8 hover:text-white"
      }`}
    >
      <Icon size={17} strokeWidth={active ? 2.4 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = pageMeta[pathname];
  const isDashboard = pathname === "/" || pathname === "/dashboard";

  return (
    <div className="min-h-screen bg-[#f4f2ed] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#10252a] px-4 py-5 text-white lg:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-3">
          <span className="grid size-9 place-items-center rounded-xl bg-lime-300 font-black text-slate-950">F</span>
          <span>
            <span className="block text-[15px] font-bold tracking-tight">Folio</span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-400">personal finance</span>
          </span>
        </Link>

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Seu espaço</p>
        <nav className="space-y-1">
          {primaryNavigation.map((item) => <NavItem key={item.href} {...item} />)}
        </nav>

        <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Explorar</p>
        <nav className="space-y-1">
          {secondaryNavigation.map((item) => <NavItem key={item.href} {...item} />)}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/6 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="grid size-8 place-items-center rounded-lg bg-orange-300 text-sm font-bold text-slate-950">✦</span>
            <span className="rounded-full bg-lime-300/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-lime-200">Demo</span>
          </div>
          <p className="text-sm font-medium">Dados de demonstração</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">As telas estão prontas para receber seus dados reais.</p>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-[min(84vw,320px)] bg-[#10252a] p-4 text-white" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <span className="grid size-9 place-items-center rounded-xl bg-lime-300 font-black text-slate-950">F</span>
                <span className="font-bold">Folio</span>
              </Link>
              <button className="icon-button text-white" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={20} /></button>
            </div>
            <nav className="space-y-1">
              {[...primaryNavigation, ...secondaryNavigation].map((item) => <NavItem key={item.href} {...item} onClick={() => setMobileOpen(false)} />)}
            </nav>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f4f2ed]/90 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button className="icon-button lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={20} /></button>
              <div className="min-w-0">
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:block">{isDashboard ? "Terça-feira, 9 de setembro de 2026" : meta?.eyebrow}</p>
                <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{isDashboard ? "Visão geral" : meta?.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="icon-button hidden sm:grid" aria-label="Buscar"><Search size={18} /></button>
              <button className="icon-button relative" aria-label="Notificações"><Bell size={18} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-orange-400" /></button>
              <div className="hidden h-7 w-px bg-slate-200 sm:block" />
              <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-white/70" aria-label="Abrir perfil">
                <span className="grid size-8 place-items-center rounded-full bg-[#f5b89b] text-xs font-bold text-slate-900">FC</span>
                <span className="hidden text-left sm:block"><span className="block text-xs font-semibold">Francisco</span><span className="block text-[10px] text-slate-500">Perfil pessoal</span></span>
                <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-7 sm:px-8 lg:px-10 lg:pb-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-[0_14px_40px_rgba(16,37,42,0.16)] backdrop-blur-lg lg:hidden">
        {mobileNavigation.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href === "/dashboard" && pathname === "/");
          return <Link key={href} href={href} className={`grid place-items-center gap-1 rounded-xl py-2 text-[10px] font-semibold ${active ? "bg-[#10252a] text-lime-200" : "text-slate-500"}`}><Icon size={17} /><span>{label}</span></Link>;
        })}
      </nav>

      <button className="fixed bottom-24 right-5 z-20 grid size-12 place-items-center rounded-2xl bg-[#10252a] text-lime-200 shadow-lg transition-transform hover:-translate-y-1 lg:bottom-8 lg:right-8" aria-label="Adicionar item"><Plus size={21} /></button>
    </div>
  );
}
