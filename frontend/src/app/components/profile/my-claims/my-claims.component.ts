import { Component, OnInit } from '@angular/core';
import {DatePeriod} from "../../../models/common/datePeriod";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ClaimService} from "../../../services/claim.service";
import {DicService} from "../../../services/dic.service";
import {ruLocale} from "ngx-bootstrap/locale";
import {BsLocaleService} from "ngx-bootstrap";
import {Util} from "../../../services/util";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-my-claims',
  templateUrl: './my-claims.component.html',
  styleUrls: ['./my-claims.component.scss']
})
export class MyClaimsComponent implements OnInit {
  text: string;
  constructor(private localeService: BsLocaleService,
              private claimService: ClaimService,
              private dicService: DicService,
              private util: Util) {
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
    myClaim: true
  };


  claimData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;

  ngOnInit(): void {
    this.findClaims(1);
    }
  dnHref(href) {
    this.util.dnHref(href);
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
    searchFilter['text'] = this.text;
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.claimService.getClaims(searchFilter).subscribe(res => {

        this.claimData = res.data.data.data;
        this.totalItems = res.data.total;
        // this.itemsPerPage = res.data.data.size;
        this.currentPage = res.data.pageNumber + 1;

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
