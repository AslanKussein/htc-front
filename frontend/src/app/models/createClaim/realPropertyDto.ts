/**
 * "Модель сущности недвижимости"
 */
import {BuildingDto} from "./buildingDto";
import {GeneralCharacteristicsDto} from "./generalCharacteristicsDto";

export class RealPropertyDto {
  constructor(
    public apartmentNumber?: string,//Номер квартиры(/буква)
    public atelier?: boolean,//Студия
    public balconyArea?: number,//Площадь балкона
    public buildingDto?: BuildingDto,//Модель здания/строения
    public floor?: number,//Этаж
    public generalCharacteristicsDto?: GeneralCharacteristicsDto,//Характеристики недвижимости
    public heatingSystemId?: number,//""Канализация"
    public id?: number,//""id"
    public kitchenArea?: number,//Площадь кухни
    public landArea?: number,//""Площадь участка"
    public livingArea?: number,//Жилая площадь
    public metadataId?: number,//метадата
    public metadataStatusId?: number,//статус метадаты
    public edited?: boolean,
    public filesEdited?: boolean,
    public numberOfBedrooms?: number,//Количество спален
    public numberOfRooms?: number,//"Количество комнат
    public separateBathroom?: boolean,//Санузел раздельный
    public sewerageId?: number,//""Отопительная система"
    public totalArea?: number,//Общая площадь
    private housingPlanImageIdList?: any,//"ID фотографии"
    public photoIdList?: string [],  // массив изображений
    public virtualTourImageIdList?: any//"ID фотографии"

  ) {
  }
}
