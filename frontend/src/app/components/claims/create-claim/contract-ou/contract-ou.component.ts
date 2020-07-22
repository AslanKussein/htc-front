import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {Util} from "../../../../services/util";
import {ContractFormDto} from "../../../../models/createClaim/ContractFormDto";
import {NotificationService} from "../../../../services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {ContractService} from "../../../../services/contract.service";
import {ClaimService} from "../../../../services/claim.service";
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {NewDicService} from "../../../../services/new.dic.service";
import {filter, pairwise} from "rxjs/operators";
import {UploaderService} from "../../../../services/uploader.service";
import {Dic} from "../../../../models/dic";

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
  contractTypes: Dic[];
  fromBoard: boolean = false;
  operationType: Dic[];
  isBuy: boolean;
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
    private router: Router,
    private uploaderService: UploaderService
  ) {
    this.applicationId = Number(this.actRoute.snapshot.params.id);
    this._createForm();
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('fromBoard'))) {
      this.fromBoard = this.actRoute.snapshot.queryParamMap.get('fromBoard') == 'true';
    }
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        localStorage.setItem('previousUrl', events[0].urlAfterRedirects)
      })
  }

  ngOnInit(): void {
    this.loadDictionary();
    this.getContractForm();
  }
  private _createForm(): void {
    this.contractForm = this.formBuilder.group({
      contractNumber: [null, Validators.required],
      contractPeriod: [null, Validators.required],
      contractSum: [null, Validators.required],
      commission: [null, Validators.required],
      contractTypeId: [null, Validators.nullValidator],
    });
  }

  getContractForm(): void {
    if(this.applicationId) {
      this.subscriptions.add(this.claimService.getClaimById(this.applicationId)
        .subscribe(res => {
          const operationType = this.util.getDictionaryValueById(this?.operationType, res?.operationTypeId);
          this.isBuy = operationType?.code === '001002';
          if (res && res.contractDto && res.contractDto?.applicationId) {
            this.fillContractForm(res.contractDto);
            this.isDisabled = true;
          }
          this.objectTypeId = res?.objectTypeId;
          }
        ));
    }
  }

  loadDictionary(): void {
    this.subscriptions.add(this.newDicService.getDictionary('OperationType').subscribe(res => {
      this.operationType = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('ContractType').subscribe(res => {
      this.contractTypes = this.util.toSelectArray(res);
      this.contractTypes = this.contractTypes.filter(el => el.code !== '001004');
    }));
  }

  fillContractForm(data: any): void {
    this.contractForm.contractNumber = data?.contractNumber;
    this.contractForm.contractSum = data?.contractSum;
    this.contractForm.contractTypeId = data?.contractTypeId;
    this.contractForm.contractPeriod = data?.contractPeriod ? new Date(data?.contractPeriod) : null;
    this.contractForm.commission = data?.commission;
  }

  fillContractDto(): void {
    this.contractFormDto = new ContractFormDto(
      this.applicationId,
      this.contractForm.value.contractNumber,
      this.contractForm.value.contractPeriod,
      this.contractForm.value.contractSum,
      this.contractForm.value.commission,
      this.contractForm.value.contractTypeId
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
    if(this.isBuy) {
      this.contractForm.controls['contractTypeId'].setValidators([Validators.required]);
      this.contractForm.controls['contractTypeId'].updateValueAndValidity();
    }
    const controls = this.contractForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        this.translate.get('claim.validator.' + name).subscribe((field: string) => {
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
        const uuid = res?.uuid;
        this.isDisabled = true;
        this.isShowPdf = true;
        this.uploaderService.getResumePhoto(uuid).subscribe(file => {
          const iframe = window.document.getElementById('pdfIframe');
          const blob = new Blob([file], {type: 'application/pdf'});
          this.sourcePdf = window.URL.createObjectURL(blob);
          iframe.setAttribute('src', this.sourcePdf);
        }, error => {
          this.notifyService.showError('', error?.ru);
        });
        this.ngxLoader.stopBackground();
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

  backToPrev() {
    this.util.navigateByUrl(localStorage.getItem('previousUrl'));
  }

  canDeactivate(): boolean | Observable<boolean> {
    return confirm('Вы хотите покинуть страницу?');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
