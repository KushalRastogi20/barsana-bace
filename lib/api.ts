import axios from "axios";
import { Leela } from "./data";

const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL ?? "",
  timeout: 4000,
});

export async function fetchLeelas(): Promise<Leela[]> {
  try {
    const { data } = await api.get<Leela[]>("/api/leelas");
    return data;
  } catch {
    return [];
  }
}
