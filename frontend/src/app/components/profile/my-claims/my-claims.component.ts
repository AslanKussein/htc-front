import {Component, OnInit} from '@angular/core';
import {DatePeriod} from "../../../models/common/datePeriod";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ClaimService} from "../../../services/claim.service";
import {DicService} from "../../../services/dic.service";
import {ruLocale} from "ngx-bootstrap/locale";
import {BsLocaleService} from "ngx-bootstrap";
import {Util} from "../../../services/util";
import {formatDate} from "@angular/common";
import {NotificationService} from "../../../services/notification.service";

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
              private notifyService: NotificationService,
              private util: Util) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  claimData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;

  ngOnInit(): void {
    this.findClaims(1);
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClaims(event.page);
    }
  }

  findClaims(pageNo: number) {
    this.loading = true;
    let searchFilter = {};

    searchFilter['my'] = true;
    // searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['text'] = this.text;
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.claimService.getClaims(searchFilter).subscribe(res => {
      this.claimData = res.data.data.data;
      this.totalItems = res.data.total;
      this.currentPage = res.data.pageNumber + 1;
      if(res.data.data.size==0){
        this.notifyService.showInfo('Ничего не найдено!', 'Внимание');
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
