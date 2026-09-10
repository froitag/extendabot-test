"use server";

import { incrementCounter } from "@/lib/db";

export async function incrementCounterAction() {
  return incrementCounter();
}
