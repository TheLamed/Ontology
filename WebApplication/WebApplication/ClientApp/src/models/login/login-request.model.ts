export class LoginRequest {
  login: string;
  password: string;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
