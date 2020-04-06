import {BaseEntity} from "./baseEntity";

export class Dic implements BaseEntity{
  public id?: number;
  public nameKz?: string;
  public nameEn?: string;
  public nameRu?: string;
  public code?: string;
}
