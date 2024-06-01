import { Role } from "./role";

export interface User {
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
}
