import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {AuthenticationService} from "../../../../services/authentication.service";
import {User} from "../../../../models/users";
import {formatDate} from "@angular/common";
import {Util} from "../../../../services/util";
import {ClaimService} from "../../../../services/claim.service";
import {ActivatedRoute} from "@angular/router";
import {ClientDto} from "../../../../models/clientCard/clientDto";
import {ClientsService} from "../../../../services/clients.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NotificationService} from "../../../../services/notification.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {UploaderService} from "../../../../services/uploader.service";
import {Subscription} from "rxjs";
import {Period} from "../../../../models/common/period";

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit, OnDestroy {
  currentUser: User;
  selectedFile: File;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  subscriptions: Subscription = new Subscription();
  client: ClientDto;
  claimData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;
  clientId: string;
  gender: string;
  agentRoles: boolean;
  rgRoles: boolean;
  clientFiles: any [];
  size: 0;
  formClientCopy: any;


  constructor(private claimService: ClaimService,
              private clientsService: ClientsService,
              private modalService: BsModalService,
              private notifyService: NotificationService,
              private ngxLoader: NgxUiLoaderService,
              private uploader: UploaderService,
              private authenticationService: AuthenticationService,
              private actRoute: ActivatedRoute,
              private util: Util) {
    this.subscriptions.add(this.authenticationService.currentUser.subscribe(x => this.currentUser = x));
    this.clientId = this.actRoute.snapshot.params.id.slice(1, 11);

    if (this.currentUser.roles != null) {
      this.agentRoles = false;
      this.rgRoles = false;
      for (const role of this.currentUser.roles) {
        if (role == 'AGENT_GROUP_CHOOSE') {
          this.agentRoles = true;
        }
        if (role == 'РГ') {
          this.rgRoles = true;
        }
      }
      this.rgRoles = true;

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
    id: null,
    email: '',
    phoneNumber: '',
    gender: '',
    firstName: '',
    surname: '',
    patronymic: '',
    clientPhoneNumbersDtoList: [],
    clientFileDtoList: [],
    filename: []
  };

  ngOnInit(): void {
    this.findClaims(1);
    if (!this.util.isNullOrEmpty(this.clientId)) {
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

    searchFilter['createDate'] = new Period(this.formData.crDateFrom, this.formData.crDateTo);
    searchFilter['changeDate'] = new Period(this.formData.lastModifyDateFrom, this.formData.lastModifyDateTo);
    searchFilter['commentDate'] = new Period(this.formData.lastCommentDateFrom, this.formData.lastCommentDateTo);

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
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = 30;
    this.subscriptions.add(this.claimService.getClaims(searchFilter).subscribe(res => {
      if (res != null && res.data != null && !res.data.data.empty) {
        this.claimData = res.data.data.data;
        this.totalItems = res.data.totalElements;
        this.itemsPerPage = res.data.data.size;
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

  getClientById(id: string) {
    this.ngxLoader.start();
    this.subscriptions.add(this.clientsService.getClientById(id).subscribe(res => {
      if (res != null) {
        this.formClient = res;
        if (!this.util.isNullOrEmpty(this.formClient.clientFileDtoList)) {
          this.getFileNameList();
        }
        if (res.gender != null) {
          if (res.gender == 'MALE') {
            this.gender = 'муж.'
          } else if (res.gender == 'FEMALE') {
            this.gender = 'жен.'
          } else {
            this.gender = 'не изв.'
          }
        }
      }
    }));
    this.ngxLoader.stop();
  }

  openModal(template: TemplateRef<any>) {
    this.ngxLoader.start();
    this.formClientCopy =  {...this.formClient};
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, {class: 'gray modal-lg'}, {keyboard: false, backdrop: 'static'})
    );
    this.ngxLoader.stop();

  }

  submit() {
    this.ngxLoader.start();
    if (this.util.isNullOrEmpty(this.formClient.phoneNumber) || this.util.isNullOrEmpty(this.formClient.firstName)) {
      this.notifyService.showError('Пожалуйста, заполните все поля', "");
      return;
    }
    this.formClient.phoneNumber=this.clientId;
    this.subscriptions.add(this.clientsService.updateClientById(this.formClient).subscribe(data => {
      if (data != null) {

        if (!this.util.isNullOrEmpty(this.clientFiles)) {
          for (let i = 0; i < this.clientFiles.length; i++) {
            if (this.clientFiles[i].isDeleted) {
              this.subscriptions.add(this.uploader.removePhotoById(this.clientFiles[i].guid).subscribe(data => {
                this.clientFiles.splice(i, 1)
              }));
            }

          }
        }
        this.notifyService.showSuccess('success', 'Успешно сохранено');
        this.formClient = data;
        this.modalRef.hide();
      }
    }, err => {
      this.notifyService.showError('warning', err.message);
      this.modalRef.hide();

    }));
    this.ngxLoader.stop();
  }


  getDataByPhoneNumber() {
    if (this.formClient.phoneNumber.length == 10) {
      this.subscriptions.add(this.clientsService.findClientByPhoneNumber(this.formClient.phoneNumber).subscribe(data => {
        if (data != null) {
          this.formClient = data;
        }
      }, err => {
        this.notifyService.showError('warning', err);
      }));
    }
  }


   isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }


  openModal2(template: TemplateRef<any>) {
    console.log(this.formClientCopy);
    console.log(this.formClient);
    if(this.isEquivalent(this.formClientCopy,this.formClient)){
      this.modalRef.hide();
      return;
    }
    this.modalRef2 = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef2.hide();
    this.modalRef.hide();
    this.getClientById(this.clientId);
  }

  addPhoneNumber() {
    if (this.formClient.clientPhoneNumbersDtoList == null) {
      this.formClient.clientPhoneNumbersDtoList = []
      this.formClient.clientPhoneNumbersDtoList.push({
        phoneNumber: '',
        clientId: this.formClient.id
      })
    } else if (this.formClient.clientPhoneNumbersDtoList.length < 5) {
      this.formClient.clientPhoneNumbersDtoList.push({
        phoneNumber: '',
        clientId: this.formClient.id
      })

    } else {
      this.notifyService.showError('warning', 'Max 5 entries!');

    }
  }

  onFileChanged(event) {
    if(this.clientFiles!=null){
      if (this.clientFiles.length > 9) {
        this.notifyService.showWarning('Количество загружаемых файлов не более 10 шт.', 'Внимание!');
        return;
      }
      if (this.clientFiles.length > 0) {
        console.log(this.clientFiles)
        const len = this.clientFiles.length;
        this.size = 0;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            this.size = this.size + this.clientFiles[i].size;
            if (this.clientFiles.length == i + 1) {
              this.size = this.size + event.target.files[0].size;
              if (this.size > 20971520) {
                this.notifyService.showWarning('Общий размер прикрепляемых файлов должен быть не более 20 Мб.', 'Внимание!');
                return;

              }
            }
          }
        }
      }
    }
    this.ngxLoader.start();
    this.selectedFile = event.target.files[0];
    this.subscriptions.add(this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data && data.uuid) {
          if (this.formClient.clientFileDtoList == null) {
            this.formClient.clientFileDtoList = []
          }
          this.formClient.clientFileDtoList.push({
            guid: data.uuid,
            clientId: this.formClient.id
          });
          console.log(this.formClient.clientFileDtoList);

          this.clientsService.updateClientById(this.formClient).subscribe(data => {
            if (data != null) {
              this.notifyService.showSuccess('success', 'Успешно сохранено');
              this.formClient = data;
              if (!this.util.isNullOrEmpty(this.formClient.clientFileDtoList)) {
                this.getFileNameList();

              }
            }
          }, err => {
            this.notifyService.showError('warning', err);
          });

        }
      }));
    this.ngxLoader.stop();
  }

  removeFileById(guid) {
    this.ngxLoader.start();
    for (let i = 0; i < this.clientFiles.length; i++) {
      if (this.clientFiles[i].guid == guid) {
        // this.clientFiles.splice(i, 1)
        this.clientFiles[i].isDeleted = true;
      }
    }
    if (!this.util.isNullOrEmpty(this.formClient.clientFileDtoList)) {
      for (let i = 0; i < this.formClient.clientFileDtoList.length; i++) {
        if (this.formClient.clientFileDtoList[i].guid == guid) {
          this.formClient.clientFileDtoList[i].guid = ''
        }
      }

    }
    this.ngxLoader.stop();
  }

  getFileNameList() {
    this.ngxLoader.start();
    const len = this.formClient.clientFileDtoList.length;
    this.clientFiles = [];
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        this.subscriptions.add(this.uploader.getFileInfoUsingGET(this.formClient.clientFileDtoList[i].guid).subscribe(data => {
          if (data != null) {
            this.clientFiles.push({
              guid: this.formClient.clientFileDtoList[i].guid,
              filename: data.name,
              isDeleted: false,
              size: data.size
            });
            this.size = this.size + data.size;
            if (this.formClient.clientFileDtoList.length == this.clientFiles.length) {
              if (this.size > 1000) {

              }
            }
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
        }));
      }
    }
    this.ngxLoader.stop();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clearPhone(obj){

    const len = this.formClient.clientPhoneNumbersDtoList.length;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        if(this.formClient.clientPhoneNumbersDtoList[i]==obj){
          this.formClient.clientPhoneNumbersDtoList[i].phoneNumber="";
        }
      }}
  }
}
