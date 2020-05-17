import { PagingParamsModel } from "../paging-params.model";

export class GetContentRequest extends PagingParamsModel {
  public name: string;
  public themes: string;

  constructor(model) {
    super(model);
  }
}
