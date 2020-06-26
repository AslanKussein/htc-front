import {BaseEntity} from './baseEntity';

/**
 * Модель краткой формы events
 */
export class EventsDTO implements BaseEntity {
  public id?: number;//ID заявки
  public clientId?: number;//ID заявки
  public comment?: string;//Примечание
  public description?: string;//Логин агента, на кого назначена заявка
  public eventDate?: any;//Логин агента, на кого назначена заявка
  public eventTypeId?: number;//Логин агента, на кого назначена заявка
  public sourceApplicationId?: number;//Логин агента, на кого назначена заявка
  public targetApplicationId?: number;//Логин агента, на кого назначена заявка
}
