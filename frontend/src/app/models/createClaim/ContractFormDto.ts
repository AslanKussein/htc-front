export class ContractFormDto {
  constructor(
    private applicationId?: number, // ID заявки
    private contractNumber?: string, // Номер договора
    private contractPeriod?: string, // Срок действия договора
    private contractSum?: number, // Сумма по договору
    private commission?: number, // Комиссия
    private contractTypeId?: number, // Тип договора
    private guid?: string
  ) {
  }
}
