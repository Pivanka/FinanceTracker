import { Role } from "../../../auth/resources/models/role"

export interface SettingsModel{
  avatar: string | null,
  firstName: string,
  lastName: string,
  email: string,
}
export interface ProfileSettingsModel{
  id: number,
  avatar: string | null,
  firstName: string,
  lastName: string,
  email: string,
  role: Role
}

export interface PasswordResult{
  isSuccess: boolean,
  errors: string[]
}
