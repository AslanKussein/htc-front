import { Component, OnInit } from '@angular/core';
import {ProfileDto} from "../../../models/profile/profileDto";
import {AuthenticationService} from "../../../services/authentication.service";
import {User} from "../../../models/users";
import {DatePeriod} from "../../../models/common/datePeriod";
import {formatDate} from "@angular/common";
import {Util} from "../../../services/util";
import {ruLocale} from "ngx-bootstrap/locale";
import {ClaimService} from "../../../services/claim.service";
import {DicService} from "../../../services/dic.service";
import {defineLocale} from "ngx-bootstrap/chronos";
import {BsLocaleService} from "ngx-bootstrap";
import {ActivatedRoute} from "@angular/router";
import {ClientDto} from "../../../models/clientCard/clientDto";
import {ClientsService} from "../../../services/clients.service";

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {
  currentUser: User;

  // profile: ProfileDto;

  client:ClientDto;
  claimData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;
  clientId:number;
  gender:string;


  constructor(private localeService: BsLocaleService,
              private claimService: ClaimService,
              private clientsService: ClientsService,
              private dicService: DicService,
              private authenticationService: AuthenticationService,
              private actRoute: ActivatedRoute,
              private util: Util) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.clientId = this.actRoute.snapshot.params.id;
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

  ngOnInit(): void {
    this.findClaims(1);
    if (!this.util.isNullOrEmpty(this.clientId)){
      this.getClientById(this.clientId);
    }
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
    if (!this.util.isNullOrEmpty(this.clientId)) {
      searchFilter['clientId'] = Number(this.clientId);
    }

    searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['pageNumber'] = pageNo-1;
    searchFilter['pageSize'] = 30;
    this.claimService.getClaims(searchFilter).subscribe(res => {
      if (res != null && res.data != null && !res.data.data.empty) {
        this.claimData = res.data.data.data;
        this.totalItems = res.data.totalElements;
        this.itemsPerPage = res.data.data.size;
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

  getClientById(id:number){
      this.clientsService.getClientById(id).subscribe(res => {
        if (res != null) {
          this.client = res;
          if(res.gender!=null){
            if(res.gender=='MALE'){
              this.gender='муж.'
            }else if(res.gender=='FEMALE'){
              this.gender='жен.'
            }else{
              this.gender='не изв.'
            }

          }
          console.log(this.client)
        }
      });
  }

}
