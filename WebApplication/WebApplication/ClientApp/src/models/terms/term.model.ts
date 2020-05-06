import { IdValueModel } from "../id-value.model";

export class TermModel {
  public id: number;
  public name: string;
  public description: string;
  public source: string;
  public isFullMatch: boolean;
  public status: number;
  public themes: IdValueModel[];
}
