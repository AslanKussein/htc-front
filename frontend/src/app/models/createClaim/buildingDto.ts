/**
 * Модель здания/строения
 */
export class BuildingDto {
  constructor(
    public cityId?: number,//ID города
    public districtId?: number,//ID района
    public houseNumber?: number,//Номер дома
    public houseNumberFraction?: string,//Номер дома(дробь/буква/строение)
    public latitude?: number,//широта
    public longitude?: number,//долгота
    public postcode?: string,//id от апи почты
    public streetId?: number//ID улицы
  ) {
  }
}
