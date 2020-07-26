import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ClaimService} from "../../../../services/claim.service";
import {Subscription} from "rxjs";
import {Util} from "../../../../services/util";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ClaimViewDto} from "../../../../models/createClaim/view/ClaimViewDto";
import {OwnerService} from "../../../../services/owner.service";
import {UploaderService} from "../../../../services/uploader.service";
import {CreateClaimComponent} from "../create-claim.component";
import {UserService} from "../../../../services/user.service";
import {Period} from "../../../../models/common/period";
import {Dic} from "../../../../models/dic";
import {NotificationService} from "../../../../services/notification.service";
import {DicService} from "../../../../services/dic.service";

@Component({
  selector: 'app-claim-view',
  templateUrl: './claim-view.component.html',
  styleUrls: ['./claim-view.component.scss']
})
export class ClaimViewComponent implements OnInit, OnDestroy {
  applicationId: number;
  claimViewDto: ClaimViewDto;
  subscriptions: Subscription = new Subscription();
  clientFullName: string = "";
  clientId: number;
  clientLogin: string;
  agentFullName: string = "";
  photoList: any[] = [];
  photoPlanList: any[] = [];
  photo3DList: any[] = [];
  isAuthor: boolean = false;
  agentList: Dic[];
  dicDynamic: Dic[];
  changeAgent: boolean = false;
  disabled: boolean = true;
  expandBlock: boolean = false;

  constructor(private actRoute: ActivatedRoute,
              public util: Util,
              private ngxLoader: NgxUiLoaderService,
              private ownerService: OwnerService,
              private userService: UserService,
              private uploader: UploaderService,
              private dicService: DicService,
              private notifyService: NotificationService,
              private createClaimComponent: CreateClaimComponent,
              private claimService: ClaimService) {
    this.applicationId = Number(this.actRoute.snapshot.params.id);
  }

  ngOnInit(): void {
    this.getApplicationById();
    this.subscriptions.add(this.userService.getAgentsToAssign().subscribe(obj => {
      this.agentList = this.util.toSelectArrayRoles(obj.data, 'login');
    }));
    this.subscriptions.add(this.dicService.getDics('YES_NO').subscribe(data => {
      this.dicDynamic = this.util.toSelectArrayOldDic(data);
    }));
  }

  hasShowGroup(operation: any) {
    if (!this.util.isNullOrEmpty(this.claimViewDto.operationList)) {
      for (const data of this.claimViewDto.operationList) {
        if (!this.util.isNullOrEmpty(data)) {
          if (operation.includes(data)) {
            return false;
          }
        }
      }
    }
    return true
  }

