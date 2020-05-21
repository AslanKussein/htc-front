import {Component, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../environments/language';
import {formatDate} from '@angular/common';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap';
import {ClaimService} from '../../services/claim.service';
import {Dic} from '../../models/dic';
import {Util} from '../../services/util';
import {DatePeriod} from '../../models/common/datePeriod';
import {NotificationService} from '../../services/notification.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit, OnDestroy {
  env = language;
  subscriptions: Subscription = new Subscription();

  constructor(private localeService: BsLocaleService,
              private claimService: ClaimService,
              private util: Util,
              private notification: NotificationService,
              private ngxLoader: NgxUiLoaderService) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  formData = {
    typeId: null,
    applicationStatuses: null,
    crDateFrom: '',
    crDateTo: '',
    lastModifyDateFrom: '',
    lastModifyDateTo: '',
    lastCommentDateFrom: '',
    lastCommentDateTo: '',
    textSearch: null,
    myClaim: false
  };

  operationType: Dic[];
  appStatuses: Dic[];
  claimData = [];
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;
  empty: boolean = false;

  clearForm() {
    this.formData = {
      typeId: null,
      applicationStatuses: null,
      crDateFrom: '',
      crDateTo: '',
      lastModifyDateFrom: '',
      lastModifyDateTo: '',
      lastCommentDateFrom: '',
      lastCommentDateTo: '',
      textSearch: null,
      myClaim: false
    };
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    this.findClaims(1);
    this.util.getAllDic('OperationType').then(res => {
      this.operationType = res;
    })
    this.util.getAllDic('ApplicationStatus').then(res => {
      this.appStatuses = res;
    })

    this.ngxLoader.stop();
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClaims(event.page);
    }
  }

  findClaims(pageNo: number) {
    this.ngxLoader.start();
    const searchFilter = {};

    searchFilter['createDate'] = new DatePeriod(this.formData.crDateFrom, this.formData.crDateTo);
    searchFilter['changeDate'] = new DatePeriod(this.formData.lastModifyDateFrom, this.formData.lastModifyDateTo);
    searchFilter['commentDate'] = new DatePeriod(this.formData.lastCommentDateFrom, this.formData.lastCommentDateTo);

    if (!this.util.isNullOrEmpty(this.formData.typeId)) {
      searchFilter['operationTypeId'] = this.formData.typeId;
    }
    searchFilter["my"] = this.formData.myClaim;
    if (!this.util.isNullOrEmpty(this.formData.applicationStatuses)) {
      searchFilter['applicationStatusList'] = this.formData.applicationStatuses;
    }

    searchFilter['text'] = this.formData.textSearch;
    searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.subscriptions.add(this.claimService.getClaims(searchFilter).subscribe(res => {
      if (res != null && res.data != null) {

        this.claimData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
        if (res.data.data.empty) {
          this.empty = true;
        }
      }
    }));
    this.ngxLoader.stop();
  }

  getDicNameByLanguage(claim: any, column: string) {
    let x = this.util.getDicNameByLanguage();
    return claim[column]?.name[x];
  }

  formatDate(claim: any) {
    return formatDate(claim.creationDate, 'dd.MM.yyyy HH:mm', 'en-US');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
