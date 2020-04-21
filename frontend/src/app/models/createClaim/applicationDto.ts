import {BaseEntity} from "../baseEntity";
import {RealPropertyOwnerDto} from "./realPropertyOwnerDto";
import {RealPropertyRequestDto} from "./realPropertyRequestDto";

/**
 * "Модель заявки"
 */
export class ApplicationDto implements BaseEntity {
  public id?: number;//ID заявки
  public operationTypeId?: number = null;//тип операции
  public mortgage?: boolean;//ипотека
  public encumbrance?: boolean;//Обременение
  public sharedOwnershipProperty?: boolean;//Общая долевая собственность
  public exchange?: boolean;//Обмен
  public probabilityOfBidding?: boolean;//Вероятность торга
  public theSizeOfTrades?: string;//Размер торга
  public possibleReasonForBiddingIdList?: number;//ID возможной причины торга
  public contractPeriod?: any;//Срок действия договора
  public amount?: number;//Сумма по договору
  public isCommissionIncludedInThePrice?: boolean;//Комиссия включена в стоимость
  public note?: string;//Примечание
  public realPropertyOwnerDto?: RealPropertyOwnerDto;//Модель сущности Клиент
  public realPropertyRequestDto?: RealPropertyRequestDto;//Модель сущности недвижимости

  public constructor(init?: Partial<ApplicationDto>) {
    Object.assign(this, init);
  }
}
