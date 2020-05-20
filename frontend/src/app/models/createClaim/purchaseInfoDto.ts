import {NumberPeriod} from "../common/numberPeriod";

/**
 * Общая информация об объекте покупки
 */
export class PurchaseInfoDto {
  constructor(
    private apartmentsOnTheSitePeriod?: NumberPeriod,//кв на площадке от и до
    private balconyAreaPeriod?: NumberPeriod,//Площадь балкона от и до
    private ceilingHeightPeriod?: NumberPeriod,//Высота потолков от и до
    private concierge?: boolean,//Консьерж,
    private floorPeriod?: NumberPeriod,//Этаж от и до
    private id?: number,//ID
    private kitchenAreaPeriod?: NumberPeriod,//Площадь кухни от и до
    private landAreaPeriod?: NumberPeriod,//Площадь участка от и до
    private livingAreaPeriod?: NumberPeriod,//Жилая площадь от и до
    private materialOfConstructionId?: number,//Материал постройки
    private numberOfBedroomsPeriod?: NumberPeriod,//Количество спален от и до
    private numberOfFloorsPeriod?: NumberPeriod,//Этажность дома от и до
    private numberOfRoomsPeriod?: NumberPeriod,//Количество комнат от и до
    private parkingTypeIds?: any,//ID вида паркинга
    private playground?: boolean,//Детская площадка
    private totalAreaPeriod?: NumberPeriod,//Общая площадь от и до
    private typeOfElevatorList?: any,//Тип лифта
    private wheelchair?: boolean,//Колясочная
    private yardTypeId?: any,//Двор(закрытый/открытый)
    private yearOfConstructionPeriod?: NumberPeriod,//год постройки
  ) {
  }
}
