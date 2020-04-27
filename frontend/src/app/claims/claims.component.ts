import {Component, OnInit} from '@angular/core';
import {language} from "../../environments/language";
import {formatDate} from '@angular/common';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from "ngx-bootstrap";
import {ClaimService} from "../services/claim.service";
import {Dic} from "../models/dic";
import {DicService} from "../services/dic.service";
import {Util} from "../services/util";
import {DatePeriod} from "../models/common/datePeriod";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  env = language;

  constructor(private localeService: BsLocaleService,
              private claimService: ClaimService,
              private dicService: DicService,
              private util: Util,
              private notification: NotificationService) {
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
  loading;
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;

  dnHref(href) {
    this.util.dnHref(href);
  }

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

    this.findClaims(0);
    this.dicService.getDics('OPERATION_TYPES').subscribe(data => {
      this.operationType = this.util.toSelectArray(data);
    });
    this.dicService.getDics('APPLICATION_STATUSES').subscribe(data => {
      this.appStatuses = this.util.toSelectArray(data);
    });
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClaims(event.page);
    }
  }

  findClaims(pageNo: number) {
    // this.itemsPerPage = 30;
    this.loading = true;
    let searchFilter = {};

    searchFilter['createDate'] = new DatePeriod(this.formData.crDateFrom, this.formData.crDateTo);
    searchFilter['changeDate'] = new DatePeriod(this.formData.lastModifyDateFrom, this.formData.lastModifyDateTo);
    searchFilter['commentDate'] = new DatePeriod(this.formData.lastCommentDateFrom, this.formData.lastCommentDateTo);

    if (!this.util.isNullOrEmpty(this.formData.typeId)) {
      searchFilter['operationTypeId'] = this.formData.typeId;
    }
    searchFilter['my'] = this.formData.myClaim;
    if (!this.util.isNullOrEmpty(this.formData.applicationStatuses)) {
      searchFilter['applicationStatusList'] = this.formData.applicationStatuses;
    }

    searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = 30;
    this.claimService.getClaims(searchFilter).subscribe(res => {
      if (res != null && res.data != null && !res.data.data.empty) {

        this.claimData = res.data.data.data;
        this.totalItems = res.data.totalElements;
        this.itemsPerPage = res.data.data.size;
        // this.currentPage = res.data.number + 1;
      } else {
        this.notification.showInfo('информация', 'Нет данных');
      }
    });
    this.loading = false;
  }

  getDicNameByLanguage(claim: any, column: string) {
    let x = this.util.getDicNameByLanguage();
    return claim[column]?.name[x];
  }

  formatDate(claim: any) {
    return formatDate(claim.creationDate, 'dd.MM.yyyy HH:mm', 'en-US');
  }
}
