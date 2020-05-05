import {Component, OnInit} from '@angular/core';
import {language} from '../../../environments/language';
import {formatDate} from '@angular/common';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap';
import {ClaimService} from '../../services/claim.service';
import {Dic} from '../../models/dic';
import {DicService} from '../../services/dic.service';
import {Util} from '../../services/util';
import {DatePeriod} from '../../models/common/datePeriod';
import {NotificationService} from '../../services/notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
    this.dicService.getDics('OPERATION_TYPES').subscribe(data => {
      this.operationType = this.util.toSelectArray(data);
    });
    this.dicService.getDics('APPLICATION_STATUSES').subscribe(data => {
      this.appStatuses = this.util.toSelectArray(data);
    });
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
    this.claimService.getClaims(searchFilter).subscribe(res => {
      if (res != null && res.data != null) {

        this.claimData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
        if (res.data.data.empty) {
          this.notification.showInfo('информация', 'Нет данных');
        }
      }
    });
    this.ngxLoader.stop();
  }

  getDicNameByLanguage(claim: any, column: string) {
    let x = this.util.getDicNameByLanguage();
    return claim[column]?.name[x];
  }

  formatDate(claim: any) {
    return formatDate(claim.creationDate, 'dd.MM.yyyy HH:mm', 'en-US');
  }
}
