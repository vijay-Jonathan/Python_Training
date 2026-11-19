import { api } from "./client";

export type Health = { status: string };

export const getHealth = () => api<Health>("/v1/health");
