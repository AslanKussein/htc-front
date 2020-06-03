/**
 *Идентификационные данные сделки
 */
export class ContractDto {
  constructor(
    private amount?: number,//Сумма по договору
    private commissionIncludedInThePrice?: number,//Комиссия входить в стоимость
    private contractNumber?: number,//Номер договора
    private contractPeriod?: any//Срок действия договора
  ) {
  }
}
