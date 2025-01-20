import type { User } from "./types";

declare namespace App {
  interface Locals {
    user: User | null;
    jwt: String | null;
  }
}

export interface User {
  id: string;
  role: string;
}
