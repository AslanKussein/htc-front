import {BigDecimalPeriod} from "../common/bigDecimalPeriod";


/**
 * Модель параметров по операции Покупка
 */
export class PurchaseInfoDto {
  public objectPricePeriod: BigDecimalPeriod;//Цена объекта от и до(млн тг)
  public numberOfFloorsPeriod: BigDecimalPeriod;//Этажность дома от и до
  public floorPeriod: BigDecimalPeriod;//Этаж от и до
  public numberOfRoomsPeriod: BigDecimalPeriod;//Количество комнат от и до
  public totalAreaPeriod: BigDecimalPeriod;//Общая площадь от и до
  public livingAreaPeriod: BigDecimalPeriod;//Жилая площадь от и до
  public kitchenAreaPeriod: BigDecimalPeriod;//Площадь кухни от и до
  public balconyAreaPeriod: BigDecimalPeriod;//Площадь балкона от и до
  public ceilingHeightPeriod: BigDecimalPeriod;//Высота потолков от и до
  public numberOfBedroomsPeriod: BigDecimalPeriod;//Количество спален от и до
  public landAreaPeriod: BigDecimalPeriod;//Площадь участка от и до


  constructor(objectPricePeriod: BigDecimalPeriod, numberOfFloorsPeriod: BigDecimalPeriod, floorPeriod: BigDecimalPeriod, numberOfRoomsPeriod: BigDecimalPeriod, totalAreaPeriod: BigDecimalPeriod, livingAreaPeriod: BigDecimalPeriod, kitchenAreaPeriod: BigDecimalPeriod, balconyAreaPeriod: BigDecimalPeriod, ceilingHeightPeriod: BigDecimalPeriod, numberOfBedroomsPeriod: BigDecimalPeriod, landAreaPeriod: BigDecimalPeriod) {
    this.objectPricePeriod = objectPricePeriod;
    this.numberOfFloorsPeriod = numberOfFloorsPeriod;
    this.floorPeriod = floorPeriod;
    this.numberOfRoomsPeriod = numberOfRoomsPeriod;
    this.totalAreaPeriod = totalAreaPeriod;
    this.livingAreaPeriod = livingAreaPeriod;
    this.kitchenAreaPeriod = kitchenAreaPeriod;
    this.balconyAreaPeriod = balconyAreaPeriod;
    this.ceilingHeightPeriod = ceilingHeightPeriod;
    this.numberOfBedroomsPeriod = numberOfBedroomsPeriod;
    this.landAreaPeriod = landAreaPeriod;
  }
}
