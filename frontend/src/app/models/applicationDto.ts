import {BaseEntity} from "./baseEntity";

export class ApplicationDto implements BaseEntity {
  public id?: number;
  public clientId?: number;
  public firstName?: string;
  public surname?: string;
  public patronymic?: string;
  public phoneNumber?: string;
  public email?: string;
  public gender?: 'MALE' | 'FEMALE' | 'UNKNOWN';
  public operationTypeId?: number;
  public objectTypeId?: number;
  public objectPrice?: number;
  public objectPriceFrom?: number;//Цена объекта от(млн тг)
  public objectPriceTo?: number;//Цена объекта до(млн тг)
  public mortgage?: boolean;//ипотека
  public encumbrance?: boolean;//Обременение
  public sharedOwnershipProperty?: boolean;//Общая долевая собственность
  public exchange?: boolean;//Обмен
  public probabilityOfBidding?: boolean;//Вероятность торга
  public theSizeOfTrades?: string;//Размер торга
  public possibleReasonForBiddingIdList?: number;//ID возможной причины торга
  public contractPeriod?: any;//Срок действия договора
  public amount?: number;//Сумма по договору
  public isCommissionIncludedInThePrice?: boolean;//Комиссия включена в стоимость
  public note?: string;//Примечание
  public cityId?: number;//ID города
  public cadastralNumber?: string;//Кадастровый номер
  public residentialComplexId?: number;//ID жилого комплекса
  public street?: string;//Улица
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
  public district?: string;//Район
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
  public floorFrom?: number;//Этаж от
  public floorTo?: number;//Этаж до
  public numberOfRoomsFrom?: number;//Количество комнат от
  public numberOfRoomsTo?: number;//Количество комнат до
  public totalAreaFrom?: number;//Общая площадь от
  public totalAreaTo?: number;//Общая площадь до
  public livingAreaFrom?: number;//Жилая площадь от
  public livingAreaTo?: number;//Жилая площадь до
  public kitchenAreaFrom?: number;//Площадь кухни от
  public kitchenAreaTo?: number;//Площадь кухни до
  public balconyAreaFrom?: number;//Площадь балкона от
  public balconyAreaTo?: number;//Площадь балкона до
  public ceilingHeightFrom?: number;//Высота потолков от
  public ceilingHeightTo?: number;//Высота потолков до
  public numberOfBedroomsFrom?: number;//Количество спален от
  public numberOfBedroomsTo?: number;//Количество спален до
  public photoIdList?: any;//"ID фотографии"
  public housingPlanImageIdList?: any;//"ID фотографии"
  public virtualTourImageIdList?: any;//"ID фотографии"
  public propertyDeveloperId?: number;//"Застройщик "
  public housingClass?: string;//"Класс жилья"
  public housingCondition?: string;//"Состояние жилья"
  public numberOfApartments?: number;//""Общее количество квартир"
  public sewerageId?: number;//""Отопительная система"
  public heatingSystemId?: number;//""Канализация"
}
