import {Component, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../environments/language';
import {formatDate} from '@angular/common';
import {ClaimService} from '../../services/claim.service';
import {Dic} from '../../models/dic';
import {Util} from '../../services/util';
import {NotificationService} from '../../services/notification.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Subscription} from "rxjs";
import {FormBuilder, Validators} from "@angular/forms";
import {SearchCommon} from "../../models/common/search.common";
import {Period} from "../../models/common/period";
import {OwnerService} from "../../services/owner.service";
import {NewDicService} from "../../services/new.dic.service";

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit, OnDestroy {
  env = language;
  subscriptions: Subscription = new Subscription();

  constructor(private claimService: ClaimService,
              private util: Util,
              private formBuilder: FormBuilder,
              private ownerService: OwnerService,
              private notification: NotificationService,
              private newDicService: NewDicService,
              private ngxLoader: NgxUiLoaderService) {
  }

  applicationSearchForm: any;
  searchCommon: SearchCommon;
  operationType: Dic[];
  appStatuses: Dic[];
  claimData = [];
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;
  empty: boolean = false;

  clearForm() {
    this.applicationSearchForm.reset();
  }

  ngOnInit(): void {
    this.applicationSearchForm = this.formBuilder.group({
      operationTypeId: [null, Validators.nullValidator],
      applicationStatusList: [null, Validators.nullValidator],
      crDateFrom: [null, Validators.nullValidator],
      crDateTo: [null, Validators.nullValidator],
      lastModifyDateFrom: [null, Validators.nullValidator],
      lastModifyDateTo: [null, Validators.nullValidator],
      lastCommentDateFrom: [null, Validators.nullValidator],
      lastCommentDateTo: [null, Validators.nullValidator],
      text: [null, Validators.nullValidator],
    });

    this.findClaims(1);

    this.subscriptions.add(this.newDicService.getDictionary('ApplicationStatus').subscribe(res => {
      this.appStatuses = this.util.toSelectArray(res);

    }));
    this.subscriptions.add(this.newDicService.getDictionary('OperationType').subscribe(res => {
      this.operationType = this.util.toSelectArray(res);
    }));
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClaims(event.page);
    }
  }

  findClaims(pageNo: number) {
    this.ngxLoader.startBackground();
    let searchFilter = {};
    searchFilter['createDate'] = new Period(this.applicationSearchForm.value.crDateFrom, this.applicationSearchForm.value.crDateTo);
    searchFilter['changeDate'] = new Period(this.applicationSearchForm.value.lastModifyDateFrom, this.applicationSearchForm.value.lastModifyDateTo);
    searchFilter['commentDate'] = new Period(this.applicationSearchForm.value.lastCommentDateFrom, this.applicationSearchForm.value.lastCommentDateTo);
    searchFilter['operationTypeId'] = this.applicationSearchForm.value.operationTypeId;
    searchFilter['applicationStatusList'] = this.applicationSearchForm.value.applicationStatusList;
    searchFilter['text'] = this.applicationSearchForm.value.text;
    searchFilter['direction'] = 'DESC';
    searchFilter['sortBy'] = 'id';
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.subscriptions.add(this.claimService.getClaims(searchFilter).subscribe(res => {
      if (res != null && res.data != null) {
        this.claimData = res.data.data.data;
        this.claimData.forEach(data =>
          this.searchByPhone(data)
        )
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
        if (res.data.data.empty) {
          this.empty = true;
        }
      }
    }));
    this.ngxLoader.stopBackground();
  }

  getDicNameByLanguage(claim: any, column: string) {
    let x = this.util.getDicNameByLanguage();
    return claim[column]?.name[x];
  }

  formatDate(claim: any) {
    return formatDate(claim.creationDate, 'dd.MM.yyyy HH:mm', 'en-US');
  }

  searchByPhone(claim: any) {
    if (!this.util.isNullOrEmpty(claim.phone)) {
      this.subscriptions.add(this.ownerService.searchByPhone(claim.phone)
        .subscribe(res => {
          claim['fullName'] = res?.firstName.concat(' ', res?.surname, ' ' , res?.patronymic ? res?.patronymic : ' ').toUpperCase()
          claim['email'] = res?.email;
          console.log(res)
        }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
