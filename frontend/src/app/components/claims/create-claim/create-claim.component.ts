import {ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApplicationDto} from "../../../models/createClaim/applicationDto";
import {Util} from "../../../services/util";
import {NotificationService} from "../../../services/notification.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClaimService} from "../../../services/claim.service";
import {NgSelectConfig} from "@ng-select/ng-select";
import {UploaderService} from "../../../services/uploader.service";
import {DicService} from "../../../services/dic.service";
import {Dic} from "../../../models/dic";
import {TranslateService} from "@ngx-translate/core";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ruLocale} from "ngx-bootstrap/locale";
import {BsLocaleService, BsModalRef, BsModalService} from "ngx-bootstrap";
import {OwnerService} from "../../../services/owner.service";
import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "../../../helpers/canDeactivate/componentCanDeactivate";
import {ConfigService} from "../../../services/config.service";
import {ModalComponent} from "./modal.window/modal.component";
import {RealPropertyRequestDto} from "../../../models/createClaim/realPropertyRequestDto";
import {ClientDto} from "../../../models/createClaim/clientDto";
import {PurchaseInfoDto} from "../../../models/createClaim/purchaseInfoDto";
import {BigDecimalPeriod} from "../../../models/common/bigDecimalPeriod";
import {ActivatedRoute} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {RoleManagerService} from "../../../services/roleManager.service";
import {HttpParams} from "@angular/common/http";
import {UserService} from "../../../services/user.service";

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent implements OnInit, ComponentCanDeactivate {


  application: ApplicationDto;
  selectedFile: File;
  photoList: any[] = [];
  photoPlanList: any[] = [];
  photo3DList: any[] = [];
  operationType: Dic[];
  objectType: Dic[];
  city: Dic[];
  districts: Dic[];
  parkingTypes: Dic[];
  streets: Dic[];
  residentialComplexes: Dic[];
  propertyDevelopers: Dic[];
  heatingSystems: Dic[];
  agentList: Dic[];
  sewerageSystems: Dic[];
  countries: Dic[];
  materials: Dic[];
  sortMaterials: Dic[] = [];
  roomCountDic: Dic[];
  possibleReasonForBidding: Dic[];
  possibleReasonForBiddingSort: Dic[];
  applicationForm: any;
  image: any;
  dicDynamic: Dic[];
  elevatorType: Dic[];
  yardTypes: Dic[];
  readonlyChooseJK: boolean = false;
  saved: boolean = false;
  modalRef: BsModalRef;
  applicationId: number;
  roles: any;

  constructor(private util: Util,
              private notifyService: NotificationService,
              private formBuilder: FormBuilder,
              private claimService: ClaimService,
              private config: NgSelectConfig,
              private uploader: UploaderService,
              private dicService: DicService,
              private translate: TranslateService,
              private localeService: BsLocaleService,
              private ownerService: OwnerService,
              private configService: ConfigService,
              private cdRef: ChangeDetectorRef,
              private modalService: BsModalService,
              private actRoute: ActivatedRoute,
              private ngxLoader: NgxUiLoaderService,
              private roleManagerService: RoleManagerService,
              private userService: UserService) {
    this.config.notFoundText = 'Данные не найдены';
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
    this.applicationId = this.actRoute.snapshot.params.id;
  }

  get f() {
    return this.applicationForm.controls;
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    this.getCheckOperationList();
    this.applicationForm = this.formBuilder.group({
      id: [null, Validators.nullValidator],
      operationTypeId: [null, Validators.required],
      objectTypeId: [null, Validators.required],
      objectPrice: [null, Validators.nullValidator],
      surname: [null, Validators.required],
      firstName: [null, Validators.required],
      patronymic: [null, Validators.nullValidator],
      clientId: [null, Validators.nullValidator],
      phoneNumber: [null, Validators.required],
      email: [null, Validators.nullValidator],
      objectPriceFrom: [null, Validators.nullValidator],
      objectPriceTo: [null, Validators.nullValidator],
      mortgage: [null, Validators.nullValidator],
      encumbrance: [null, Validators.nullValidator],
      exchange: [null, Validators.nullValidator],
      sharedOwnershipProperty: [null, Validators.nullValidator],
      gender: [null, Validators.nullValidator],
      cityId: [null, Validators.required],
      residentialComplexId: [null, Validators.nullValidator],
      streetId: [null, Validators.nullValidator],
      houseNumber: [null, Validators.nullValidator],
      houseNumberFraction: [null, Validators.nullValidator],
      numberOfRooms: [null, Validators.nullValidator],
      totalArea: [null, Validators.nullValidator],
      livingArea: [null, Validators.nullValidator],
      kitchenArea: [null, Validators.nullValidator],
      balconyArea: [null, Validators.nullValidator],
      ceilingHeight: [null, Validators.nullValidator],
      numberOfBedrooms: [null, Validators.nullValidator],
      atelier: [null, Validators.nullValidator],
      separateBathroom: [null, Validators.nullValidator],
      districtId: [null, Validators.nullValidator],
      numberOfFloors: [null, Validators.nullValidator],
      apartmentsOnTheSite: [null, Validators.nullValidator],
      materialOfConstructionId: [null, Validators.nullValidator],
      yearOfConstruction: [null, Validators.nullValidator],
      typeOfElevatorList: [[], Validators.nullValidator],
      concierge: [null, Validators.nullValidator],
      wheelchair: [null, Validators.nullValidator],
      playground: [null, Validators.nullValidator],
      yardTypeId: [null, Validators.nullValidator],
      parkingTypeId: [null, Validators.nullValidator],
      probabilityOfBidding: [null, Validators.nullValidator],
      theSizeOfTrades: [null, Validators.nullValidator],
      possibleReasonForBiddingIdList: [null, Validators.nullValidator],
      note: [null, Validators.nullValidator],
      contractPeriod: [null, Validators.required],
      isCommissionIncludedInThePrice: [null, Validators.nullValidator],
      amount: [null, Validators.required],
      cadastralNumber: [null, Validators.nullValidator],
      cadastralNumber1: [null, Validators.nullValidator],
      cadastralNumber2: [null, Validators.nullValidator],
      cadastralNumber3: [null, Validators.nullValidator],
      propertyDeveloperId: [null, Validators.nullValidator],
      housingClass: [null, Validators.nullValidator],
      housingCondition: [null, Validators.nullValidator],
      numberOfApartments: [null, Validators.nullValidator],
      floor: [null, Validators.nullValidator],
      floorFrom: [null, Validators.nullValidator],
      floorTo: [null, Validators.nullValidator],
      numberOfRoomsFrom: [null, Validators.nullValidator],
      numberOfRoomsTo: [null, Validators.nullValidator],
      totalAreaFrom: [null, Validators.nullValidator],
      totalAreaTo: [null, Validators.nullValidator],
      livingAreaFrom: [null, Validators.nullValidator],
      livingAreaTo: [null, Validators.nullValidator],
      kitchenAreaFrom: [null, Validators.nullValidator],
      kitchenAreaTo: [null, Validators.nullValidator],
      balconyAreaFrom: [null, Validators.nullValidator],
      balconyAreaTo: [null, Validators.nullValidator],
      ceilingHeightFrom: [null, Validators.nullValidator],
      ceilingHeightTo: [null, Validators.nullValidator],
      numberOfBedroomsFrom: [null, Validators.nullValidator],
      numberOfBedroomsTo: [null, Validators.nullValidator],
      landArea: [null, Validators.nullValidator],
      landAreaFrom: [null, Validators.nullValidator],
      landAreaTo: [null, Validators.nullValidator],
      numberOfFloorsFrom: [null, Validators.nullValidator],
      numberOfFloorsTo: [null, Validators.nullValidator],
      heatingSystemId: [null, Validators.nullValidator],
      sewerageId: [null, Validators.nullValidator],
      photoIdList: [[], Validators.nullValidator],
      housingPlanImageIdList: [[], Validators.nullValidator],
      realPropertyRequestDto: [new RealPropertyRequestDto(), Validators.nullValidator],
      ownerDto: [null, Validators.nullValidator],
      purchaseInfoDto: [null, Validators.nullValidator],
      apartmentNumber: [null, Validators.nullValidator],
      agent: [null, Validators.nullValidator],
      contractNumber: [null, Validators.required],
    });
    this.cdRef.detectChanges();
    this.loadDictionary();

    if (this.applicationId != null) {
      this.loadDataById(this.applicationId);
    } else {
      this.ngxLoader.stop();
    }
  }

  hasShowClientGroup(operation: string) {
    if (!this.util.isNullOrEmpty(this.roles)) {
      for (const data of this.roles) {
        if (data.code === 'CLIENT_GROUP') {
          return !data.operations.includes(operation);
        }
      }
    }
  }

  hasShowApplicationGroup(operation: string) {
    if (!this.util.isNullOrEmpty(this.roles)) {
      for (const data of this.roles) {
        if (data.code === 'APPLICATION_GROUP') {
          return !data.operations.includes(operation);
        }
      }
    }
  }

  hasShowRealPropertyGroup(operation: string) {
    if (!this.util.isNullOrEmpty(this.roles)) {
      for (const data of this.roles) {
        if (data.code === 'REAL_PROPERTY_GROUP') {
          return !data.operations.includes(operation);
        }
      }
    }
  }

  getCheckOperationList() {
    this.roleManagerService.getOperations().subscribe(
      data => {
        let params = new HttpParams();
        for (const el of data.data) {
          params = params.append('groupCodes', String(el.code))
        }
        this.roleManagerService.getCheckOperationList(params).subscribe(obj => {
          this.roles = obj.data
        });
      })
  }

  loadDictionary() {
    this.dicService.getDics('OPERATION_TYPES').subscribe(data => {
      this.operationType = this.util.toSelectArray(data);
    });
    this.dicService.getDics('OBJECT_TYPES').subscribe(data => {
      this.objectType = this.util.toSelectArray(data);
    });
    this.dicService.getDics('CITIES').subscribe(data => {
      this.city = this.util.toSelectArray(data);
    });
    this.dicService.getDics('DISTRICTS').subscribe(data => {
      this.districts = this.util.toSelectArray(data);
    });
    this.dicService.getDics('PARKING_TYPES').subscribe(data => {
      this.parkingTypes = this.util.toSelectArrayId(data);
    });
    this.dicService.getDics('STREETS').subscribe(data => {
      this.streets = this.util.toSelectArray(data);
    });
    this.dicService.getResidentialComplexes().subscribe(data => {
      this.residentialComplexes = this.util.toSelectArrayResidenceComplex(data);
    });
    this.dicService.getDics('POSSIBLE_REASONS_FOR_BIDDING').subscribe(data => {
      this.possibleReasonForBidding = this.util.toSelectArrayId(data);
    });
    this.dicService.getDics('COUNTRIES').subscribe(data => {
      this.countries = this.util.toSelectArray(data);
    });
    this.dicService.getDics('MATERIALS_OF_CONSTRUCTION').subscribe(data => {
      this.materials = this.util.toSelectArray(data);
    });
    this.dicService.getDics('YES_NO').subscribe(data => {
      this.dicDynamic = this.util.toSelectArray(data, 'code');
    });
    this.dicService.getDics('TYPE_OF_ELEVATOR').subscribe(data => {
      this.elevatorType = this.util.toSelectArray(data);
    });
    this.dicService.getDics('YARD_TYPES').subscribe(data => {
      this.yardTypes = this.util.toSelectArray(data);
    });
    this.dicService.getDics('PROPERTY_DEVELOPERS').subscribe(data => {
      this.propertyDevelopers = this.util.toSelectArray(data);
    });
    this.dicService.getDics('SEWERAGE_SYSTEMS').subscribe(data => {
      this.sewerageSystems = this.util.toSelectArray(data);
    });
    this.dicService.getDics('HEATING_SYSTEMS').subscribe(data => {
      this.heatingSystems = this.util.toSelectArray(data);
    });
    this.userService.getAgentsToAssign().subscribe(obj => {
      this.agentList = this.util.toSelectArrayRoles(obj.data, 'login');
    });
    this.roomCountDic = this.util.roomCountDictionary();
  }

  loadDataById(id: number) {
    this.ngxLoader.start();
    this.claimService.getClaimById(id).subscribe(data => {
      if (data != null) {
        setTimeout(() => {    //<<<---    using ()=> syntax
          if (this.util.isNullOrEmpty(this.operationType) || this.util.isNullOrEmpty(this.objectType) || this.util.isNullOrEmpty(this.residentialComplexes)) {
            this.loadDataById(this.applicationId);
            return
          } else {
            this.fillApplicationForm(data);
            this.fillApplicationFormPurchaseInfoDto(data.realPropertyRequestDto?.purchaseInfoDto);
            this.fillApplicationFormClientData(data.clientDto);
            this.fillApplicationFormRealPropertyRequestDto(data.realPropertyRequestDto);
            this.cdRef.detectChanges();
            this.ngxLoader.stop();
          }
        }, 3000);
      }
    });
  }

  setPossibleReasonForBidding() {
    this.possibleReasonForBiddingSort = [];
    if (!this.util.isNullOrEmpty(this.possibleReasonForBidding)) {
      for (const pos of this.possibleReasonForBidding) {
        if (pos['operationCode'] == this.applicationForm?.operationTypeId?.code) {
          let m = {};
          m['value'] = pos['value'];
          m['label'] = pos['label'];
          m['code'] = pos['code'];
          this.possibleReasonForBiddingSort.push(m)
        }
      }
    }
  }

  setHouseOrApartmentsForMaterials() {
    this.sortMaterials = [];
    if (this.applicationForm?.objectTypeId?.code == '003001') {//кв
      this.sortMaterials = this.materials;
    } else if (this.applicationForm?.objectTypeId?.code == '003002') {//дом
      for (const matreialElement of this.materials) {
        if (matreialElement['code'] == 'house') {
          let m = {};
          m['value'] = matreialElement['value'];
          m['label'] = matreialElement['label'];
          m['code'] = matreialElement['code'];
          this.sortMaterials.push(m)
        }

      }
    }
  }

  setResidenceComplexType() {
    if (!this.util.isNullOrEmpty(this.applicationForm.residentialComplexId)) {
      this.applicationForm.streetId = this.applicationForm.residentialComplexId?.streetId;//Улица
      this.applicationForm.houseNumber = this.applicationForm.residentialComplexId?.houseNumber;//Номер дома
      this.applicationForm.districtId = this.applicationForm.residentialComplexId?.districtId;//Район
      this.applicationForm.numberOfFloors = this.applicationForm.residentialComplexId?.numberOfFloors;//Этажность дома
      this.applicationForm.apartmentsOnTheSite = this.applicationForm.residentialComplexId?.apartmentsOnTheSite;//Кв. на площадке
      this.applicationForm.materialOfConstructionId = this.applicationForm.residentialComplexId?.materialOfConstructionId;//Материал
      this.applicationForm.yearOfConstruction = this.applicationForm.residentialComplexId?.yearOfConstruction;//Год постройки
      this.applicationForm.typeOfElevatorList = this.applicationForm.residentialComplexId?.typeOfElevatorIdList;//Лифт
      this.applicationForm.concierge = this.applicationForm.residentialComplexId?.concierge;//Консьерж
      this.applicationForm.wheelchair = this.applicationForm.residentialComplexId?.wheelchair;//Колясочная
      this.applicationForm.parkingTypeId = [this.applicationForm.residentialComplexId?.parkingTypeId];///Парковка
      this.applicationForm.yardTypeId = this.applicationForm.residentialComplexId?.yardTypeId;//Двор
      this.applicationForm.playground = this.applicationForm.residentialComplexId?.playground;//Детская площадка
      this.applicationForm.propertyDeveloperId = this.applicationForm.residentialComplexId?.propertyDeveloperId;//Затройщик
      this.applicationForm.housingClass = this.applicationForm.residentialComplexId?.housingClass;//Класс жилья
      this.applicationForm.housingCondition = this.applicationForm.residentialComplexId?.housingCondition;//Состояния
      this.applicationForm.numberOfApartments = this.applicationForm.residentialComplexId?.numberOfApartments;//Кол-во кв
      this.applicationForm.ceilingHeight = this.applicationForm.residentialComplexId?.ceilingHeight;//Кол-во кв
      this.applicationForm.cityId = this.applicationForm.residentialComplexId?.cityId;//Кол-во кв
      this.readonlyChooseJK = true;
    }

  }

  searchByPhone() {
    if (this.applicationForm.phoneNumber != null && this.applicationForm.phoneNumber.length == 10 && this.applicationId == null) {
      this.ownerService.searchByPhone('7' + this.applicationForm.phoneNumber)
        .subscribe(res => {
          if (!this.util.isNullOrEmpty(res)) {
            this.fillApplicationFormClientData(res);
          } else {
            this.applicationForm.clientId = null;
            this.applicationForm.firstName = null;
            this.applicationForm.surname = null;
            this.applicationForm.patronymic = null;
            this.applicationForm.email = null;
            this.applicationForm.gender = null;
          }
        });
    }
  }

  fillApplicationFormClientData(res: any) {
    this.applicationForm.clientId = res.id;
    this.applicationForm.firstName = res.firstName;
    this.applicationForm.surname = res.surname;
    this.applicationForm.patronymic = res.patronymic;
    this.applicationForm.phoneNumber = res.phoneNumber?.length == 11 ? res.phoneNumber.substr(1) : res.phoneNumber;
    this.applicationForm.email = res.email;
    this.applicationForm.gender = res.gender;
  }

  fillApplicationForm(data: any) {

    this.applicationForm.operationTypeId = this.util.getDictionaryValueById(this.operationType, data?.operationTypeId.toString());
    this.applicationForm.objectPrice = data?.objectPrice;
    this.applicationForm.mortgage = this.util.toString(data?.mortgage);
    this.applicationForm.encumbrance = this.util.toString(data?.encumbrance);
    this.applicationForm.sharedOwnershipProperty = this.util.toString(data?.sharedOwnershipProperty);
    this.applicationForm.exchange = this.util.toString(data?.exchange);
    this.applicationForm.probabilityOfBidding = this.util.toString(data?.probabilityOfBidding);
    this.applicationForm.theSizeOfTrades = data?.theSizeOfTrades;
    this.applicationForm.possibleReasonForBiddingIdList = data?.possibleReasonForBiddingIdList;
    this.applicationForm.contractPeriod = new Date(data?.contractPeriod);
    this.applicationForm.amount = data?.amount;
    this.applicationForm.isCommissionIncludedInThePrice = data?.isCommissionIncludedInThePrice;
    this.applicationForm.note = data?.note;
    this.applicationForm.agent = data?.agent;
    this.applicationForm.contractNumber = data?.contractNumber;
  }

  fillApplicationFormPurchaseInfoDto(data: any) {
    if (data == null) return;
    this.applicationForm.objectPriceFrom = data?.objectPricePeriod?.from;
    this.applicationForm.objectPriceTo = data?.objectPricePeriod?.to;
    this.applicationForm.numberOfFloorsFrom = data?.numberOfFloorsPeriod?.from;
    this.applicationForm.numberOfFloorsTo = data?.numberOfFloorsPeriod?.to;
    this.applicationForm.floorFrom = data?.floorPeriod?.from;
    this.applicationForm.floorTo = data?.floorPeriod?.to;
    this.applicationForm.numberOfRoomsFrom = data?.numberOfRoomsPeriod?.from;
    this.applicationForm.numberOfRoomsTo = data?.numberOfRoomsPeriod?.to;
    this.applicationForm.totalAreaFrom = data?.totalAreaPeriod?.from;
    this.applicationForm.totalAreaTo = data?.totalAreaPeriod?.to;
    this.applicationForm.livingAreaFrom = data?.livingAreaPeriod?.from;
    this.applicationForm.livingAreaTo = data?.livingAreaPeriod?.to;
    this.applicationForm.kitchenAreaFrom = data?.kitchenAreaPeriod?.from;
    this.applicationForm.kitchenAreaTo = data?.kitchenAreaPeriod?.to;
    this.applicationForm.balconyAreaFrom = data?.balconyAreaPeriod?.from;
    this.applicationForm.balconyAreaTo = data?.balconyAreaPeriod?.to;
    this.applicationForm.ceilingHeightFrom = data?.ceilingHeightPeriod?.from;
    this.applicationForm.ceilingHeightTo = data?.ceilingHeightPeriod?.to;
    this.applicationForm.numberOfBedroomsFrom = data?.numberOfBedroomsPeriod?.from;
    this.applicationForm.numberOfBedroomsTo = data?.numberOfBedroomsPeriod?.to;
    this.applicationForm.landAreaFrom = data?.landAreaPeriod?.from;
    this.applicationForm.landAreaTo = data?.landAreaPeriod?.to;
  }

  fillApplicationFormRealPropertyRequestDto(data: any) {
    this.applicationForm.objectTypeId = this.util.getDictionaryValueById(this.objectType, data?.objectTypeId.toString());
    this.applicationForm.cityId = data?.cityId;
    if (!this.util.isNullOrEmpty(data?.cadastralNumber)) {
      let splited = data.cadastralNumber.split(':');
      this.applicationForm.cadastralNumber = splited[0];
      this.applicationForm.cadastralNumber1 = splited[1];
      this.applicationForm.cadastralNumber2 = splited[2];
      this.applicationForm.cadastralNumber3 = splited[3];
    }
    if (!this.util.isNullOrEmpty(data?.residentialComplexId)) {
      this.applicationForm.residentialComplexId = this.util.getDictionaryValueById(this.residentialComplexes, data?.residentialComplexId);

    } else {
      this.applicationForm.streetId = data?.streetId;
      this.applicationForm.houseNumber = data?.houseNumber;

    }
    this.applicationForm.apartmentNumber = data?.apartmentNumber;
    this.applicationForm.houseNumberFraction = data?.houseNumberFraction;
    this.applicationForm.floor = data?.floor;
    this.applicationForm.numberOfRooms = data?.numberOfRooms;
    this.applicationForm.totalArea = data?.totalArea;
    this.applicationForm.livingArea = data?.livingArea;
    this.applicationForm.kitchenArea = data?.kitchenArea;
    this.applicationForm.balconyArea = data?.balconyArea;
    this.applicationForm.ceilingHeight = data?.ceilingHeight;
    this.applicationForm.numberOfBedrooms = data?.numberOfBedrooms;
    this.applicationForm.atelier = data?.atelier;
    this.applicationForm.separateBathroom = data?.separateBathroom;
    this.applicationForm.districtId = data?.districtId;
    this.applicationForm.numberOfFloors = data?.numberOfFloors;
    this.applicationForm.apartmentsOnTheSite = data?.apartmentsOnTheSite;
    this.applicationForm.materialOfConstructionId = data?.materialOfConstructionId;
    this.applicationForm.yearOfConstruction = data?.yearOfConstruction;
    this.applicationForm.typeOfElevatorList = data?.typeOfElevatorList;
    this.applicationForm.concierge = this.util.toString(data?.concierge);
    this.applicationForm.wheelchair = this.util.toString(data?.wheelchair);
    this.applicationForm.yardTypeId = data?.yardTypeId;
    this.applicationForm.playground = data?.playground;
    this.applicationForm.parkingTypeId = data?.parkingTypeId;
    this.applicationForm.propertyDeveloperId = data?.propertyDeveloperId;
    this.applicationForm.housingClass = data?.housingClass;
    this.applicationForm.housingCondition = data?.housingCondition;
    this.applicationForm.sewerageId = data?.sewerageId;
    this.applicationForm.heatingSystemId = data?.heatingSystemId;
    this.applicationForm.numberOfApartments = data?.numberOfApartments;
    this.applicationForm.landArea = data?.landArea;
    if (!this.util.isNullOrEmpty(data?.photoIdList)) {
      for (const ph of data.photoIdList) {
        this.fillPicture(ph, 1);
      }
    }
    if (!this.util.isNullOrEmpty(data?.housingPlanImageIdList)) {
      for (const ph of data.housingPlanImageIdList) {
        this.fillPicture(ph, 2);
      }
    }
    if (!this.util.isNullOrEmpty(data?.virtualTourImageIdList)) {
      for (const ph of data.virtualTourImageIdList) {
        this.fillPicture(ph, 3);
      }
    }
  }

  searchByClientId() {
    if (this.applicationForm?.clientId != null) {
      this.ownerService.searchByClientId(this.applicationForm.clientId)
        .subscribe(res => {
          this.fillApplicationFormClientData(res);
        });
    }
  }

  showPhotoFull(url: any) {
    this.modalRef = this.modalService.show(ModalComponent, {
      class: 'modal-xl',
      initialState: {
        title: 'Просмотр',
        data: url,
        centered: true
      }
    });
  }

  validate() {
    if (this.applicationForm?.objectTypeId?.code == '003001') { //кв
      if (this.applicationForm?.operationTypeId?.code == '001002') {//продать
        this.applicationForm.controls['objectPrice'].setValidators([Validators.required]);
        this.applicationForm.controls["objectPrice"].updateValueAndValidity();
        this.applicationForm.controls['numberOfRooms'].setValidators([Validators.required]);
        this.applicationForm.controls["numberOfRooms"].updateValueAndValidity();
        this.applicationForm.controls['totalArea'].setValidators([Validators.required]);
        this.applicationForm.controls["totalArea"].updateValueAndValidity();
        this.applicationForm.controls['livingArea'].setValidators([Validators.required]);
        this.applicationForm.controls["livingArea"].updateValueAndValidity();
        this.applicationForm.controls['numberOfBedrooms'].setValidators([Validators.required]);
        this.applicationForm.controls["numberOfBedrooms"].updateValueAndValidity();
        if (this.util.isNullOrEmpty(this.applicationForm?.residentialComplexId)) {
          this.applicationForm.controls['streetId'].setValidators([Validators.required]);
          this.applicationForm.controls["streetId"].updateValueAndValidity();
          this.applicationForm.controls['houseNumber'].setValidators([Validators.required]);
          this.applicationForm.controls["houseNumber"].updateValueAndValidity();
          this.applicationForm.controls['districtId'].setValidators([Validators.required]);
          this.applicationForm.controls["districtId"].updateValueAndValidity();
        } else {
          this.applicationForm.controls['streetId'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["streetId"].updateValueAndValidity();
          this.applicationForm.controls['houseNumber'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["houseNumber"].updateValueAndValidity();
          this.applicationForm.controls['districtId'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["districtId"].updateValueAndValidity();
        }
      } else if (this.applicationForm?.operationTypeId?.code == '001001') { //купить
        this.applicationForm.controls['districtId'].setValidators([Validators.required]);
        this.applicationForm.controls["districtId"].updateValueAndValidity();
        this.applicationForm.controls['objectPrice'].setValidators([Validators.nullValidator]);
        this.applicationForm.controls["objectPrice"].updateValueAndValidity();
      }
    } else if (this.applicationForm?.objectTypeId?.code == '003002') {//дом
      this.applicationForm.controls['districtId'].setValidators([Validators.required]);
      this.applicationForm.controls["districtId"].updateValueAndValidity();
      if (this.applicationForm?.operationTypeId?.code == '001002') {//продать
        this.applicationForm.controls['streetId'].setValidators([Validators.required]);
        this.applicationForm.controls["streetId"].updateValueAndValidity();
        this.applicationForm.controls['houseNumber'].setValidators([Validators.required]);
        this.applicationForm.controls["houseNumber"].updateValueAndValidity();
        this.applicationForm.controls['landArea'].setValidators([Validators.required]);
        this.applicationForm.controls["landArea"].updateValueAndValidity();
        this.applicationForm.controls['totalArea'].setValidators([Validators.required]);
        this.applicationForm.controls["totalArea"].updateValueAndValidity();
        this.applicationForm.controls['livingArea'].setValidators([Validators.required]);
        this.applicationForm.controls["livingArea"].updateValueAndValidity();
      }
    }
  }

  fillApplication() {
    this.application = new ApplicationDto(this.applicationForm.operationTypeId?.value, this.applicationForm.objectPrice, this.applicationForm.mortgage,
      this.applicationForm.encumbrance, this.applicationForm.sharedOwnershipProperty, this.applicationForm.exchange,
      this.applicationForm.probabilityOfBidding, this.applicationForm.theSizeOfTrades, this.applicationForm.possibleReasonForBiddingIdList,
      this.applicationForm.contractPeriod, this.applicationForm.amount, this.applicationForm.isCommissionIncludedInThePrice, this.applicationForm.note, this.applicationForm.agent, this.applicationForm.contractNumber);
  }

  fillPurchaseInfoDto() {
    this.application.realPropertyRequestDto.purchaseInfoDto = new PurchaseInfoDto(new BigDecimalPeriod(this.applicationForm?.objectPriceFrom, this.applicationForm?.objectPriceTo),
      new BigDecimalPeriod(this.applicationForm?.numberOfFloorsFrom, this.applicationForm?.numberOfFloorsTo),
      new BigDecimalPeriod(this.applicationForm?.floorFrom, this.applicationForm?.floorTo),
      new BigDecimalPeriod(this.applicationForm?.numberOfRoomsFrom, this.applicationForm?.numberOfRoomsTo),
      new BigDecimalPeriod(this.applicationForm?.totalAreaFrom, this.applicationForm?.totalAreaTo),
      new BigDecimalPeriod(this.applicationForm?.livingAreaFrom, this.applicationForm?.livingAreaTo),
      new BigDecimalPeriod(this.applicationForm?.kitchenAreaFrom, this.applicationForm?.kitchenAreaTo),
      new BigDecimalPeriod(this.applicationForm?.balconyAreaFrom, this.applicationForm?.balconyAreaTo),
      new BigDecimalPeriod(this.applicationForm?.ceilingHeightFrom, this.applicationForm?.ceilingHeightTo),
      new BigDecimalPeriod(this.applicationForm?.numberOfBedroomsFrom, this.applicationForm?.numberOfBedroomsTo),
      new BigDecimalPeriod(this.applicationForm?.landAreaFrom, this.applicationForm?.landAreaTo)
    );
  }

  fillRealPropertyRequestDto() {
    this.application.realPropertyRequestDto = new RealPropertyRequestDto();
    this.application.realPropertyRequestDto.objectTypeId = this.applicationForm.objectTypeId?.value;
    this.application.realPropertyRequestDto.cityId = this.applicationForm.cityId;
    this.application.realPropertyRequestDto.cadastralNumber = this.applicationForm.cadastralNumber + ':' +
      this.applicationForm.cadastralNumber1 + ':' + this.applicationForm.cadastralNumber2 + ':' + this.applicationForm.cadastralNumber3;
    this.application.realPropertyRequestDto.residentialComplexId = this.applicationForm.residentialComplexId?.value;
    this.application.realPropertyRequestDto.streetId = this.applicationForm.streetId;
    this.application.realPropertyRequestDto.houseNumber = this.applicationForm.houseNumber;
    this.application.realPropertyRequestDto.houseNumberFraction = this.applicationForm.houseNumberFraction;
    this.application.realPropertyRequestDto.floor = this.applicationForm.floor;
    this.application.realPropertyRequestDto.apartmentNumber = this.applicationForm.apartmentNumber
    this.application.realPropertyRequestDto.numberOfRooms = this.applicationForm.numberOfRooms;
    this.application.realPropertyRequestDto.totalArea = this.applicationForm.totalArea;
    this.application.realPropertyRequestDto.livingArea = this.applicationForm.livingArea;
    this.application.realPropertyRequestDto.kitchenArea = this.applicationForm.kitchenArea;
    this.application.realPropertyRequestDto.balconyArea = this.applicationForm.balconyArea;
    this.application.realPropertyRequestDto.ceilingHeight = this.applicationForm.ceilingHeight;
    this.application.realPropertyRequestDto.numberOfBedrooms = this.applicationForm.numberOfBedrooms;
    this.application.realPropertyRequestDto.atelier = this.applicationForm.atelier;
    this.application.realPropertyRequestDto.separateBathroom = this.applicationForm.separateBathroom;
    this.application.realPropertyRequestDto.districtId = this.applicationForm.districtId;
    this.application.realPropertyRequestDto.numberOfFloors = this.applicationForm.numberOfFloors;
    this.application.realPropertyRequestDto.apartmentsOnTheSite = this.applicationForm.apartmentsOnTheSite;
    this.application.realPropertyRequestDto.materialOfConstructionId = this.applicationForm.materialOfConstructionId;
    this.application.realPropertyRequestDto.yearOfConstruction = this.applicationForm.yearOfConstruction;
    this.application.realPropertyRequestDto.typeOfElevatorList = this.applicationForm.typeOfElevatorList;
    this.application.realPropertyRequestDto.concierge = this.applicationForm.concierge;
    this.application.realPropertyRequestDto.wheelchair = this.applicationForm.wheelchair;
    this.application.realPropertyRequestDto.yardTypeId = this.applicationForm.yardTypeId;
    this.application.realPropertyRequestDto.playground = this.applicationForm.playground;
    this.application.realPropertyRequestDto.parkingTypeId = this.applicationForm.parkingTypeId;
    this.application.realPropertyRequestDto.propertyDeveloperId = this.applicationForm.propertyDeveloperId;
    this.application.realPropertyRequestDto.housingClass = this.applicationForm.housingClass;
    this.application.realPropertyRequestDto.housingCondition = this.applicationForm.housingCondition;
    this.application.realPropertyRequestDto.photoIdList = [];
    for (const ph of this.photoList) {
      this.application.realPropertyRequestDto.photoIdList.push(ph.guid);
    }
    this.application.realPropertyRequestDto.housingPlanImageIdList = [];
    for (const ph of this.photoPlanList) {
      this.application.realPropertyRequestDto.housingPlanImageIdList.push(ph.guid);
    }
    this.application.realPropertyRequestDto.virtualTourImageIdList = [];
    for (const ph of this.photo3DList) {
      this.application.realPropertyRequestDto.virtualTourImageIdList.push(ph.guid);
    }
    this.application.realPropertyRequestDto.sewerageId = this.applicationForm.sewerageId;
    this.application.realPropertyRequestDto.heatingSystemId = this.applicationForm.heatingSystemId;
    this.application.realPropertyRequestDto.numberOfApartments = this.applicationForm.numberOfApartments;
    this.application.realPropertyRequestDto.landArea = this.applicationForm.landArea;
  }

  fillRealPropertyOwnerDto(data: any) {
    this.application.clientDto = new ClientDto(data.clientId, data.firstName, data.surname, data.patronymic, '7' + data.phoneNumber, data.email, data.gender);
  }

  submit() {
    this.ngxLoader.start();
    this.validate();
    if (!this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber) && (this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber1) ||
      this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber2) || this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber3))) {
      this.notifyService.showError("Ошибка", "Длина поле кадастровый номер не верно");
    }
    this.fillApplication();
    this.fillRealPropertyRequestDto();
    this.fillRealPropertyOwnerDto(this.applicationForm);
    if (this.applicationForm?.operationTypeId?.code == '001001') {
      this.fillPurchaseInfoDto();
    }

    console.log(this.application.clientDto)

    let result = false;
    const controls = this.applicationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        this.translate.get('claim.validator.' + name).subscribe((text: string) => {
          this.notifyService.showInfo("Ошибка", "Поле " + text + " не заполнено!!!");
        });
        result = true;
      }
    }

    if (result) return;

    if (!this.util.isNullOrEmpty(this.application.realPropertyRequestDto.parkingTypeId)) {
      if (this.application.realPropertyRequestDto.parkingTypeId.indexOf("1") == 0) {
        this.application.realPropertyRequestDto.parkingTypeId = [];
        this.application.realPropertyRequestDto.parkingTypeId.push("1");
      }
    }

    if (this.applicationId != null) {
      this.claimService.updateClaim(this.applicationId, this.application)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно обновлено');
          }
        }, err => {
          this.notifyService.showWarning('warning', err);
        });
    } else {
      this.claimService.saveClaim(this.application)
        .subscribe(data => {
          if (data != null) {
            this.saved = true;
            this.util.dnHref('claims')
            this.notifyService.showSuccess('success', 'Успешно сохранено');
          }
        }, err => {
          this.notifyService.showWarning('warning', err);
        });
    }
    this.ngxLoader.stop();
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (!this.saved) {
      let result = confirm("Вы хотите покинуть страницу?");
      if (result) {
        if (this.photoList.length > 0) {
          this.removePhoto(this.photoList);
        }
        if (this.photoPlanList.length > 0) {
          this.removePhoto(this.photoPlanList);
        }
        if (this.photo3DList.length > 0) {
          this.removePhoto(this.photo3DList);
        }
      }
      return result;
    } else {
      return true;
    }
  }

  removeByGuid(obj: any, id: number) {
    this.uploader.removePhotoById(obj.guid)
      .subscribe(data => {
      });
    if (id == 1) {
      this.photoList.filter(function(item) {
        return item !== obj
      })
    } else if (id == 2) {
      this.photoPlanList.filter(function(item) {
        return item !== obj
      })
    } else if (id == 3) {
      const index = this.photo3DList.indexOf(obj);
      if (index > -1) {
        this.photo3DList.splice(index, 1);
      }
    }
    console.log(this.photoList)
  }

  removePhoto(data: any) {
    for (const element of data) {
     this.removeByGuid(element, null);
    }
  }

  onFileChanged(event, id: number) {
    this.ngxLoader.start();
    this.selectedFile = event.target.files[0];
    this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data != null) {
          this.fillPicture(data, id);
        }
      });
    this.ngxLoader.stop();
  }

  fillPicture(guid: any, id: number) {

    let uuid = guid.uuid != null ? guid.uuid : guid;
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

  checkMaxLength(object) {
    if (object.value.length > object.maxLength)
      object.value = object.value.slice(0, object.maxLength)
  }

  changeTab(tab: string) {
    if (tab == 'add-event') {
      this.util.dnHref('create-claim/add-event')
    }
  }
}