  fillIsEmpty() {
    if (this.util.isNullOrEmpty(this.claimViewDto.objectPricePeriod)) {
      this.claimViewDto.objectPricePeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.numberOfRoomsPeriod)) {
      this.claimViewDto.numberOfRoomsPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.floorPeriod)) {
      this.claimViewDto.floorPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.totalAreaPeriod)) {
      this.claimViewDto.totalAreaPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.livingAreaPeriod)) {
      this.claimViewDto.livingAreaPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.kitchenAreaPeriod)) {
      this.claimViewDto.kitchenAreaPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.balconyAreaPeriod)) {
      this.claimViewDto.balconyAreaPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.ceilingHeightPeriod)) {
      this.claimViewDto.ceilingHeightPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.numberOfBedroomsPeriod)) {
      this.claimViewDto.numberOfBedroomsPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.numberOfFloorsPeriod)) {
      this.claimViewDto.numberOfFloorsPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.apartmentsOnTheSitePeriod)) {
      this.claimViewDto.apartmentsOnTheSitePeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.yearOfConstructionPeriod)) {
      this.claimViewDto.yearOfConstructionPeriod = new Period(null, null)
    }
    if (this.util.isNullOrEmpty(this.claimViewDto.landAreaPeriod)) {
      this.claimViewDto.landAreaPeriod = new Period(null, null)
    }
  }

  getApplicationById() {
    this.claimViewDto = new ClaimViewDto();
    this.ngxLoader.startBackground();
    if (!this.util.isNullOrEmpty(this.applicationId)) {
      this.subscriptions.add(
        this.claimService.getApplicationViewById(this.applicationId).subscribe(res => {
          this.claimViewDto = res;
          this.claimViewDto.possibleReasonForBiddingIdList = this.util.toSelectArrayView(this.claimViewDto.possibleReasonForBiddingIdList)
          this.claimViewDto.applicationFlagIdList = this.util.toSelectArrayView(this.claimViewDto.applicationFlagIdList)
          this.claimViewDto.typeOfElevatorList = this.util.toSelectArrayView(this.claimViewDto.typeOfElevatorList)
          this.claimViewDto.parkingTypes = this.util.toSelectArrayView(this.claimViewDto.parkingTypes)
          this.fillIsEmpty();
          this.searchByPhone(res.clientLogin);
          this.searchByLoginAgent(res.agent);
          if (this.util.getCurrentUser().login == res.agent) {
            this.isAuthor = true;
          }

          if (!this.util.isNullOrEmpty(this.claimViewDto?.photoIdList)) {
            for (const ph of this.claimViewDto.photoIdList) {
              this.fillPicture(ph, 1);
            }
          }
          if (!this.util.isNullOrEmpty(this.claimViewDto?.housingPlanImageIdList)) {
            for (const ph of this.claimViewDto.housingPlanImageIdList) {
              this.fillPicture(ph, 2);
            }
          }
          if (!this.util.isNullOrEmpty(this.claimViewDto?.virtualTourImageIdList)) {
            for (const ph of this.claimViewDto?.virtualTourImageIdList) {
              this.fillPicture(ph, 3);
            }
          }
        }, () => this.ngxLoader.stopBackground())
      );
    }
    this.ngxLoader.stopBackground();
  }

  changeAgentBtn() {
    this.changeAgent = !this.changeAgent;
  }

  editApplication() {
    let result = confirm("Вы хотите редактировать заявку?");
    if (result) {
      this.createClaimComponent.view = true;
      this.util.dnHref('create-claim/' + this.applicationId)
    }
  }

  fillPicture(guid: any, id: number) {
    let uuid = guid.uuid != null ? guid.uuid : guid;
    this.subscriptions.add(this.uploader.getFileInfoUsingGET(uuid).subscribe(res => {
      if (res.size > 0) {
        let obj = {};
        obj['guid'] = uuid;
        obj['image'] = this.util.generatorPreviewUrl(uuid);
        obj['fullImage'] = this.util.generatorFullUrl(uuid);
        if (id == 1) {
          this.photoList.push(obj);
        } else if (id == 2) {
          this.photoPlanList.push(obj);
        } else if (id == 3) {
          this.photo3DList.push(obj);
        }
      }
    }))
  }

  searchByPhone(login: string) {
    if (this.util.isNullOrEmpty(login)) return;
    this.subscriptions.add(this.ownerService.findByLoginAndAppId(login, this.applicationId)
      .subscribe(res => {
          this.clientId = res.id;
          this.clientLogin = login;
          this.clientFullName = (res.surname ? res.surname : '') + ' ' + (res.firstName ? res.firstName : '') + ' ' + (res.patronymic ? res.patronymic : ' ');
        }
      ));
  }

  searchByLoginAgent(login: string) {
    if (this.util.isNullOrEmpty(login)) return;
    this.subscriptions.add(this.userService.findAgentByLogin(login)
      .subscribe(res => {
          this.agentFullName = res.id + ' (' + res.surname + ' ' + res.name + ' ' + (res.patronymic ? res.patronymic : ' ') + ')';
        }
      ));
  }

  getDicNameByLanguage(data: any, column: string) {
    if (!this.util.isNullOrEmpty(data)) {
      let x = this.util.getDicNameByLanguage();
      return !this.util.isNullOrEmpty(data[column]) ? data[column]?.[x] : '';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  hasUpdateRole() {
    if (!this.util.isNullOrEmpty(this.claimViewDto.operationList)) {
      for (const operation of this.claimViewDto.operationList) {
        if (operation.includes("UPDATE_")) {
          return true;
        }
      }
    }
    return false;
  }

  hasEditApplication() {
    return true;
  }

  reassignApplication() {
    this.ngxLoader.startBackground();
    let data = {};

    if (this.util.isNullOrEmpty(this.claimViewDto.agent)) {
      this.ngxLoader.stopBackground();
      this.notifyService.showInfo('Для переназначения нужно выбрать агента', 'Информация');
      return;
    }
    data['agent'] = this.claimViewDto.agent;
    data['applicationId'] = this.applicationId;

    this.subscriptions.add(this.claimService.reassignApplication(data)
      .subscribe(res => {
          this.notifyService.showInfo('Переназначено', 'Информация');
          this.searchByLoginAgent(this.claimViewDto.agent);
          this.changeAgentBtn();
        }, error => {
          this.notifyService.showError('', error?.ru);
        }
      ));
    this.ngxLoader.stopBackground();
  }

  toStringCompare(data: any) {
    if (this.util.isNullOrEmpty(data)) {
      return 'false';
    }
    return data?.toString();
  }

  expandedBlock() {
    this.expandBlock = !this.expandBlock;
  }
}
