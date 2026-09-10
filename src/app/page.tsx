import { Counter } from "@/components/Counter";
import { getCounter } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const value = await getCounter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 p-6">
      <Counter initialValue={value} />
    </main>
  );
}
