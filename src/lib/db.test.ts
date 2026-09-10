import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import {
  closePool,
  getCounter,
  incrementCounter,
  resetCounter,
} from "./db";

before(async () => {
  await resetCounter(0);
});

after(async () => {
  await closePool();
});

test("starts at zero after reset", async () => {
  await resetCounter(0);
  assert.equal(await getCounter(), 0);
});

test("incrementing the counter persists in postgres", async () => {
  await resetCounter(4);
  assert.equal(await incrementCounter(), 5);
  assert.equal(await getCounter(), 5);
});

test("multiple increments add up", async () => {
  await resetCounter(0);
  await incrementCounter();
  await incrementCounter();
  await incrementCounter();
  assert.equal(await getCounter(), 3);
});
