import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {Util} from "../../../../services/util";
import {ContractFormDto} from "../../../../models/createClaim/ContractFormDto";
import {NotificationService} from "../../../../services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {ContractService} from "../../../../services/contract.service";
import {ClaimService} from "../../../../services/claim.service";
import {ActivatedRoute} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {NewDicService} from "../../../../services/new.dic.service";

@Component({
  selector: 'app-contract-ou',
  templateUrl: './contract-ou.component.html',
  styleUrls: ['./contract-ou.component.scss']
})
export class ContractOuComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  contractFormDto: ContractFormDto
  contractForm: any;
  applicationId: number;
  objectTypeId: any;
  sourcePdf: any;
  isShowPdf = false;
  isDisabled = false;
  contractTypes: any[];
  constructor(
    private util: Util,
    private formBuilder: FormBuilder,
    private notifyService: NotificationService,
    private translate: TranslateService,
    private contractService: ContractService,
    private actRoute: ActivatedRoute,
    private claimService: ClaimService,
    private ngxLoader: NgxUiLoaderService,
    private newDicService: NewDicService,
  ) {
    this.applicationId = Number(this.actRoute.snapshot.params.id);
    this._createForm();
  }

  ngOnInit(): void {
    this.getContractForm();
    this.getContractType();
  }
  private _createForm(): void {
    this.contractForm = this.formBuilder.group({
      contractNumber: [null, Validators.required],
      contractPeriod: [null, Validators.required],
      contractSum: [null, Validators.required],
      commission: [null, Validators.required],
      contractTypeId: [null, Validators.required],
    });
  }

  getContractForm(): void {
    if(this.applicationId) {
      this.subscriptions.add(this.claimService.getClaimById(this.applicationId)
        .subscribe(res => {
            if (res && res.contractDto && res.contractDto?.applicationId) {
              this.fillContractForm(res.contractDto);
              this.isDisabled = true;
            }
            this.objectTypeId = res?.objectTypeId;
          }
        ));
    }
  }

  getContractType(): void {
    this.subscriptions.add(this.newDicService.getDictionary('ContractType').subscribe(res => {
      this.contractTypes = this.util.toSelectArray(res);
    }));
  }

  fillContractForm(data: any): void {
    this.contractForm.contractNumber = data?.contractNumber;
    this.contractForm.contractSum = data?.contractSum;
    this.contractForm.contractTypeId = data?.contractTypeId;
    this.contractForm.contractPeriod = new Date(data?.contractPeriod);
    this.contractForm.commission = data?.commission;
  }

  fillContractDto(): void {
    this.contractFormDto = new ContractFormDto(
      this.applicationId,
      this.contractForm.value.contractNumber,
      this.contractForm.value.contractPeriod,
      this.contractForm.value.contractSum,
      this.contractForm.value.commission,
      this.contractForm.value.contractTypeId,
    );
  }

  getCommission(): void {
    const params = {
      objectTypeId: this.objectTypeId,
      sum: this.contractForm.value.contractSum
    };
    this.subscriptions.add(this.contractService.getCommission(params)
      .subscribe(res => {
        this.contractForm.commission = res;
      }));
  }

  generateContract(): void {
    let isValid = true;
    const controls = this.contractForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        this.translate.get('claims.validator.' + name).subscribe((field: string) => {
          this.notifyService.showWarning('Внимание',`Поле ${field} не заполнено!`);
        });
        isValid = false;
      }
    }
    if (!isValid) return;
    this.ngxLoader.startBackground();
    this.fillContractDto();
    this.subscriptions.add(this.contractService.generateContract(this.contractFormDto)
      .subscribe(res => {
        if(res) {
          this.isDisabled = true;
          this.isShowPdf = true;
          const byteArray = new Uint8Array(atob(res).split('').map(char => char.charCodeAt(0)));
          const blob = new Blob([byteArray], {type: 'application/pdf'});
          this.sourcePdf =  window.URL.createObjectURL(blob);
          const link = window.document.createElement('a');
          link.href = this.sourcePdf;
          link.setAttribute('download', 'contract.pdf');
          window.document.body.appendChild(link);
          link.click();
          this.ngxLoader.stopBackground();
        }
      }, err => {
        this.notifyService.showError('', err?.ru);
        this.ngxLoader.stopBackground();
      }));
  }

  changeContractSum() {
    this.getCommission();
  }

  skipStep(): void {
    this.fillContractDto();
    this.subscriptions.add(this.contractService.missContract(this.contractFormDto)
      .subscribe(res => {
        this.util.dnHref(localStorage.getItem('url'));
      })
    );
  }

  cancel() {
    if(this.canDeactivate()) {
      this.util.dnHref(localStorage.getItem('url'));
    }
  }

  canDeactivate(): boolean | Observable<boolean> {
    let result = confirm('Вы хотите покинуть страницу?');
    return result;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
