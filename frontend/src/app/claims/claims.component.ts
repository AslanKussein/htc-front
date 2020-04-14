import {Component, OnInit} from '@angular/core';
import {language} from "../../environments/language";
import {Router} from "@angular/router";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from "ngx-bootstrap";
import {ClaimService} from "../services/claim.service";
import {Dic} from "../models/dic";
import {DicService} from "../services/dic.service";
import {Util} from "../services/util";

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  env = language;

  constructor(private router: Router,
              private localeService: BsLocaleService,
              private claimService: ClaimService,
              private dicService: DicService,
              private util: Util) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  formData = {
    typeId: '',
    applicationStatuses: '',
    crDateFrom: null,
    crDateTo: null,
    lastModifyDateFrom: null,
    lastModifyDateTo: null,
    lastCommentDateFrom: null,
    lastCommentDateTo: null,
    textSearch: null
  };

  operationType: Dic[];
  appStatuses: Dic[];
  claimData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }

  clearForm() {
    this.formData = {
      typeId: '',
      applicationStatuses: '',
      crDateFrom: null,
      crDateTo: null,
      lastModifyDateFrom: null,
      lastModifyDateTo: null,
      lastCommentDateFrom: null,
      lastCommentDateTo: null,
      textSearch: null
    };
  }

  ngOnInit(): void {
    this.findClaims(1);
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
    this.loading = true;
    let searchFilter = {};
    let obj = {};
    if (!this.util.isNullOrEmpty(this.formData.crDateFrom)) {
      obj['from'] = this.formData.crDateFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.crDateTo)) {
      obj['to'] = this.formData.crDateTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['createDate'] = obj;
    }
    obj = {};
    if (!this.util.isNullOrEmpty(this.formData.lastModifyDateFrom)) {
      obj['from'] = this.formData.lastModifyDateFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.lastModifyDateFrom)) {
      obj['to'] = this.formData.lastModifyDateTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['changeDate'] = obj;
    }
    obj = {};
    if (!this.util.isNullOrEmpty(this.formData.lastCommentDateFrom)) {
      obj['from'] = this.formData.lastCommentDateFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.lastCommentDateTo)) {
      obj['to'] = this.formData.lastCommentDateTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['commentDate'] = obj;
    }

    searchFilter['applicationTypeId'] = this.util.getValueByKey(this.formData.typeId, 'value');
    let app = [];
    for (const utilElement of this.formData.applicationStatuses) {
      app.push(this.util.getValueByKey(utilElement, 'value'));
    }
    searchFilter['applicationStatusList'] = app;
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.claimService.getClaims(searchFilter).subscribe(res => {
      // if (res != null && res.data != null) {
      //
      //   this.claimData = res.data.data.data;
      //   this.totalItems = res.data.totalElements;
      //   this.itemsPerPage = res.data.size;
      //   this.currentPage = res.data.number + 1;
      // }
    });
    this.loading = false;
  }
}
