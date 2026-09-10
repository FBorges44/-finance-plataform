const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type DashboardSummary = {
  net_worth: number;
  total_balance: number;
  income: number;
  expenses: number;
  cash_flow: number;
  accounts_count: number;
  cards_count: number;
  transactions_count: number;
};

export type Account = {
  id: string;
  name: string;
  institution: string;
  account_type: string;
  balance: number;
  created_at: string;
};

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string) {
  return apiFetch("/api/v1/users", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getDashboardSummary(token: string) {
  return apiFetch<DashboardSummary>("/api/v1/dashboard/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAccounts(token: string) {
  return apiFetch<Account[]>("/api/v1/accounts", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createAccount(
  token: string,
  data: { name: string; institution: string; account_type: string; initial_balance: number },
) {
  return apiFetch<Account>("/api/v1/accounts", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export type ApiHealth = {
  status: string;
  service: string;
  version: string;
};