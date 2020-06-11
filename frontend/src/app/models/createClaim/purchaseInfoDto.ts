import {Period} from "../common/period";

/**
 * Общая информация об объекте покупки
 */
export class PurchaseInfoDto {
  constructor(
    private apartmentsOnTheSitePeriod?: Period,//кв на площадке от и до
    private balconyAreaPeriod?: Period,//Площадь балкона от и до
    private ceilingHeightPeriod?: Period,//Высота потолков от и до
    private concierge?: boolean,//Консьерж,
    private floorPeriod?: Period,//Этаж от и до
    private id?: number,//ID
    private kitchenAreaPeriod?: Period,//Площадь кухни от и до
    private landAreaPeriod?: Period,//Площадь участка от и до
    private livingAreaPeriod?: Period,//Жилая площадь от и до
    private materialOfConstructionId?: number,//Материал постройки
    private numberOfBedroomsPeriod?: Period,//Количество спален от и до
    private numberOfFloorsPeriod?: Period,//Этажность дома от и до
    private numberOfRoomsPeriod?: Period,//Количество комнат от и до
    private parkingTypeIds?: any,//ID вида паркинга
    private playground?: boolean,//Детская площадка
    private totalAreaPeriod?: Period,//Общая площадь от и до
    private typeOfElevatorList?: any,//Тип лифта
    private wheelchair?: boolean,//Колясочная
    private yardTypeId?: any,//Двор(закрытый/открытый)
    private yearOfConstructionPeriod?: Period,//год постройки
    private atelier?: boolean, // Студия
    private separateBathroom?: boolean // Санузел раздельный
  ) {
  }
}
