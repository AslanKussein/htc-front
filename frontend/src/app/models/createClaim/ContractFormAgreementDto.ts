export class ContractFormAgreementDto {
  constructor(
    private applicationId?: number,
    private payTypeId?: number,
    private payedSum?: number,
    private sellApplicationId?: number
  ) {
  }
}
