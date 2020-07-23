/**
 *Идентификационные данные сделки
 */
export class ContractDto {
  constructor(
    public amount?: number,//Сумма по договору
    public commissionIncludedInThePrice?: number,//Комиссия входить в стоимость
    public contractNumber?: number,//Номер договора
    public contractPeriod?: any//Срок действия договора
  ) {
  }
}
