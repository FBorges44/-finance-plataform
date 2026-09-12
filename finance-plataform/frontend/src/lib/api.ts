const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique a configuração do deploy.");
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("folio_session_ready");
    }
    let message = `API error: ${response.status}`;
    try {
      const payload = (await response.json()) as { detail?: string | Array<{ msg?: string }> };
      if (typeof payload.detail === "string") message = payload.detail;
      if (Array.isArray(payload.detail)) message = payload.detail.map((item) => item.msg).filter(Boolean).join(" ");
    } catch {
      // Keep the status message when the API does not return JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export type AuthResponse = {
  authenticated: boolean;
};

export type CurrentUser = {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
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

export type Transaction = {
  id: string;
  account_id: string;
  description: string;
  category: string;
  transaction_type: "income" | "expense";
  amount: number;
  transaction_date: string;
  created_at: string;
};

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function requestPasswordReset(email: string) {
  return apiFetch<{ detail: string }>("/api/v1/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, password: string) {
  return apiFetch<void>("/api/v1/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export function logout() {
  return apiFetch<void>("/api/v1/auth/logout", { method: "POST" });
}

export function createDemoSession() {
  return apiFetch<AuthResponse>("/api/v1/auth/demo", {
    method: "POST",
  });
}

export function getCurrentUser(token: string) {
  return apiFetch<CurrentUser>("/api/v1/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
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

export function updateAccount(token: string, id: string, data: { name: string; institution: string; account_type: string }) {
  return apiFetch<Account>(`/api/v1/accounts/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
}

export function deleteAccount(token: string, id: string) {
  return apiFetch<void>(`/api/v1/accounts/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}

export function getTransactions(token: string) {
  return apiFetch<Transaction[]>("/api/v1/transactions", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createTransaction(
  token: string,
  data: {
    account_id: string;
    description: string;
    category: string;
    transaction_type: "income" | "expense";
    amount: number;
    transaction_date: string;
  },
) {
  return apiFetch<Transaction>("/api/v1/transactions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export type Goal = { id: string; name: string; target_amount: number; current_amount: number; deadline: string | null; created_at: string };
export type Budget = { id: string; category: string; limit_amount: number; month: string; spent_amount: number; created_at: string };
export type Investment = { id: string; name: string; asset_type: string; amount: number; institution: string; created_at: string };
export type Report = { income: number; expenses: number; cash_flow: number; account_balance: number; investments: number; net_worth: number; by_category: Record<string, number> };
export type Category = { id: string; name: string; category_type: "income" | "expense"; created_at: string };

export function getGoals(token: string) { return apiFetch<Goal[]>("/api/v1/goals", { headers: { Authorization: `Bearer ${token}` } }); }
export function createGoal(token: string, data: { name: string; target_amount: number; current_amount: number; deadline: string | null }) { return apiFetch<Goal>("/api/v1/goals", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }); }
export function getBudgets(token: string) { return apiFetch<Budget[]>("/api/v1/budgets", { headers: { Authorization: `Bearer ${token}` } }); }
export function createBudget(token: string, data: { category: string; limit_amount: number; month: string }) { return apiFetch<Budget>("/api/v1/budgets", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }); }
export function getInvestments(token: string) { return apiFetch<Investment[]>("/api/v1/investments", { headers: { Authorization: `Bearer ${token}` } }); }
export function createInvestment(token: string, data: { name: string; asset_type: string; amount: number; institution: string }) { return apiFetch<Investment>("/api/v1/investments", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }); }
export function getReport(token: string) { return apiFetch<Report>("/api/v1/reports/summary", { headers: { Authorization: `Bearer ${token}` } }); }
export function getCategories(token: string) { return apiFetch<Category[]>("/api/v1/transactions/categories", { headers: { Authorization: `Bearer ${token}` } }); }
export function createCategory(token: string, data: { name: string; category_type: "income" | "expense" }) { return apiFetch<Category>("/api/v1/transactions/categories", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }); }
export function updateTransaction(token: string, id: string, data: { account_id: string; description: string; category: string; transaction_type: "income" | "expense"; amount: number; transaction_date: string }) { return apiFetch<Transaction>(`/api/v1/transactions/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }); }
export function deleteTransaction(token: string, id: string) { return apiFetch<void>(`/api/v1/transactions/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); }

export type ApiHealth = {
  status: string;
  service: string;
  version: string;
};
