import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApplicationLightDto} from "../models/applicationLightDto";
import {DicService} from "../services/dic.service";
import {Util} from "../services/util";
import {Dic} from "../models/dic";
import {NotificationService} from "../services/notification.service";
import {ClientDto} from "../models/createClaim/clientDto";
import {ClaimService} from "../services/claim.service";
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  applicationLightForm: any;
  applicationLightDto: ApplicationLightDto;
  operationType: Dic[];
  claimLightData = [];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  constructor(private formBuilder: FormBuilder,
              private dicService: DicService,
              private util: Util,
              private notification: NotificationService,
              private claimService: ClaimService) {
  }

  ngOnInit(): void {
    this.applicationLightForm = this.formBuilder.group({
      id: [null, Validators.nullValidator],
      operationTypeId: [null, Validators.nullValidator],
      surName: [null, Validators.nullValidator],
      name: [null, Validators.nullValidator],
      patronymic: [null, Validators.nullValidator],
      phoneNumber: [null, Validators.nullValidator],
      note: [null, Validators.nullValidator],
      agentLogin: [null, Validators.nullValidator],
    });

    this.dicService.getDics('OPERATION_TYPES').subscribe(data => {
      this.operationType = this.util.toSelectArray(data);
    });

    this.findClaims(1);
  }

  fillApplicationLightDTO() {
    this.applicationLightDto = new ApplicationLightDto();
    this.applicationLightDto.operationTypeId = this.applicationLightForm?.operationTypeId?.value
    this.applicationLightDto.note = this.applicationLightForm?.note;
    this.applicationLightDto.agentLogin = this.applicationLightForm?.agentLogin;
    this.applicationLightDto.clientDto = new ClientDto();
    this.applicationLightDto.clientDto.firstName = this.applicationLightForm?.name;
    this.applicationLightDto.clientDto.surname = this.applicationLightForm?.surName;
    this.applicationLightDto.clientDto.patronymic = this.applicationLightForm?.patronymic;
    this.applicationLightDto.clientDto.phoneNumber = this.applicationLightForm?.phoneNumber;
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
    this.loading = true;
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
