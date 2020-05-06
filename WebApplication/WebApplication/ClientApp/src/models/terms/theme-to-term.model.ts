export class ThemeToTermModel {
  public themeId: number;
  public termId: number;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}
