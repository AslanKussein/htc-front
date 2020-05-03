import {BaseEntity} from "../baseEntity";
import {ClientDto} from "./clientDto";
import {RealPropertyRequestDto} from "./realPropertyRequestDto";

/**
 * "Модель заявки"
 */
export class ApplicationDto implements BaseEntity {
  public id?: number;//ID заявки
  public operationTypeId?: number = null;//тип операции
  public objectPrice?: number = null;//Цена объекта(млн тг)
  public mortgage?: boolean;//ипотека
  public encumbrance?: boolean;//Обременение
  public sharedOwnershipProperty?: boolean;//Общая долевая собственность
  public exchange?: boolean;//Обмен
  public probabilityOfBidding?: boolean;//Вероятность торга
  public theSizeOfTrades?: number;//Размер торга
  public possibleReasonForBiddingIdList?: number;//ID возможной причины торга
  public contractPeriod?: any;//Срок действия договора
  public amount?: number;//Сумма по договору
  public isCommissionIncludedInThePrice?: boolean;//Комиссия включена в стоимость
  public note?: string;//Примечание
  public clientDto?: ClientDto;//Модель сущности Клиент
  public realPropertyRequestDto?: RealPropertyRequestDto;//Модель сущности недвижимости


  constructor(operationTypeId: number, objectPrice: number, mortgage: boolean, encumbrance: boolean, sharedOwnershipProperty: boolean, exchange: boolean, probabilityOfBidding: boolean, theSizeOfTrades: number, possibleReasonForBiddingIdList: number, contractPeriod: any, amount: number, isCommissionIncludedInThePrice: boolean, note: string) {
    this.operationTypeId = operationTypeId;
    this.objectPrice = objectPrice;
    this.mortgage = mortgage;
    this.encumbrance = encumbrance;
    this.sharedOwnershipProperty = sharedOwnershipProperty;
    this.exchange = exchange;
    this.probabilityOfBidding = probabilityOfBidding;
    this.theSizeOfTrades = theSizeOfTrades;
    this.possibleReasonForBiddingIdList = possibleReasonForBiddingIdList;
    this.contractPeriod = contractPeriod;
    this.amount = amount;
    this.isCommissionIncludedInThePrice = isCommissionIncludedInThePrice;
    this.note = note;
  }
}
