export class PagingList<T>{
  public totalCount: number;
  public pageNumber: number;
  public pageSize: number;
  public items: T[];

  constructor() {
    this.items = [];
    this.totalCount = 0;
    this.pageNumber = 0;
    this.pageSize = 0;
  }
}
