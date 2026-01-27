import { User } from "./user.model";

export interface PrivateMessage {
  id: string;                // UUID
  from_user_id: string;      // UUID, FK para User
  to_user_id: string;        // UUID, FK para User
  body: string;
  sent_at: string;           // ISO datetime
  read_at?: string;          // ISO datetime (opcional)

  // Populado em responses expandidas (opcional)
  from_user?: User;
  to_user?: User;
}
