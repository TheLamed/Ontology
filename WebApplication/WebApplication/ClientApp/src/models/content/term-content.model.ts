import { IdValueModel } from "../id-value.model";

export class TermContentModel {
  public id: number;
  public name: string;
  public description: string;
  public themes: IdValueModel[];
}
