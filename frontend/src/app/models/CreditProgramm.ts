import {BaseEntity} from "./baseEntity";

export class CreditProgramm implements BaseEntity {
  public id?: number;
  public nameKz?: string;
  public nameEn?: string;
  public nameRu?: string;
  public minDownPayment?: number;
  public maxDownPayment?: number;
  public minCreditPeriod?: number;
  public maxCreditPeriod?: number;
  public percent?: number;
}
