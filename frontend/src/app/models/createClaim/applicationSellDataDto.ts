/**
 * Общая информация о сделке продажи объекта
 */
export class ApplicationSellDataDto {
  constructor(
    private description: string,//описание
    private encumbrance?: boolean,//Обременение
    private exchange?: boolean,//Обмен
    private id?: number,//"ID"
    private mortgage?: boolean,//ипотека
    private note?: string,//Примечание
    private objectPrice?: number,//Цена объекта(млн тг)
    private possibleReasonForBiddingIdList?: number,//ID возможной причины торга
    private probabilityOfBidding?: boolean,//Вероятность торга
    private sharedOwnershipProperty?: boolean,//Общая долевая собственность
    private theSizeOfTrades?: number,//Размер торга
    private applicationFlagIdList?: any // Признак
  ) {
  }
}
