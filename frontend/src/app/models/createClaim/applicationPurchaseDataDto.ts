import {Period} from "../common/period";

/**
 * Общая информация о сделке покупки объекта
 */
export class ApplicationPurchaseDataDto {
  constructor(
    public id?: number,//ID
    public cityId?: number,//ID города
    public districts?: number,//ID района
    public mortgage?: boolean,//ипотека
    public note?: string,//Примечание
    public probabilityOfBidding?: boolean,//Вероятность торга
    public theSizeOfTrades?: number,//Размер торга
    public objectPricePeriod?: Period,//Цена объекта от и до(млн тг)
    public possibleReasonForBiddingIdList?: number,//ID возможной причины торга
    public applicationFlagIdList?: number,//ID признак
  ) {
  }
}
