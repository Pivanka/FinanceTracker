import { Role } from "../../../auth/resources/models/role";

export interface Member{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  invited: boolean;
  icon?: string;
  role: Role;
}
