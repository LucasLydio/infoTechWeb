export interface User {
  id: string;               // UUID
  name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  created_at: string;       // ISO datetime
}
