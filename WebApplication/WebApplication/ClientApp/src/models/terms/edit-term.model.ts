export class EditTermModel {
  public id: number;
  public name: string;
  public description: string;
  public source: string;
  public isFullMatch: boolean;
  public themes: number[];

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
