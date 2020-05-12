import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApplicationLightDto} from "../../models/applicationLightDto";
import {DicService} from "../../services/dic.service";
import {Util} from "../../services/util";
import {Dic} from "../../models/dic";
import {NotificationService} from "../../services/notification.service";
import {ClientDto} from "../../models/createClaim/clientDto";
import {ClaimService} from "../../services/claim.service";
import {formatDate} from '@angular/common';
import {UserService} from "../../services/user.service";
import {NgSelectConfig} from "@ng-select/ng-select";
import {TranslateService} from "@ngx-translate/core";
import {OwnerService} from "../../services/owner.service";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  applicationLightForm: any;
  operationType: Dic[];
  agentList: Dic[];
  claimLightData = [];
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;
  applicationLightDto: ApplicationLightDto;

  constructor(private formBuilder: FormBuilder,
              private dicService: DicService,
              private util: Util,
              private notification: NotificationService,
              private claimService: ClaimService,
              private userService: UserService,
              private config: NgSelectConfig,
              private translate: TranslateService,
              private ownerService: OwnerService,
              private ngxLoader: NgxUiLoaderService,
              private cdRef: ChangeDetectorRef) {
    this.config.notFoundText = 'Данные не найдены';
  }

  ngOnInit(): void {
    this.applicationLightForm = this.formBuilder.group({
      id: [null, Validators.nullValidator],
      clientId: [null, Validators.nullValidator],
      operationTypeId: [null, Validators.required],
      surName: [null, Validators.required],
      name: [null, Validators.required],
      patronymic: [null, Validators.nullValidator],
      phoneNumber: [null, Validators.required],
      note: [null, Validators.nullValidator],
      agentLogin: [null, Validators.nullValidator],
    });

    if (this.hasRGRole()) {
      this.applicationLightForm.controls['agentLogin'].setValidators([Validators.required]);
      this.applicationLightForm.controls["agentLogin"].updateValueAndValidity();
    }

    this.cdRef.detectChanges()

    this.dicService.getDics('OPERATION_TYPES').subscribe(data => {
      this.operationType = this.util.toSelectArray(data);
    });
    this.userService.getAgents().subscribe(obj => {
      this.agentList = this.util.toSelectArrayRoles(obj, 'login');
    });

    this.findClaims(1);
  }

  fillApplicationLightDTO() {
    this.applicationLightDto = new ApplicationLightDto();
    this.applicationLightDto.operationTypeId = this.applicationLightForm?.value.operationTypeId?.value
    this.applicationLightDto.note = this.applicationLightForm?.value?.note;
    this.applicationLightDto.agentLogin = this.applicationLightForm?.value?.agentLogin;
    this.applicationLightDto.clientDto = new ClientDto();
    this.applicationLightDto.clientDto.id = this.applicationLightForm?.value?.clientId;
    this.applicationLightDto.clientDto.firstName = this.applicationLightForm?.value?.name;
    this.applicationLightDto.clientDto.surname = this.applicationLightForm?.value?.surName;
    this.applicationLightDto.clientDto.patronymic = this.applicationLightForm?.value?.patronymic;
    this.applicationLightDto.clientDto.phoneNumber = this.applicationLightForm?.value?.phoneNumber;
  }

  clear() {
    this.applicationLightForm.reset();
  }

  get f() {
    return this.applicationLightForm.controls;
  }

  searchByPhone() {
    if (this.applicationLightForm.phoneNumber != null && this.applicationLightForm.phoneNumber.length == 10) {
      this.ownerService.searchByPhone('7' + this.applicationLightForm.phoneNumber)
        .subscribe(res => {
          this.applicationLightForm.name = !this.util.isNullOrEmpty(res.firstName) ? res.firstName : null;
          this.applicationLightForm.surName = !this.util.isNullOrEmpty(res.surname) ? res.surname : null;
          this.applicationLightForm.patronymic = !this.util.isNullOrEmpty(res.patronymic) ? res.patronymic : null;
          this.applicationLightForm.phoneNumber = res.phoneNumber;
          this.applicationLightForm.phoneNumber = res.phoneNumber;
          this.applicationLightForm.clientId = res?.id;
        });
    }
  }

  onSave() {
    this.fillApplicationLightDTO();
    this.claimService.saveLightApplication(this.applicationLightDto)
      .subscribe(data => {
        if (data != null) {
          this.findClaims(1);
          this.notification.showSuccess('success', 'Успешно сохранено');
        }
      }, err => {
        this.notification.showWarning('warning', err);
      });
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClaims(event.page);
    }
  }

  findClaims(pageNo: number) {
    this.ngxLoader.start();
    const searchFilter = {};
    searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.claimService.getShortApplicationList(searchFilter).subscribe(res => {
      if (res != null && res.data != null) {
        this.claimLightData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;

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

  hasRGRole() {
    return this.util.hasRGRole();
  }
}
