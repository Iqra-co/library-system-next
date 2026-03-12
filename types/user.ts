export type UserRole = "admin" | "staff" | "student";
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
export interface UserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNo: string;
  IdNo: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}