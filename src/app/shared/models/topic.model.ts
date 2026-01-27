import { User } from "./user.model";

export interface Topic {
  id: string;               // UUID
  user_id: string;          // UUID, FK para User
  title: string;
  body: string;
  created_at: string;       // ISO datetime

  // Populado em responses expandidas (opcional)
  user?: User;
}
