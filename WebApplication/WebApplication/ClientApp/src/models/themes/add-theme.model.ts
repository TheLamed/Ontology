export class AddThemeModel {
  public id: number;
  public name: string;
  public parents: number[];

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
