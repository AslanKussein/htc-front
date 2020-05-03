import {BaseEntity} from "../baseEntity";

/**
 * "Модель сущности Личный кабинет"
 */

export class ProfileDto implements BaseEntity {
  public id?:	number;
  public address?:	string;
  public agentContractAmount?:	number;
  public depositAmount?:	number;
  public email?:	string;
  public phone?:	string;
  public photoUuid?:	string;
  public rating?:	number;
  public saleAmount?:	number;
  public transport?:	string;

}
