import {Component, OnInit} from '@angular/core';
import {Util} from "../../../../services/util";
import {CreateClaimComponent} from "../create-claim.component";
import {filter, pairwise} from "rxjs/operators";
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {ContractService} from "../../../../services/contract.service";
import {Subscription} from "rxjs";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ContractFormAgreementDto} from "../../../../models/createClaim/ContractFormAgreementDto";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit {
  title: string;
  fromBoard: boolean = false;
  subscriptions: Subscription = new Subscription();
  contractFormDto: ContractFormAgreementDto
  isShowPdf = false;
  contractForm: any;
  // 4 - Договор задатка
  // 5 - аванс
  constructor(public util: Util,
              private actRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private ngxLoader: NgxUiLoaderService,
              private contractService: ContractService,
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
      applicationId: [null, Validators.nullValidator],
      payTypeId: [this.createClaimComponent.activeTab == 'advanceAgreement' ? 5 : 4, Validators.nullValidator],
      payedSum: [null, Validators.required]
    });
    this.contractForm.payTypeId = this.createClaimComponent.activeTab == 'advanceAgreement' ? 5 : 4;
  }

  get f() {
    return this.contractForm.controls;
  }

  generateContract(): void {
    // let isValid = true;
    // const controls = this.contractForm.controls;
    // for (const name in controls) {
    //   if (controls[name].invalid) {
    //     this.translate.get('claims.validator.' + name).subscribe((field: string) => {
    //       this.notifyService.showWarning('Внимание',`Поле ${field} не заполнено!`);
    //     });
    //     isValid = false;
    //   }
    // }
    // if (!isValid) return;
    // this.ngxLoader.startBackground();
    // this.fillContractDto();
    // this.subscriptions.add(this.contractService.generateContract(this.contractFormDto)
    //   .subscribe(res => {
    //     if(res) {
    //       this.isDisabled = true;
    //       this.isShowPdf = true;
    //       setTimeout(() => {
    //         const iframe = window.document.getElementById('pdfIframe');
    //         const byteArray = new Uint8Array(atob(res).split('').map(char => char.charCodeAt(0)));
    //         const blob = new Blob([byteArray], {type: 'application/pdf'});
    //         this.sourcePdf =  window.URL.createObjectURL(blob);
    //         iframe.setAttribute('src', this.sourcePdf);
    //       }, 300);
    //     }
    //     this.ngxLoader.stopBackground();
    //   }, err => {
    //     this.notifyService.showError('', err?.ru);
    //     this.ngxLoader.stopBackground();
    //   }));
  }

  searchApplication() {
    this.subscriptions.add(this.contractService.getContractForm(this.contractForm.applicationId).subscribe(res => {
      console.log(res)
    }));
  }

  backToPrev() {
    this.util.navigateByUrl(localStorage.getItem('previousUrl'));
  }

}
