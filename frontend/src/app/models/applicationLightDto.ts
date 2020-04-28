import {BaseEntity} from './baseEntity';
import {ClientDto} from './createClaim/clientDto';

/**
 * Модель краткой формы заявки
 */
export class ApplicationLightDto implements BaseEntity {
  public id?: number;//ID заявки
  public clientDto?: ClientDto;//Модель сущности Клиент
  public operationTypeId?: number = null;//тип операции
  public note?: string;//Примечание
  public agentLogin?: string;//Логин агента, на кого назначена заявка
}
