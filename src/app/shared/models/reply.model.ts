import { User } from "./user.model";

export interface Reply {
  id: string;               // UUID
  topic_id: string;         // UUID, FK para Topic
  user_id: string;          // UUID, FK para User
  body: string;
  created_at: string;       // ISO datetime

  // Populado em responses expandidas (opcional)
  user?: User;
}
