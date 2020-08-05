import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {CreateClaimComponent} from "../claims/create-claim/create-claim.component";
import {Period} from "../../models/common/period";
import {DicService} from "../../services/dic.service";
import {Dic} from "../../models/dic";
import {Util} from "../../services/util";
import {Subscription} from "rxjs/index";
import {OwnerService} from "../../services/owner.service";
import {NotificationService} from "../../services/notification.service";
import {ClaimViewDto} from "../../models/createClaim/view/ClaimViewDto";
import {UploaderService} from "../../services/uploader.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ClaimService} from "../../services/claim.service";
import {ActivatedRoute} from "@angular/router";
import {YandexMapComponent} from "../claims/create-claim/yandex-map/yandex-map.component";
import {CreditProgramm} from "../../models/CreditProgramm";
import {FormControl, FormGroup} from "@angular/forms";
import {CreditCalculatotModel} from "../../models/CreditCalculatotModel";
import {CreditProgrammService} from "../../services/creditProgrammService";
import {RealPropertyDto} from "../../models/createClaim/realPropertyDto";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-detailing',
  templateUrl: './detailing.component.html',
  styleUrls: ['./detailing.component.scss'],

})
export class DetailingComponent implements OnInit,OnDestroy {
  creditProgramm: CreditProgramm[];

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
  cord: any;
  claimData:any;
  ddd: any;
  modelMap: any;
  calculatorModel: CreditCalculatotModel = new CreditCalculatotModel();
  creditProgrammDic: Dic[];
  otherObjectsData: RealPropertyDto[];
  pageable = {
    direction: 'DESC',
    sortBy: 'id',
    pageNumber: 0,
    pageSize: 5
  };
  calculatorFormGroup = new FormGroup({
    firstPay: new FormControl(),
    years: new FormControl(),
    monthIncome: new FormControl(),
    programmId: new FormControl(),
    percent: new FormControl(),
    monthPay: new FormControl()
  });
  placemarkOptions = {
    preset: "twirl#redIcon",
    draggable: true,
    iconImageSize: [32, 32]
  };
  parameters = {
    options: {
      provider: 'yandex#search'
    }
  };

  constructor(private actRoute: ActivatedRoute,
              public util: Util,
              private ngxLoader: NgxUiLoaderService,
              private ownerService: OwnerService,
              private userService: UserService,
              private uploader: UploaderService,
              private creditProgrammService: CreditProgrammService,
              private dicService: DicService,
              private notifyService: NotificationService,
              private createClaimComponent: CreateClaimComponent,
              private claimService: ClaimService) {
    this.applicationId = Number(this.actRoute.snapshot.params.id);
  }

