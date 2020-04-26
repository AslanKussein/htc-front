import {BaseEntity} from "../baseEntity";

/**
 * "Модель сущности Клиент"
 */
export class RealPropertyOwnerDto implements BaseEntity {
  public id?: number;//ID клиента
  public firstName?: string;//Имя клиента
  public surname?: string;//Фамилия клиента
  public patronymic?: string;//Отчество клиента
  public phoneNumber?: string;//Номер телефона
  public email?: string;//"Адрес электронной почты"
  public gender?: 'MALE' | 'FEMALE' | 'UNKNOWN';//Пол клиента


  constructor(id: number, firstName: string, surname: string, patronymic: string, phoneNumber: string, email: string, gender: "MALE" | "FEMALE" | "UNKNOWN") {
    this.id = id;
    this.firstName = firstName;
    this.surname = surname;
    this.patronymic = patronymic;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.gender = gender;
  }
}
