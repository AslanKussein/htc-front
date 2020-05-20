import {NumberPeriod} from "../common/numberPeriod";

/**
 * Общая информация о сделке покупки объекта
 */
export class ApplicationPurchaseDataDto {
  constructor(
    public id?: number,//ID
    public cityId?: number,//ID города
    public districtId?: number,//ID района
    public mortgage?: boolean,//ипотека
    public note?: string,//Примечание
    public probabilityOfBidding?: boolean,//Вероятность торга
    public theSizeOfTrades?: number,//Размер торга
    public objectPricePeriod?: NumberPeriod,//Цена объекта от и до(млн тг)
    public possibleReasonForBiddingIdList?: number,//ID возможной причины торга
  ) {
  }
}
