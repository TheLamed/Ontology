import { UserModel } from "../user.model";

export class LoginResponse {
  token: string;
  user: UserModel;
}
