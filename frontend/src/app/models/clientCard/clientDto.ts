import {BaseEntity} from "../baseEntity";

export class ClientDto implements BaseEntity {
  public id?:	number;
  public email?:	string;
  public phoneNumber?:	string;
  public gender?: []
  public firstName?: string;
  public surname?: string;
  public patronymic?: string;


}
