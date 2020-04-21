/**
 * "Модель сущности недвижимости"
 */
import {PurchaseInfoDto} from "./purchaseInfoDto";

export class RealPropertyRequestDto {
  public objectTypeId?: number;//ID типа объекта
  public cityId?: number;//ID города
  public cadastralNumber?: string;//Кадастровый номер
  public residentialComplexId?: number;//ID жилого комплекса
  public streetId?: number;//ID улицы
  public houseNumber?: number;//Номер дома
  public houseNumberFraction?: string;//Номер дома(дробь/буква/строение)
  public floor?: number;//Этаж
  public apartmentNumber?: string;//Номер квартиры(/буква)
  public numberOfRooms?: number;//"Количество комнат
  public totalArea?: number;//Общая площадь
  public livingArea?: number;//Жилая площадь
  public kitchenArea?: number;//Площадь кухни
  public balconyArea?: number;//Площадь балкона
  public ceilingHeight?: number;//Высота потолков
  public numberOfBedrooms?: number;//Количество спален
  public atelier?: boolean;//Студия
  public separateBathroom?: boolean;//Санузел раздельный
  public districtId?: number;//ID района
  public numberOfFloors?: number;//Этажность дома
  public apartmentsOnTheSite?: string;//Квартир на площадке
  public materialOfConstructionId?: string;//Материал постройки
  public yearOfConstruction?: number;//Год постройки
  public typeOfElevatorList?: [];//Тип лифта
  public concierge?: boolean;//Консьерж
  public wheelchair?: boolean;//Колясочная
  public yardTypeId?: any;//Двор(закрытый/открытый)
  public playground?: boolean;//Детская площадка
  public parkingTypeId?: any;//ID вида паркинга
  public propertyDeveloperId?: number;//"Застройщик "
  public housingClass?: string;//"Класс жилья"
  public housingCondition?: string;//"Состояние жилья"
  public photoIdList?: any;//"ID фотографии"
  public housingPlanImageIdList?: any;//"ID фотографии"
  public virtualTourImageIdList?: any;//"ID фотографии"
  public sewerageId?: number;//""Отопительная система"
  public heatingSystemId?: number;//""Канализация"
  public numberOfApartments?: number;//""Общее количество квартир"
  public landArea?: number;//""Площадь участка"
  public purchaseInfoDto?: PurchaseInfoDto;//"Параметры при Покупке
}
