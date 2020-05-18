import { IdValueModel } from "../id-value.model";
import { TermSimpleModel } from "./term-simple.model";

export class TermViewModel {
  public id: number;
  public name: string;
  public description: string;
  public source: string;
  public themes: IdValueModel[];
  public relatedTerms: TermSimpleModel[];

  //additional properties
  public is404: boolean = false;
  public isLoading: boolean = false;

}

export const TERM_VIEW_404 = { is404: true } as TermViewModel;
export const TERM_VIEW_LOADING = { isLoading: true } as TermViewModel;
