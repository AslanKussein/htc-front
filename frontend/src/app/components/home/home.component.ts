import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApplicationLightDto} from "../../models/applicationLightDto";
import {Util} from "../../services/util";
import {Dic} from "../../models/dic";
import {NotificationService} from "../../services/notification.service";
import {ClientDto} from "../../models/createClaim/clientDto";
import {ClaimService} from "../../services/claim.service";
import {formatDate} from '@angular/common';
import {UserService} from "../../services/user.service";
import {TranslateService} from "@ngx-translate/core";
import {OwnerService} from "../../services/owner.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Subscription} from "rxjs";
import {NewDicService} from "../../services/new.dic.service";
import {HttpParams} from "@angular/common/http";
import {RoleManagerService} from "../../services/roleManager.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptions: Subscription = new Subscription();
  applicationLightForm: any;
  operationType: Dic[];
  agentList: Dic[];
  objectType: Dic[];
  claimLightData = [];
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;
  applicationLightDto: ApplicationLightDto;
  existsClient: boolean = false;
  roles: any;
  jpg2: string = '../../../assets/images/home/2.jpg';
  jpg3: string = '../../../assets/images/home/3.jpg';
  jpg1: string = '../../../assets/images/home/1.jpg';

  constructor(private formBuilder: FormBuilder,
              public util: Util,
              private notification: NotificationService,
              private claimService: ClaimService,
              private userService: UserService,
              private translate: TranslateService,
              private ownerService: OwnerService,
              private ngxLoader: NgxUiLoaderService,
              private notifyService: NotificationService,
              private newDicService: NewDicService,
              private roleManagerService: RoleManagerService,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.applicationLightForm = this.formBuilder.group({
      id: [null, Validators.nullValidator],
      clientId: [null, Validators.nullValidator],
      operationTypeId: [null, Validators.required],
      surName: [null, Validators.nullValidator],
      name: [null, Validators.required],
      patronymic: [null, Validators.nullValidator],
      phoneNumber: [null, Validators.required],
      note: [null, Validators.nullValidator],
      agentLogin: [null, Validators.nullValidator],
      objectTypeId: [null, Validators.required],
    });

    let params = new HttpParams();
    params = params.append('groupCodes', String('APPLICATION_GROUP'))
    params = params.append('groupCodes', String('REAL_PROPERTY_GROUP'))
    params = params.append('groupCodes', String('CLIENT_GROUP'))
    params = params.append('groupCodes', String('AGENT_GROUP'))
    this.roleManagerService.getCheckOperationList(params).subscribe(obj => {
      if (!this.util.hasShowAgentGroup('CHOOSE_GROUP_AGENT', obj.data) &&
        this.util.hasShowAgentGroup('CHOOSE_ANY_AGENT', obj.data)) {
        this.applicationLightForm.controls['agentLogin'].setValidators([Validators.required]);
        this.applicationLightForm.controls["agentLogin"].updateValueAndValidity();
      }
      this.roles = obj.data
    });

    this.cdRef.detectChanges()

    this.subscriptions.add(this.newDicService.getDictionary('ObjectType').subscribe(res => {
      this.objectType = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('OperationType').subscribe(res => {
      this.operationType = this.util.toSelectArray(res);
    }));

    this.subscriptions.add(this.userService.getAgentsToAssign().subscribe(obj => {
      this.agentList = this.util.toSelectArrayRoles(obj.data, 'login');
    }));

    this.findClaims(1);
  }

  fillApplicationLightDTO() {
    this.applicationLightDto = new ApplicationLightDto();
    this.applicationLightDto.operationTypeId = this.applicationLightForm.operationTypeId;
    // this.applicationLightDto.operationTypeId = this.applicationLightForm?.value.operationTypeId?.value
    this.applicationLightDto.note = this.applicationLightForm?.value?.note;
    this.applicationLightDto.agentLogin = this.applicationLightForm?.value?.agentLogin;
    this.applicationLightDto.clientLogin = this.applicationLightForm?.value?.phoneNumber;
    this.applicationLightDto.objectTypeId = this.applicationLightForm?.value?.objectTypeId?.value;
  }

  clear() {
    this.applicationLightForm.reset();
  }

  get f() {
    return this.applicationLightForm.controls;
  }

  searchByPhone() {
    if (this.applicationLightForm.value.phoneNumber != null && this.applicationLightForm.value.phoneNumber.length == 10) {
      this.subscriptions.add(this.ownerService.findByLoginAndAppId(this.applicationLightForm.value.phoneNumber, null)
        .subscribe(res => {
          this.applicationLightForm.name = !this.util.isNullOrEmpty(res.firstName) ? res.firstName : null;
          this.applicationLightForm.surName = !this.util.isNullOrEmpty(res.surname) ? res.surname : null;
          this.applicationLightForm.patronymic = !this.util.isNullOrEmpty(res.patronymic) ? res.patronymic : null;
          this.existsClient = true;
          this.cdRef.detectChanges()
        }));
    }
  }

  createClient() {
    let dto = new ClientDto();
    dto.firstName = this.applicationLightForm.value.name;
    dto.surname = this.applicationLightForm.value.surName;
    dto.patronymic = this.applicationLightForm.value.patronymic;
    dto.phoneNumber = this.applicationLightForm.value.phoneNumber;
    this.subscriptions.add(this.userService.createUserClient(dto).subscribe());
  }

  validate() {
    if (this.util.hasShowAgentGroup('CHOOSE_ANY_AGENT', this.roles)) {
      this.applicationLightForm.controls['agentLogin'].setValidators(Validators.required);
      this.applicationLightForm.controls['agentLogin'].updateValueAndValidity();
    } else {
      this.applicationLightForm.controls['agentLogin'].setValidators(Validators.nullValidator);
      this.applicationLightForm.controls['agentLogin'].updateValueAndValidity();
    }
  }

  onSave() {
    this.validate();
    console.log(this.applicationLightForm.valid)
    if (this.applicationLightForm.validate) {
      return
    }
    const controls = this.applicationLightForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name)
        this.subscriptions.add(this.translate.get('claim.validator.' + name).subscribe((text: string) => {
          this.notifyService.showInfo("Ошибка", "Поле " + text + " не заполнено!!!");
        }));
        return;
      }
    }
    if (!this.existsClient) {
      this.createClient()
    }
    this.fillApplicationLightDTO();
    this.subscriptions.add(this.claimService.saveLightApplication(this.applicationLightDto)
      .subscribe(data => {
        if (data != null) {
          this.findClaims(1);
          this.clear();
          this.notification.showSuccess('success', 'Успешно сохранено');
        }
      }, err => {
        this.notification.showWarning('warning', err);
      }));
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClaims(event.page);
    }
  }

  findClaims(pageNo: number) {
    this.ngxLoader.startBackground();
    const searchFilter = {};
    searchFilter['direction'] = 'DESC';
    searchFilter['sortBy'] = 'id';
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.subscriptions.add(this.claimService.getShortApplicationList(searchFilter).subscribe(res => {
      if (res != null && res.data != null) {
        this.claimLightData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
