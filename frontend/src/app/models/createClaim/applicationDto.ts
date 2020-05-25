import {BaseEntity} from "../baseEntity";
import {ContractDto} from "./contractDto";
import {ApplicationPurchaseDataDto} from "./applicationPurchaseDataDto";
import {PurchaseInfoDto} from "./purchaseInfoDto";
import {RealPropertyDto} from "./realPropertyDto";
import {ApplicationSellDataDto} from "./applicationSellDataDto";

/**
 * "Модель заявки"
 */
export class ApplicationDto implements BaseEntity {
  constructor(
    public id?: number,//ID заявки
    public operationTypeId?: number,//тип операции
    public clientLogin?: string,//Модель сущности Клиент
    public agent?: string,//Логин агента, на кого назначена заявка
    public contractDto?: ContractDto,//Идентификационные данные сделки
    public purchaseDataDto?: ApplicationPurchaseDataDto,//Общая информация о сделке покупки объекта
    public objectTypeId?: number,//ID типа объекта
    public purchaseInfoDto?: PurchaseInfoDto,//Общая информация об объекте покупки
    public realPropertyDto?: RealPropertyDto,//Модель сущности недвижимости
    public sellDataDto?: ApplicationSellDataDto,//Модель сущности недвижимости
  ) {
  }
}
