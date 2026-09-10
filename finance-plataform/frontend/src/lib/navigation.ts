import {
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CreditCard,
  FileChartColumn,
  Gauge,
  Landmark,
  LayoutDashboard,
  ListChecks,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";

export const primaryNavigation = [
  { label: "Visão geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contas", href: "/accounts", icon: Landmark },
  { label: "Cartões", href: "/cards", icon: CreditCard },
  { label: "Transações", href: "/transactions", icon: ReceiptText },
  { label: "Orçamento", href: "/budgets", icon: Gauge },
  { label: "Metas", href: "/goals", icon: Target },
  { label: "Investimentos", href: "/investments", icon: BriefcaseBusiness },
  { label: "Patrimônio", href: "/net-worth", icon: ChartNoAxesCombined },
  { label: "Relatórios", href: "/reports", icon: FileChartColumn },
];

export const secondaryNavigation = [
  { label: "Open Finance", href: "/open-finance", icon: ShieldCheck },
  { label: "Assistente IA", href: "/ai", icon: BrainCircuit },
  { label: "Configurações", href: "/settings", icon: Settings },
];

export const mobileNavigation = [
  { label: "Início", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transações", href: "/transactions", icon: ListChecks },
  { label: "Contas", href: "/accounts", icon: WalletCards },
  { label: "Metas", href: "/goals", icon: Target },
  { label: "Mais", href: "/settings", icon: Sparkles },
];

export const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  "/accounts": { eyebrow: "Patrimônio", title: "Contas", description: "Uma leitura clara de onde seu dinheiro está hoje." },
  "/cards": { eyebrow: "Crédito", title: "Cartões", description: "Acompanhe limites, faturas e compras parceladas." },
  "/invoices": { eyebrow: "Crédito", title: "Faturas", description: "Vencimentos e compromissos do seu crédito em um só lugar." },
  "/transactions": { eyebrow: "Movimentações", title: "Transações", description: "Toda entrada e saída, organizada para decidir melhor." },
  "/budgets": { eyebrow: "Planejamento", title: "Orçamento", description: "Dê intenção para cada real antes que ele saia." },
  "/goals": { eyebrow: "Planejamento", title: "Metas financeiras", description: "Pequenos avanços que deixam o futuro mais concreto." },
  "/investments": { eyebrow: "Patrimônio", title: "Investimentos", description: "Veja sua carteira com calma, contexto e horizonte." },
  "/net-worth": { eyebrow: "Patrimônio", title: "Patrimônio líquido", description: "A evolução do que é seu, menos o que você deve." },
  "/reports": { eyebrow: "Clareza", title: "Relatórios", description: "Transforme movimentos em padrões que ajudam a agir." },
  "/open-finance": { eyebrow: "Conexões", title: "Open Finance", description: "Suas instituições, sob seu controle e com transparência." },
  "/ai": { eyebrow: "Inteligência", title: "Assistente financeiro", description: "Uma camada de conversa para entender suas decisões." },
  "/settings": { eyebrow: "Conta", title: "Configurações", description: "Preferências, segurança e privacidade no seu ritmo." },
};
