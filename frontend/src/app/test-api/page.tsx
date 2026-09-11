"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";

type HealthResponse = {
  status: string;
  service: string;
  version: string;
};

export default function TestApiPage() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<HealthResponse>("/api/v1/health")
      .then(setData)
      .catch(() => {
        setError("Não foi possível conectar com a API.");
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-lg rounded-xl border border-slate-800 p-8">
        <h1 className="text-2xl font-bold">Teste da API</h1>

        {data && (
          <div className="mt-6 space-y-2 text-slate-300">
            <p>Status: {data.status}</p>
            <p>Serviço: {data.service}</p>
            <p>Versão: {data.version}</p>
          </div>
        )}

        {error && <p className="mt-6 text-red-400">{error}</p>}

        {!data && !error && (
          <p className="mt-6 text-slate-400">Conectando com a API...</p>
        )}
      </div>
    </main>
  );
}
