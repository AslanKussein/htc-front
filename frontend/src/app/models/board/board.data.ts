import {BaseEntity} from "../baseEntity";
import {Dic} from "../dic";

export class BoardData implements BaseEntity {
  public id?: number;
  public operationType?: Dic;
  public numberOfRooms?: number;
  public totalArea?: number;
  public district?: Dic;
  public price?: number;
  public fullname?: string;
}
