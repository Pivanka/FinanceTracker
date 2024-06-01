import { Role } from "../../../auth/resources/models/role";

export interface InvitationForm{
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
