"use client";

import { useState } from "react";

export function Counter({ initialValue }: { initialValue: number }) {
  const [value, setValue] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);

  async function handleIncrement() {
    setIsPending(true);
    try {
      const response = await fetch("/api/counter", { method: "POST" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as { value: number };
      setValue(data.value);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section className="flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl bg-white/90 p-10 shadow-xl backdrop-blur">
      <p className="text-sm font-medium tracking-widest text-slate-500 uppercase">
        Zähler
      </p>
      <p
        className="text-7xl font-semibold tabular-nums text-slate-900"
        data-testid="counter-value"
      >
        {value}
      </p>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={isPending}
        className="rounded-full bg-slate-900 px-8 py-3 text-base font-medium text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Speichern…" : "Erhöhen"}
      </button>
    </section>
  );
}
