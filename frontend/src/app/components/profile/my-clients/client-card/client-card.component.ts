import {Component, OnInit, TemplateRef} from '@angular/core';
import {ProfileDto} from "../../../../models/profile/profileDto";
import {AuthenticationService} from "../../../../services/authentication.service";
import {User} from "../../../../models/users";
import {DatePeriod} from "../../../../models/common/datePeriod";
import {formatDate} from "@angular/common";
import {Util} from "../../../../services/util";
import {ruLocale} from "ngx-bootstrap/locale";
import {ClaimService} from "../../../../services/claim.service";
import {DicService} from "../../../../services/dic.service";
import {defineLocale} from "ngx-bootstrap/chronos";
import {BsLocaleService} from "ngx-bootstrap";
import {ActivatedRoute} from "@angular/router";
import {ClientDto} from "../../../../models/clientCard/clientDto";
import {ClientsService} from "../../../../services/clients.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NotificationService} from "../../../../services/notification.service";

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {
  currentUser: User;

   profile: any;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;

  client:ClientDto;
  claimData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;
  clientId:number;
  gender:string;
  agentRoles:boolean;
  rgRoles:boolean;


  constructor(private localeService: BsLocaleService,
              private claimService: ClaimService,
              private clientsService: ClientsService,
              private modalService: BsModalService,
              private notifyService: NotificationService,

              private dicService: DicService,
              private authenticationService: AuthenticationService,
              private actRoute: ActivatedRoute,
              private util: Util) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.clientId = this.actRoute.snapshot.params.id;

    if(this.currentUser.roles!=null){
      this.agentRoles=false;
      this.rgRoles=false;
      for (const role of this.currentUser.roles) {
        console.log(this.currentUser.roles)
        if(role=='AGENT_GROUP_CHOOSE'){
          this.agentRoles=true;
        }
        if(role=='РГ'){
          this.rgRoles=true;
        }
      }
    }
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


  formClient = {
    id:	null,
    email:	'',
    phoneNumber:'',
    gender: '',
    firstName: '',
    surname: '',
    patronymic: '',
    addPhoneNumbers:[]
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
          this.profile = res;
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' },{ keyboard: false, backdrop: 'static'})
    );

    this.formClient = {
      id:	this.profile?.id,
      email:	this.profile?.email,
      phoneNumber:this.profile?.phoneNumber,
      gender: this.profile?.gender,
      firstName: this.profile?.firstName,
      surname: this.profile?.surname,
      patronymic: this.profile?.patronymic,
      addPhoneNumbers: this.profile?.addPhoneNumbers,
    };
  }

  submit(){
    if(this.util.isNullOrEmpty(this.formClient.phoneNumber)||this.util.isNullOrEmpty(this.formClient.firstName)) {
      this.notifyService.showError('Пожалуйста, заполните все поля', "");
      return;
    }
    this.formClient.addPhoneNumbers=['1d11','6s66']
     this.clientsService.updateClientById(this.formClient)  .subscribe(data => {
       if (data != null) {
         this.notifyService.showSuccess('success', 'Успешно сохранено');
         this.profile=data;
         this.modalRef.hide();
         }
     }, err => {
       this.notifyService.showError('warning', err);
       this.modalRef.hide();

     });
  }


  getDataByPhoneNumber(){
    if(this.formClient.phoneNumber.length==10){
      this.clientsService.findClientByPhoneNumber(this.formClient.phoneNumber)  .subscribe(data => {
        if (data != null) {
          this.formClient=data;
          }
      }, err => {
        this.notifyService.showError('warning', err);
      });
    }
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template);
  }

  closeModal(){
    this.modalRef2.hide();
    this.modalRef.hide();
    }

}
