import { api } from "./client";

export type Greeting = { message: string };

export const getGreeting = () => api<Greeting>("/v1/greeting");
