import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Util} from "../../../../services/util";
import {CreateClaimComponent} from "../create-claim.component";
import {filter, pairwise} from "rxjs/operators";
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {ContractService} from "../../../../services/contract.service";
import {Subscription} from "rxjs";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ContractFormAgreementDto} from "../../../../models/createClaim/ContractFormAgreementDto";
import {FormBuilder, Validators} from "@angular/forms";
import {NotificationService} from "../../../../services/notification.service";
import {UploaderService} from "../../../../services/uploader.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit, OnDestroy {
  title: string;
  fromBoard: boolean = false;
  subscriptions: Subscription = new Subscription();
  isShowPdf = true;
  url: string;
  uuid: string = "66ee7e14-a334-4574-b59b-7ef4e919401c";
  contractForm: any;
  sellApplicationId: any;
  sourcePdf: any;
  // 4 - Договор задатка
  // 5 - аванс
  constructor(public util: Util,
              private actRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private ngxLoader: NgxUiLoaderService,
              private notifyService: NotificationService,
              private contractService: ContractService,
              private uploaderService: UploaderService,
              public createClaimComponent: CreateClaimComponent) {
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('fromBoard'))) {
      this.fromBoard = this.actRoute.snapshot.queryParamMap.get('fromBoard') == 'true';
    }
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        console.log('previous url', events[0].urlAfterRedirects);
        console.log('current url', events[1].urlAfterRedirects);
        localStorage.setItem('previousUrl', events[0].urlAfterRedirects)
      })
  }

  ngOnInit(): void {
    this.contractForm = this.formBuilder.group({
      applicationId: [Number(this.actRoute.snapshot.params.id), Validators.nullValidator],
      sellApplicationId: [null, Validators.required],
      payTypeId: [this.createClaimComponent.activeTab == 'advanceAgreement' ? 5 : 4, Validators.nullValidator],
      payedSum: [null, Validators.required]
    });
    this.contractForm.payTypeId = this.createClaimComponent.activeTab == 'advanceAgreement' ? 5 : 4;
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('sellApplicationId'))) {
      this.contractForm.sellApplicationId = this.actRoute.snapshot.queryParamMap.get('sellApplicationId');
    }
  }

  get f() {
    return this.contractForm.controls;
  }

  generateContract(): void {
    this.ngxLoader.startBackground();
    this.fillContractDto();
    console.log(this.contractForm.value)

    // this.subscriptions.add(this.contractService.generateDepositContract(this.contractForm.value)
    //   .subscribe(res => {
    //     console.log(res)
    //     if (res) {
          if (!this.util.isNullOrEmpty(this.uuid)) {
            this.uploaderService.getResumePhoto(this.uuid).subscribe(file => {
              const iframe = window.document.getElementById('pdfIframe');
              const blob = new Blob([file], {type: 'application/pdf'});
              this.sourcePdf = window.URL.createObjectURL(blob);
              console.log(this.sourcePdf)
              iframe.setAttribute('src', this.sourcePdf);
            }, error => {
              this.notifyService.showError('', error?.ru);
            });
          }
      //     console.log(res)
      //     // this.isDisabled = true;
      //     this.isShowPdf = true;
      //     // setTimeout(() => {
      //     //   const iframe = window.document.getElementById('pdfIframe');
      //     //   const byteArray = new Uint8Array(atob(res).split('').map(char => char.charCodeAt(0)));
      //     //   const blob = new Blob([byteArray], {type: 'application/pdf'});
      //     //   this.sourcePdf =  window.URL.createObjectURL(blob);
      //     //   iframe.setAttribute('src', this.sourcePdf);
      //     // }, 300);
      //   }
      // }, err => {
      //   this.notifyService.showError('', err?.ru);
      // }));
    this.ngxLoader.stopBackground();
  }

  fillContractDto() {

  }

  searchApplication() {
    this.router.navigate(['objects'], {queryParams: {fromBoard: true}})
  }

  backToPrev() {
    this.util.navigateByUrl(localStorage.getItem('previousUrl'));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