  ngOnInit(): void {
    this.modelMap = [];
    this.claimViewDto = new ClaimViewDto();
    this.cord = [51.12, 71.43];
    this.getApplicationById();
    this.subscriptions.add(this.userService.getAgentsToAssign().subscribe(obj => {
      this.agentList = this.util.toSelectArrayRoles(obj.data, 'login');
    }));
    this.subscriptions.add(this.dicService.getDics('YES_NO').subscribe(data => {
      this.dicDynamic = this.util.toSelectArrayOldDic(data);
    }));
    this.otherObjectsData = [];


    this.getCreditProgramm();

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


  getApplicationsByPostcode(postcode){
    this.ngxLoader.startBackground();
    this.subscriptions.add(
    this.claimService.getApplicationsByPostcode(postcode).subscribe(res => {
      this.claimData=res;
    })
    );
    this.ngxLoader.stopBackground();
  }

  formatDate(claim: any) {
    return formatDate(claim.creationDate, 'dd.MM.yyyy', 'en-US');
  }

  getApplicationById() {

    this.ngxLoader.startBackground();
    if (!this.util.isNullOrEmpty(this.applicationId)) {
      this.subscriptions.add(
        this.claimService.getApplicationViewById(this.applicationId).subscribe(res => {
          console.log(res)
          this.claimViewDto = res;
          this.getMap();
          this.claimViewDto.possibleReasonForBiddingIdList = this.util.toSelectArrayView(this.claimViewDto.possibleReasonForBiddingIdList)
          this.claimViewDto.applicationFlagIdList = this.util.toSelectArrayView(this.claimViewDto.applicationFlagIdList)
          this.claimViewDto.typeOfElevatorList = this.util.toSelectArrayView(this.claimViewDto.typeOfElevatorList)
          this.claimViewDto.parkingTypes = this.util.toSelectArrayView(this.claimViewDto.parkingTypes)
          this.claimViewDto.housingClass = this.util.toSelectArrayView(this.claimViewDto.housingClass)
          this.claimViewDto.districts = this.util.toSelectArrayView(this.claimViewDto.districts)
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
          if (!this.util.isNullOrEmpty(this.claimViewDto?.postcode)) {
              this.getApplicationsByPostcode(this.claimViewDto.postcode)
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
    return data?.toString();
  }

  expandedBlock() {
    this.expandBlock = !this.expandBlock;
  }

  getMap() {
    console.log(this.claimViewDto)
    setTimeout(() => {

        this.loadMap();

    }, 1000)
  }

  onControlLoad(event) {
    this.modelMap = event;
  }


  loadMap() {
    console.log(this.claimViewDto)
    if (!this.util.isNullOrEmpty(this.claimViewDto.fullAddress)) {



      let str = this.claimViewDto.fullAddress.nameRu;

      this.modelMap.instance.search(str).then(data => {
        this.ddd.geometry.setCoordinates([data.responseMetaData.SearchResponse.Point.coordinates[1], data.responseMetaData.SearchResponse.Point.coordinates[0]])
        this.claimViewDto.latitude = data.responseMetaData.SearchResponse.Point.coordinates[1];
        this.claimViewDto.longitude = data.responseMetaData.SearchResponse.Point.coordinates[0];
      });
    }
  }


  onLoad(event) {
    this.cord = event.event.get('coords')
    this.ddd.geometry.setCoordinates(this.cord);
    this.claimViewDto.latitude = this.cord[0];
    this.claimViewDto.longitude = this.cord[1];
  }

  onLoad2(event) {
    if (event.type == 'dragend') {
      this.cord = event.instance.geometry.getCoordinates();
      event.instance.geometry.setCoordinates(this.cord);
      this.claimViewDto.latitude = this.cord[0];
      this.claimViewDto.longitude = this.cord[1];
    }
  }

  onLoad3(event) {
    this.cord = event.instance.geometry.getCoordinates();
    event.instance.geometry.setCoordinates(this.cord);
    this.ddd = event.instance;
  }


  getObjectById(data: any, id: any) {
    if (data) {
      for (let o of data) {
        if (o.id == id) {
          let dto = o;
          if (o.multiLang) {
            dto = o.multiLang;
          }
          return dto;
        }
      }
    }
    return null;
  }


  least(e1: number, e2: number) {
    if (e1 < e2) {
      return e1;
    }
    return e2;
  }

  greatest(e1: number, e2: number) {
    if (e1 < e2) {
      return e2;
    }
    return e1;
  }

  round(x: number, n: number): number {
    let m = Math.pow(10, n);
    return Math.round(x * m) / m
  }

  getMonthPay() {
    let objectPrice=null;
    if(this.claimViewDto.objectPrice){
      objectPrice= this.claimViewDto.objectPrice;
    }

    if (objectPrice) {
      let selCreditProgramm: CreditProgramm = this.getObjectById(this.creditProgramm, this.calculatorModel.programmId);
      if (selCreditProgramm) {
        let years = this.util.nvl(this.calculatorModel?.years, 0);
        years = this.least(years, selCreditProgramm.maxCreditPeriod);
        years = this.greatest(years, selCreditProgramm.minCreditPeriod);
        this.calculatorModel.years = years;

        let firstPay = this.util.nvl(this.calculatorModel.firstPay, 0);
        firstPay = this.least(firstPay, selCreditProgramm.maxDownPayment);
        firstPay = this.greatest(firstPay, selCreditProgramm.minDownPayment);
        this.calculatorModel.firstPay = firstPay;


        this.calculatorModel.percent = selCreditProgramm.percent;


        let s = objectPrice - firstPay;
        let monthPercent = this.round(selCreditProgramm.percent / 100 / 12, 4);
        let tmp = this.round(Math.pow(1 + monthPercent, years * 12), 3);
        return this.greatest(this.round(s * monthPercent * tmp / (tmp - 1), 0), 0);
      }
    }
    return 0;
  }

  initCalculator() {
    this.calculatorModel = new CreditCalculatotModel();
    if (this.creditProgramm && this.creditProgramm.length > 0) {
      this.calculatorModel.programmId = this.creditProgramm[0].id;
    }
    this.calculatorModel.firstPay = 2000000;
    this.calculatorModel.years = 10;
  }

  getCreditProgramm() {
    this.creditProgrammService.getAll().subscribe(data => {
      this.creditProgramm = data;
      this.creditProgrammDic = this.util.toSelectArrayCredit(data);
      this.initCalculator()
    }, error1 => {
      this.notifyService.error('Ошибка',error1.me);
    });
  }
}
