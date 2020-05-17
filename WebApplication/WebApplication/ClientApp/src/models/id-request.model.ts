export class IdRequest {
  public id: number;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
