import { Hono } from "hono";

/**
 * Liveness only: answers whenever the process can serve HTTP. The post-deploy
 * smoke test and the compose healthchecks call it. It does not touch the
 * database, so a slow Postgres cannot take the service out of rotation.
 */
export const health = new Hono().get("/", (c) => c.json({ status: "ok" }));
