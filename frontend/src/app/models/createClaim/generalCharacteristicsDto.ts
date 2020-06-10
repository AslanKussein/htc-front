/**
 * Характеристики недвижимости
 */
export class GeneralCharacteristicsDto {
  constructor(
    private apartmentsOnTheSite?: string,//Квартир на площадке
    private ceilingHeight?: number,//Высота потолков
    private concierge?: boolean,//Консьерж,
    private houseConditionId?: string,//"Состояние жилья"
    private housingClass?: string,//"Класс жилья"
    private id?: number,//ID
    private materialOfConstructionId?: string,//Материал постройки
    private numberOfApartments?: number,//""Общее количество квартир"
    private numberOfFloors?: number,//Этажность дома
    private parkingTypeIds?: any,//ID вида паркинга
    private playground?: boolean,//Детская площадка
    private propertyDeveloperId?: number,//"Застройщик "
    private typeOfElevatorList?: any,//Тип лифта
    private yearOfConstruction?: any // Год постройки
  ) {
  }
}
