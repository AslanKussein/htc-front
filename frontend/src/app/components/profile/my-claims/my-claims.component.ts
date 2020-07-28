import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClaimService} from "../../../services/claim.service";
import {Util} from "../../../services/util";
import {formatDate} from "@angular/common";
import {NotificationService} from "../../../services/notification.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-my-claims',
  templateUrl: './my-claims.component.html',
  styleUrls: ['./my-claims.component.scss']
})
export class MyClaimsComponent implements OnInit, OnDestroy {
  text: string;
  subscriptions: Subscription = new Subscription();

  constructor(private claimService: ClaimService,
              private notifyService: NotificationService,
              public util: Util) {
  }

  claimData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
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
    this.subscriptions.add(this.claimService.getClaims(searchFilter).subscribe(res => {
      this.claimData = res.data.data.data;
      this.totalItems = res.data.total;
      this.currentPage = res.data.pageNumber + 1;
      if(res.data.data.size==0){
        this.notifyService.showInfo('Ничего не найдено!', 'Внимание');
      }
    }));
    this.loading = false;
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
