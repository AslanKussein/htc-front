import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Util} from "../../../../services/util";
import {filter, pairwise} from "rxjs/operators";
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {ContractService} from "../../../../services/contract.service";
import {Subscription} from "rxjs";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {FormBuilder, Validators} from "@angular/forms";
import {NotificationService} from "../../../../services/notification.service";
import {UploaderService} from "../../../../services/uploader.service";
declare var jquery: any;   // not required
declare var $: any;   // not required

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
  isShowPdf = false;
  url: string;
  uuid: string;
  contractForm: any;
  sellApplicationId: any;
  sourcePdf: any;
  payType: any;
  private payTypeId: any;

  @Input()
  set act(act: any) {
    if (!this.util.isNullOrEmpty(act)) {
      this.payType = (act == 'advanceAgreement' ? 'аванса' : 'задатка');
      this.payTypeId = (act == 'advanceAgreement' ? '5' : '4');
    }
  }

  // 4 - Договор задатка
  // 5 - аванс
  constructor(public util: Util,
              public actRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private ngxLoader: NgxUiLoaderService,
              private notifyService: NotificationService,
              private contractService: ContractService,
              private uploaderService: UploaderService) {
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('fromBoard'))) {
      this.fromBoard = this.actRoute.snapshot.queryParamMap.get('fromBoard') == 'true';
      this.util.showHideMenu(false);
    }
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('activeTab'))) {
      this.payTypeId = this.actRoute.snapshot.queryParamMap.get('activeTab') == 'advanceAgreement' ? '5' : '4';
    }
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        localStorage.setItem('boardUrl', events[0].urlAfterRedirects)
      })
  }

  ngOnInit(): void {
    this.contractForm = this.formBuilder.group({
      applicationId: [Number(this.actRoute.snapshot.params.id), Validators.nullValidator],
      sellApplicationId: [null, Validators.required],
      payTypeId: [this.payTypeId, Validators.nullValidator],
      payedSum: [null, Validators.required]
    });
    this.contractForm.payTypeId = this.payTypeId;
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('sellApplicationId'))) {
      this.contractForm.sellApplicationId = this.actRoute.snapshot.queryParamMap.get('sellApplicationId');
    }
  }

  get f() {
    return this.contractForm.controls;
  }

  generateContract(): void {
    this.ngxLoader.startBackground();

    this.subscriptions.add(this.contractService.generateDepositContract(this.contractForm.value)
      .subscribe(res => {
        if (res) {
          this.uuid = res.uuid;
          this.isShowPdf = true;
          if (!this.util.isNullOrEmpty(this.uuid)) {
            this.uploaderService.getResumePhoto(this.uuid).subscribe(file => {
              const iframe = window.document.getElementById('pdfIframe');
              const blob = new Blob([file], {type: 'application/pdf'});
              this.sourcePdf = window.URL.createObjectURL(blob);
              iframe.setAttribute('src', this.sourcePdf);
            }, error => {
              this.notifyService.showError('', error?.ru);
            });
          }
          this.isShowPdf = true;
        }
      }, err => {
        this.notifyService.showError('', err?.ru);
      }));
    this.ngxLoader.stopBackground();
  }

  searchApplication() {
    this.router.navigate(['objects'], {queryParams: {fromBoard: true}})
  }

  backToPrev() {
    if (this.fromBoard) {
      this.util.navigateByUrl(localStorage.getItem('backUrl'));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
