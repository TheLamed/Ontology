export class PagingParamsModel {
  public pn: number;
  public ps: number;
  public sort: "asc" | "desc" | "";

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
