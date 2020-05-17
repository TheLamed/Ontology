import { IdValueModel } from "../id-value.model";
import { TermSimpleModel } from "./term-simple.model";

export class TermViewModel {
  public id: number;
  public name: string;
  public description: string;
  public source: string;
  public themes: IdValueModel[];
  public relatedTerms: TermSimpleModel[];
}
