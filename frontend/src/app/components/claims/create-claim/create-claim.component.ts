import {ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApplicationDto} from "../../../models/createClaim/applicationDto";
import {Util} from "../../../services/util";
import {NotificationService} from "../../../services/notification.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ClaimService} from "../../../services/claim.service";
import {UploaderService} from "../../../services/uploader.service";
import {Dic} from "../../../models/dic";
import {TranslateService} from "@ngx-translate/core";
import {OwnerService} from "../../../services/owner.service";
import {Observable, Subscription} from "rxjs";
import {ComponentCanDeactivate} from "../../../helpers/canDeactivate/componentCanDeactivate";
import {ConfigService} from "../../../services/config.service";
import {ModalComponent} from "./modal.window/modal.component";
import {RealPropertyDto} from "../../../models/createClaim/realPropertyDto";
import {ClientDto} from "../../../models/createClaim/clientDto";
import {PurchaseInfoDto} from "../../../models/createClaim/purchaseInfoDto";
import {Period} from "../../../models/common/period";
import {ActivatedRoute} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {RoleManagerService} from "../../../services/roleManager.service";
import {HttpParams} from "@angular/common/http";
import {UserService} from "../../../services/user.service";
import {YandexMapComponent} from "./yandex-map/yandex-map.component";
import {KazPostService} from 'src/app/services/kaz.post.service';
import {ApplicationPurchaseDataDto} from "../../../models/createClaim/applicationPurchaseDataDto";
import {ContractDto} from "../../../models/createClaim/contractDto";
import {BuildingDto} from "../../../models/createClaim/buildingDto";
import {GeneralCharacteristicsDto} from "../../../models/createClaim/generalCharacteristicsDto";
import {ApplicationSellDataDto} from "../../../models/createClaim/applicationSellDataDto";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss'],
  providers: [YandexMapComponent]
})
export class CreateClaimComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;

  cord: any;
  ddd: any;
  search: any;
  modelMap: any;
  latitude: number;
  longitude: number;
  application: ApplicationDto;
  selectedFile: File;
  photoList: any[] = [];
  photoPlanList: any[] = [];
  photo3DList: any[] = [];
  operationType: Dic[];
  objectType: Dic[];
  city: Dic[];
  kazPost: any;
  districts: Dic[];
  parkingTypes: Dic[];
  streets: Dic[];
  residentialComplexes: Dic[];
  propertyDevelopers: Dic[];
  heatingSystems: Dic[];
  agentList: Dic[];
  sewerageSystems: Dic[];
  houseCondition: Dic[];
  countries: Dic[];
  materials: Dic[];
  sortMaterials: Dic[] = [];
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
  headerDeal: boolean = false;
  clientDeal: boolean = false;
  aboutObject: boolean = false;
  aboutPhoto: boolean = false;
  aboutMap: boolean = false;
  existsClient: boolean = false;
  edit: boolean = true;
  firstStep: boolean = true;
  public parameters = {
    options: {
      provider: 'yandex#search'
    }
  };
  apiParam: string;
  apiPage: number = 0;

  public placemarkOptions = {
    preset: "twirl#redIcon",
    draggable: true,
    iconImageSize: [32, 32]
  };
  subscriptions: Subscription = new Subscription();
  data: any;
  postCode: string;

  constructor(public util: Util,
              private notifyService: NotificationService,
              private formBuilder: FormBuilder,
              private claimService: ClaimService,
              private uploader: UploaderService,
              private translate: TranslateService,
              private ownerService: OwnerService,
              private configService: ConfigService,
              private cdRef: ChangeDetectorRef,
              private modalService: BsModalService,
              private actRoute: ActivatedRoute,
              private ngxLoader: NgxUiLoaderService,
              private roleManagerService: RoleManagerService,
              private userService: UserService,
              private modal: NgbModal,
              private kazPostService: KazPostService) {
    if (this.util.isNumeric(this.actRoute.snapshot.params.id)) {
      this.edit = false;
      this.saved = true;
      this.applicationId = Number(this.actRoute.snapshot.params.id);
    }
  }

  get f() {
    return this.applicationForm.controls;
  }

  ngOnInit(): void {
    this.cord = [51.12, 71.43]

    this.modelMap = [];
    this.ngxLoader.startBackground();
    this.getCheckOperationList();
    this.applicationForm = this.formBuilder.group({
      id: [null, Validators.nullValidator],
      operationTypeId: [null, Validators.required],
      objectTypeId: [null, Validators.required],
      objectPrice: [0, Validators.nullValidator],
      surname: [null, Validators.nullValidator],
      firstName: [null, Validators.nullValidator],
      patronymic: [null, Validators.nullValidator],
      clientId: [null, Validators.nullValidator],
      phoneNumber: [null, Validators.required],
      email: [null, [Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
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
      parkingTypeIds: [null, Validators.nullValidator],
      probabilityOfBidding: [null, Validators.nullValidator],
      theSizeOfTrades: [null, Validators.nullValidator],
      possibleReasonForBiddingIdList: [null, Validators.nullValidator],
      note: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      cadastralNumber: [null, Validators.nullValidator],
      cadastralNumber1: [null, Validators.nullValidator],
      cadastralNumber2: [null, Validators.nullValidator],
      cadastralNumber3: [null, Validators.nullValidator],
      propertyDeveloperId: [null, Validators.nullValidator],
      housingClass: [null, Validators.nullValidator],
      houseConditionId: [null, Validators.nullValidator],
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
      realPropertyRequestDto: [new RealPropertyDto(), Validators.nullValidator],
      ownerDto: [null, Validators.nullValidator],
      purchaseInfoDto: [null, Validators.nullValidator],
      apartmentNumber: [null, Validators.nullValidator],
      agent: [null, Validators.nullValidator],
      latitude: [null, Validators.nullValidator],
      longitude: [null, Validators.nullValidator],
      postcode: [null, Validators.required],
      yearOfConstructionFrom: [null, Validators.nullValidator],
      yearOfConstructionTo: [null, Validators.nullValidator],
      apartmentsOnTheSiteFrom: [null, Validators.nullValidator],
      apartmentsOnTheSiteTo: [null, Validators.nullValidator],
    });
    this.cdRef.detectChanges();
    this.loadDictionary();

    if (this.applicationId != null) {
      this.loadDataById(this.applicationId);
    } else {
      this.ngxLoader.stopBackground();
    }
    window.scrollTo(0, 0);
  }

  getCheckOperationList() {
    this.subscriptions.add(this.roleManagerService.getOperations().subscribe(
      data => {
        let params = new HttpParams();
        for (const el of data.data) {
          params = params.append('groupCodes', String(el.code))
        }
        this.roleManagerService.getCheckOperationList(params).subscribe(obj => {
          this.roles = obj.data
        });
      }))
  }

  loadDictionary() {
    this.util.getAllDic('OperationType').then(res => {
      this.operationType = res;
    })
    this.util.getAllDic('ObjectType').then(res => {
      this.objectType = res;
    })
    this.util.getAllDic('City').then(res => {
      this.city = res;
    })
    this.util.getAllDic('District').then(res => {
      this.districts = res;
    })
    this.util.getAllDic('ParkingType').then(res => {
      this.parkingTypes = res;
    })
    this.util.getAllDic('Street').then(res => {
      this.streets = res;
    })
    this.util.getAllDic('residentialComplexes').then(res => {
      this.residentialComplexes = res;
    })
    this.util.getAllDic('PossibleReasonForBidding').then(res => {
      this.possibleReasonForBidding = res;
    })
    this.util.getAllDic('Country').then(res => {
      this.countries = res;
    })
    this.util.getAllDic('MaterialOfConstruction').then(res => {
      this.materials = res;
    })
    this.util.getAllDic('YES_NO').then(res => {
      this.dicDynamic = res;
    })
    this.util.getAllDic('TypeOfElevator').then(res => {
      this.elevatorType = res;
    })
    this.util.getAllDic('YardType').then(res => {
      this.yardTypes = res;
    })
    this.util.getAllDic('PropertyDeveloper').then(res => {
      this.propertyDevelopers = res;
    })
    this.util.getAllDic('Sewerage').then(res => {
      this.sewerageSystems = res;
    })
    this.util.getAllDic('HouseCondition').then(res => {
      this.houseCondition = res;
    })
    this.util.getAllDic('HeatingSystem').then(res => {
      this.heatingSystems = res;
    })
    this.subscriptions.add(this.userService.getAgentsToAssign().subscribe(obj => {
      this.agentList = this.util.toSelectArrayRoles(obj.data, 'login');
    }));
  }

  loadDataById(id: number) {
    this.ngxLoader.startBackground();

    this.subscriptions.add(this.claimService.getClaimById(id).subscribe(data => {
      if (data != null) {
        this.fillApplicationForm(data);
        this.fillApplicationFormPurchaseInfoDto(data.realPropertyRequestDto?.purchaseInfoDto);
        this.searchByPhone(data.clientLogin);
        this.fillApplicationFormRealPropertyRequestDto(data.realPropertyRequestDto);
        this.cdRef.detectChanges();
        this.ngxLoader.stopBackground();
      }
    }));
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
    if (this.isApartment()) {//кв
      this.sortMaterials = this.materials;
    } else if (this.isHouse()) {//дом
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
    console.log(this.applicationForm.residentialComplexId)
    this.readonlyChooseJK = !this.util.isNullOrEmpty(this.applicationForm.residentialComplexId);
    this.applicationForm.streetId = this.util.nvl(this.applicationForm.residentialComplexId?.streetId, null);//Улица
    this.applicationForm.houseNumber = this.util.nvl(this.applicationForm.residentialComplexId?.houseNumber, null);//Номер дома
    this.applicationForm.houseNumberFraction = this.util.nvl(this.applicationForm.residentialComplexId?.houseNumberFraction, null);//номер дробь
    this.applicationForm.districtId = this.util.nvl(this.applicationForm.residentialComplexId?.districtId, null);//Район
    this.applicationForm.numberOfFloors = this.util.nvl(this.applicationForm.residentialComplexId?.numberOfFloors, null);//Этажность дома
    this.applicationForm.apartmentsOnTheSite = this.util.nvl(this.applicationForm.residentialComplexId?.apartmentsOnTheSite, null);//Кв. на площадке
    this.applicationForm.materialOfConstructionId = this.util.nvl(this.applicationForm.residentialComplexId?.materialOfConstructionId, null);//Материал
    this.applicationForm.yearOfConstruction = this.util.nvl(this.applicationForm.residentialComplexId?.yearOfConstruction, null);//Год постройки
    this.applicationForm.typeOfElevatorList = this.util.nvl(this.applicationForm.residentialComplexId?.typeOfElevator, null);//Лифт
    this.applicationForm.concierge = this.util.nvl(this.util.toString(this.applicationForm.residentialComplexId?.concierge), null);//Консьерж
    this.applicationForm.wheelchair = this.util.nvl(this.util.toString(this.applicationForm.residentialComplexId?.wheelchair), null);//Колясочная
    this.applicationForm.parkingTypeIds = this.util.nvl(this.applicationForm.residentialComplexId?.parkingTypeIds, null);///Парковка
    this.applicationForm.yardTypeId = this.util.nvl(this.applicationForm.residentialComplexId?.yardType, null);//Двор
    this.applicationForm.playground = this.util.nvl(this.util.toString(this.applicationForm.residentialComplexId?.playground), null);//Детская площадка
    this.applicationForm.propertyDeveloperId = this.util.nvl(this.applicationForm.residentialComplexId?.propertyDeveloperId, null);//Затройщик
    this.applicationForm.housingClass = this.util.nvl(this.applicationForm.residentialComplexId?.housingClass, null);//Класс жилья
    this.applicationForm.houseConditionId = this.util.nvl(this.applicationForm.residentialComplexId?.houseConditionId, null);//Состояния
    this.applicationForm.numberOfApartments = this.util.nvl(this.applicationForm.residentialComplexId?.numberOfApartments, null);//Кол-во кв
    this.applicationForm.ceilingHeight = this.util.nvl(this.applicationForm.residentialComplexId?.ceilingHeight, null);//Кол-во кв
    this.applicationForm.cityId = this.util.nvl(this.applicationForm.residentialComplexId?.cityId, null);//город
    this.cdRef.detectChanges();
  }

  searchByPhone(phoneNumber) {
    if (phoneNumber != null && phoneNumber.length == 10 && this.applicationId == null) {
      this.subscriptions.add(this.ownerService.searchByPhone(this.applicationForm.phoneNumber)
        .subscribe(res => {
          this.fillApplicationFormClientData(res);
          this.existsClient = true;
        }));
    }
  }

  fillApplicationFormClientData(res: any) {
    this.applicationForm.clientId = res?.id;
    this.applicationForm.firstName = res?.firstName;
    this.applicationForm.surname = res?.surname;
    this.applicationForm.patronymic = res?.patronymic;
    this.applicationForm.phoneNumber = res.phoneNumber;
    this.applicationForm.email = res?.email;
    this.applicationForm.gender = res?.gender;
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
    this.setPossibleReasonForBidding();
    setTimeout(() => {
      this.applicationForm.possibleReasonForBiddingIdList = this.util.nvl(data?.possibleReasonForBiddingIdList, null);
    }, 1000);
    this.applicationForm.note = data?.note;
    this.applicationForm.agent = data?.agent;
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

  fillCadastralNumber(data: string) {
    let splited = data.split(':');
    this.applicationForm.cadastralNumber = splited[0];
    this.applicationForm.cadastralNumber1 = splited[1];
    this.applicationForm.cadastralNumber2 = splited[2];
    this.applicationForm.cadastralNumber3 = splited[3];
  }

  fillApplicationFormRealPropertyRequestDto(data: any) {
    this.applicationForm.objectTypeId = this.util.getDictionaryValueById(this.objectType, data?.objectTypeId.toString());
    this.applicationForm.cityId = data?.cityId;
    if (!this.util.isNullOrEmpty(data?.cadastralNumber)) {
      this.fillCadastralNumber(data?.cadastralNumber);
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
    this.applicationForm.parkingTypeIds = data?.parkingTypeIds;
    this.applicationForm.propertyDeveloperId = data?.propertyDeveloperId;
    this.applicationForm.housingClass = data?.housingClass;
    this.applicationForm.houseConditionId = data?.houseConditionId;
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

  /**
   * Продать
   */
  isBuy() {
    return this.applicationForm?.operationTypeId?.code == '001002';
  }

  /**
   * КУпить;
   */
  isSell() {
    return this.applicationForm?.operationTypeId?.code == '001001';
  }

  /**
   * квартира
   */
  isApartment() {
    return this.applicationForm?.objectTypeId?.code == '003001';
  }

  /**
   * дом
   */
  isHouse() {
    return this.applicationForm?.objectTypeId?.code == '003002';
  }

  validate() {
    if (this.isApartment()) { //кв
      if (this.isBuy()) {//продать
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
          this.applicationForm.controls['apartmentNumber'].setValidators([Validators.required]);
          this.applicationForm.controls["apartmentNumber"].updateValueAndValidity();
          this.applicationForm.controls['districtId'].setValidators([Validators.required]);
          this.applicationForm.controls["districtId"].updateValueAndValidity();
          this.applicationForm.controls['cityId'].setValidators([Validators.required]);
          this.applicationForm.controls["cityId"].updateValueAndValidity();
          this.applicationForm.controls['yearOfConstruction'].setValidators([Validators.required]);
          this.applicationForm.controls["yearOfConstruction"].updateValueAndValidity();
        } else {
          this.applicationForm.controls['streetId'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["streetId"].updateValueAndValidity();
          this.applicationForm.controls['apartmentNumber'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["apartmentNumber"].updateValueAndValidity();
          this.applicationForm.controls['districtId'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["districtId"].updateValueAndValidity();
          this.applicationForm.controls['cityId'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["cityId"].updateValueAndValidity();
          this.applicationForm.controls['yearOfConstruction'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["yearOfConstruction"].updateValueAndValidity();
        }
      } else if (this.isSell()) { //купить
        this.applicationForm.controls['districtId'].setValidators([Validators.required]);
        this.applicationForm.controls["districtId"].updateValueAndValidity();
        this.applicationForm.controls['objectPrice'].setValidators([Validators.nullValidator]);
        this.applicationForm.controls["objectPrice"].updateValueAndValidity();
      }
    } else if (this.isHouse()) {//дом
      this.applicationForm.controls['districtId'].setValidators([Validators.required]);
      this.applicationForm.controls["districtId"].updateValueAndValidity();
      if (this.isBuy()) {//продать
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
    if (!this.util.isNullOrEmpty(this.applicationForm.phoneNumber)) {
      this.applicationForm.controls['firstName'].setValidators([Validators.required]);
      this.applicationForm.controls["firstName"].updateValueAndValidity();
      this.applicationForm.controls['surname'].setValidators([Validators.required]);
      this.applicationForm.controls["surname"].updateValueAndValidity();
      this.applicationForm.controls['phoneNumber'].setValidators([Validators.required]);
      this.applicationForm.controls["phoneNumber"].updateValueAndValidity();
    } else {
      this.applicationForm.controls['firstName'].setValidators([Validators.nullValidator]);
      this.applicationForm.controls["firstName"].updateValueAndValidity();
      this.applicationForm.controls['surname'].setValidators([Validators.nullValidator]);
      this.applicationForm.controls["surname"].updateValueAndValidity();
      this.applicationForm.controls['phoneNumber'].setValidators([Validators.nullValidator]);
      this.applicationForm.controls["phoneNumber"].updateValueAndValidity();
    }
  }

  fillApplicationPurchaseDataDto() {
    return this.application.applicationPurchaseDataDto = new ApplicationPurchaseDataDto(
      null,
      this.applicationForm.cityId,
      this.applicationForm.districtId,
      this.applicationForm.mortgage,
      this.applicationForm.note,
      this.applicationForm.probabilityOfBidding,
      this.applicationForm.theSizeOfTrades,
      new Period(this.applicationForm?.objectPriceFrom, this.applicationForm?.objectPriceTo),
      this.applicationForm.possibleReasonForBiddingIdList
    )
  }

  fillPurchaseInfoDto() {
    return this.application.purchaseInfoDto = new PurchaseInfoDto(
      new Period(this.applicationForm.apartmentsOnTheSiteFrom, this.applicationForm.apartmentsOnTheSiteTo),
      new Period(this.applicationForm?.balconyAreaFrom, this.applicationForm?.balconyAreaTo),
      new Period(this.applicationForm?.ceilingHeightFrom, this.applicationForm?.ceilingHeightTo),
      this.applicationForm.concierge,
      new Period(this.applicationForm?.floorFrom, this.applicationForm?.floorTo),
      null,
      new Period(this.applicationForm?.kitchenAreaFrom, this.applicationForm?.kitchenAreaTo),
      new Period(this.applicationForm?.landAreaFrom, this.applicationForm?.landAreaTo),
      new Period(this.applicationForm?.livingAreaFrom, this.applicationForm?.livingAreaTo),
      this.applicationForm?.materialOfConstructionId,
      new Period(this.applicationForm?.numberOfBedroomsFrom, this.applicationForm?.numberOfBedroomsTo),
      new Period(this.applicationForm?.numberOfFloorsFrom, this.applicationForm?.numberOfFloorsTo),
      new Period(this.applicationForm?.numberOfRoomsFrom, this.applicationForm?.numberOfRoomsTo),
      this.applicationForm.parkingTypeIds,
      this.applicationForm.playground,
      new Period(this.applicationForm?.totalAreaFrom, this.applicationForm?.totalAreaTo),
      this.applicationForm.typeOfElevatorList,
      this.applicationForm.wheelchair,
      this.applicationForm.yardTypeId,
      new Period(this.applicationForm.yearOfConstructionFrom, this.applicationForm.yearOfConstructionTo)
    )
  }

  fillBuildingDto() {
    return this.application.realPropertyDto.buildingDto = new BuildingDto(
      this.applicationForm.cityId,
      this.applicationForm.districtId,
      this.applicationForm.houseNumber,
      this.applicationForm.houseNumberFraction,
      this.latitude,
      this.longitude,
      this.postCode,
      this.applicationForm.streetId
    )
  }

  fillGeneralCharacteristicsDto() {
    return this.application.realPropertyDto.generalCharacteristicsDto = new GeneralCharacteristicsDto(
      this.applicationForm.apartmentsOnTheSite,
      this.applicationForm.ceilingHeight,
      this.applicationForm.concierge,
      this.applicationForm.houseConditionId,
      this.applicationForm.housingClass,
      null,
      this.applicationForm.materialOfConstructionId,
      this.applicationForm.numberOfApartments,
      this.applicationForm.numberOfFloors,
      this.applicationForm.parkingTypeIds,
      this.applicationForm.playground,
      this.applicationForm.propertyDeveloperId,
      this.applicationForm.typeOfElevatorList
    )
  }

  fillRealPropertyDto() {
    return this.application.realPropertyDto = new RealPropertyDto(
      this.applicationForm.apartmentNumber,
      this.applicationForm.atelier,
      this.applicationForm.balconyArea,
      this.fillBuildingDto(),
      this.applicationForm.cadastralNumber + ':' + this.applicationForm.cadastralNumber1 + ':' + this.applicationForm.cadastralNumber2 + ':' + this.applicationForm.cadastralNumber3,
      this.applicationForm.floor,
      this.fillGeneralCharacteristicsDto(),
      this.applicationForm.heatingSystemId,
      null,
      this.applicationForm.kitchenArea,
      this.applicationForm.landArea,
      this.applicationForm.livingArea,
      null,//todo метадата
      null,//todo статус метадаты
      this.applicationForm.numberOfBedrooms,
      this.applicationForm.numberOfRooms,
      this.applicationForm.separateBathroom,
      this.applicationForm.sewerageId,
      this.applicationForm.totalArea
    )
  }

  fillSellDataDto() {
    return this.application.sellDataDto = new ApplicationSellDataDto(
      this.applicationForm.description, // описание
      this.applicationForm.encumbrance,
      this.applicationForm.exchange,
      this.photoPlanList,
      null,
      this.applicationForm.mortgage,
      this.applicationForm.note,
      this.applicationForm.objectPrice,
      this.photoList,
      this.applicationForm.possibleReasonForBiddingIdList,
      this.applicationForm.probabilityOfBidding,
      this.applicationForm.sharedOwnershipProperty,
      this.applicationForm.theSizeOfTrades,
      this.photo3DList
    )
  }

  fillApplication() {
    this.application = new ApplicationDto(
      null,
      this.applicationForm.operationTypeId?.value,
      this.applicationForm.phoneNumber,
      this.applicationForm.agentLogin,
      new ContractDto(),
      this.fillApplicationPurchaseDataDto(),
      this.applicationForm.objectTypeId?.value,
      this.fillPurchaseInfoDto(),
      this.fillRealPropertyDto(),
      this.fillSellDataDto()
    );
  }

  createClientIfNotPresent(clientLogin: string) {
    if (!this.existsClient) {
      this.createClient()
    }
    this.application.clientLogin = clientLogin;
  }

  createClient() {
    let dto = new ClientDto();
    dto.firstName = this.applicationForm.firstName;
    dto.surname = this.applicationForm.surname;
    dto.patronymic = this.applicationForm.patronymic;
    dto.email = this.applicationForm.email;
    dto.gender = this.applicationForm.gender;
    this.subscriptions.add(this.userService.createUserClient(dto).subscribe());
  }

  submit() {
    this.ngxLoader.startBackground();
    this.validate();
    this.application = new ApplicationDto();
    this.application.realPropertyDto = new RealPropertyDto();
    if (!this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber) && (this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber1) ||
      this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber2) || this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber3))) {
      this.notifyService.showError("Ошибка", "Длина поле кадастровый номер не верно");
      this.ngxLoader.stopBackground();
    }

    if (!this.util.isNullOrEmpty(this.applicationForm.parkingTypeIds)) {
      if (this.applicationForm.parkingTypeIds.indexOf("1") == 0) {
        this.applicationForm.parkingTypeIds = [];
        this.applicationForm.parkingTypeIds.push("1");
      }
    }

    this.fillApplication();
    this.createClientIfNotPresent(this.applicationForm.phoneNumber);
    console.log(this.application)
    let result = false;
    const controls = this.applicationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        this.subscriptions.add(this.translate.get('claim.validator.' + name).subscribe((text: string) => {
          this.notifyService.showInfo("Ошибка", "Поле " + text + " не заполнено!!!");
        }));
        result = true;
      }
    }

    if (result) {
      this.ngxLoader.stopBackground();
      return;
    }

    if (this.applicationId != null) {
      this.subscriptions.add(this.claimService.updateClaim(this.applicationId, this.application)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно обновлено');
          }
        }, err => {
          this.ngxLoader.stopBackground();
          this.notifyService.showWarning('warning', err);
        }));
    } else {
      this.subscriptions.add(this.claimService.saveClaim(this.application)
        .subscribe(data => {
          if (data != null) {
            this.saved = true;
            this.util.dnHref('claims')
            this.notifyService.showSuccess('success', 'Успешно сохранено');
          }
        }, err => {
          this.ngxLoader.stopBackground();
          this.notifyService.showWarning('warning', err);
        }));
    }
    this.ngxLoader.stopBackground();
  }

  cancel() {
    if (this.edit) {
      this.saved = false;
      this.canDeactivate();
    }
    this.util.dnHref('home')
  }

  showHideHeader(id: number) {
    if (id == 1) {
      this.headerDeal = false;
    }
    if (id == 2) {
      this.headerDeal = true;
    }
    if (id == 3) {
      this.clientDeal = false;
    }
    if (id == 4) {
      this.clientDeal = true;
    }
    if (id == 5) {
      this.aboutObject = false;
    }
    if (id == 6) {
      this.aboutObject = true;
    }
    if (id == 7) {
      this.aboutPhoto = false;
    }
    if (id == 8) {
      this.aboutPhoto = true;

    }
    if (id == 9) {
      this.aboutMap = false;
    }
    if (id == 10) {
      this.aboutMap = true;
    }
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
    this.subscriptions.add(this.uploader.removePhotoById(obj.guid).subscribe());
    if (id == 1) {
      this.photoList.splice(this.photoList.indexOf(obj), 1);
    } else if (id == 2) {
      this.photoPlanList.splice(this.photoPlanList.indexOf(obj), 1);
    } else if (id == 3) {
      this.photo3DList.splice(this.photo3DList.indexOf(obj), 1);
    }
  }

  removePhoto(data: any) {
    for (const element of data) {
      this.removeByGuid(element, null);
    }
  }

  onFileChanged(event, id: number) {
    this.selectedFile = event.target.files[0];
    this.subscriptions.add(this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data != null) {
          this.fillPicture(data, id);
        }
      }));
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

  hasRGRole() {
    return this.util.hasRGRole();
  }

  getMap() {
    setTimeout(() => {
      if (!this.util.isNullOrEmpty(this.modelMap)) {
        this.loadMap();
      }
    }, 1000)
  }

  loadMap() {
    if (!this.util.isNullOrEmpty(this.applicationForm.streetId)) {
      let str = this.util.getDictionaryValueById(this.streets, this.applicationForm.streetId).label + ' ' + this.applicationForm.houseNumber;
      if (!this.util.isNullOrEmpty(this.applicationForm.houseNumberFraction)) {
        str = str + '/' + this.applicationForm.houseNumberFraction;
      }
      this.modelMap.instance.search(str).then(data => {
        this.ddd.geometry.setCoordinates([data.responseMetaData.SearchResponse.Point.coordinates[1], data.responseMetaData.SearchResponse.Point.coordinates[0]])
        this.applicationForm.latitude = data.responseMetaData.SearchResponse.Point.coordinates[1];
        this.applicationForm.longitude = data.responseMetaData.SearchResponse.Point.coordinates[0];
      });
    }
  }

  onLoad(event) {
    if (!this.isBuy()) {
      return;
    }
    this.cord = event.event.get('coords')
    this.ddd.geometry.setCoordinates(this.cord);
    this.applicationForm.latitude = this.cord[0];
    this.applicationForm.longitude = this.cord[1];
  }

  onLoad2(event) {
    if (!this.isBuy()) {
      return;
    }
    if (event.type == 'dragend') {
      this.cord = event.instance.geometry.getCoordinates();
      event.instance.geometry.setCoordinates(this.cord);
      this.applicationForm.latitude = this.cord[0];
      this.applicationForm.longitude = this.cord[1];
    }
  }

  onLoad3(event) {
    if (!this.isBuy()) {
      return;
    }
    this.cord = event.instance.geometry.getCoordinates();
    event.instance.geometry.setCoordinates(this.cord);
    this.ddd = event.instance;
  }

  onControlLoad(event) {
    if (!this.isBuy()) {
      return;
    }
    this.modelMap = event;
  }

  onEdit() {
    this.edit = true;
    this.saved = false;
    this.cdRef.detectChanges();
  }

  onScrollEnd() {
    this.apiPage = this.apiPage + 40;
    this.searchDataPost(this.apiParam, this.apiPage);
  }

  getDataKzPost(event) {
    if (!this.util.isNullOrEmpty(event?.term)) {
      if (this.util.length(event.term) > 3) {
        this.apiParam = event.term;
        this.searchDataPost(this.apiParam, this.apiPage);

      }
    }
  }

  searchDataPost(val: string, page: number) {
    this.subscriptions.add(this.kazPostService.getDataPost(val, page).subscribe(res => {
      this.kazPost = this.util.toSelectArrayPost(res.data)
      this.kazPost = [...this.kazPost, this.util.toSelectArrayPost(res.data)];
    }))
  }

  onSuccess() {
    this.fillRealPropertyFromKazPostId(this.data.realPropertyDto);
  }

  fillRealPropertyFromKazPostId(data) {
    this.applicationForm.apartmentNumber = data?.apartmentNumber;
    this.applicationForm.atelier = data?.atelier;
    this.applicationForm.balconyArea = data?.balconyArea;
    this.fillCadastralNumber(data?.cadastralNumber);
    this.applicationForm.floor = data?.floor;
    this.applicationForm.floor = data?.floor;
    this.applicationForm.heatingSystemId = data?.heatingSystemId;
    this.applicationForm.kitchenArea = data?.kitchenArea;
    this.applicationForm.landArea = data?.landArea;
    this.applicationForm.livingArea = data?.livingArea;
    this.applicationForm.numberOfBedrooms = data?.numberOfBedrooms;
    this.applicationForm.numberOfRooms = data?.numberOfRooms;
    this.applicationForm.separateBathroom = data?.separateBathroom;
    this.applicationForm.sewerageId = data?.sewerageId;
    this.applicationForm.totalArea = data?.totalArea;
    let buildingDto = data?.buildingDto;
    if (!this.util.isNullOrEmpty(buildingDto)) {
      this.applicationForm.cityId = buildingDto.cityId;
      this.applicationForm.districtId = buildingDto.districtId;
      this.applicationForm.houseNumber = buildingDto.houseNumber;
      this.applicationForm.houseNumberFraction = buildingDto.houseNumberFraction;
      this.applicationForm.latitude = buildingDto.latitude;
      this.applicationForm.longitude = buildingDto.longitude;
      this.applicationForm.postcode = buildingDto.postcode;
      this.applicationForm.streetId = buildingDto.streetId;
    }
    let generalCharacteristicsDto = data?.generalCharacteristicsDto;
    if (!this.util.isNullOrEmpty(generalCharacteristicsDto)) {
      this.applicationForm.apartmentsOnTheSite = generalCharacteristicsDto.apartmentsOnTheSite;
      this.applicationForm.ceilingHeight = generalCharacteristicsDto.ceilingHeight;
      this.applicationForm.concierge = generalCharacteristicsDto.concierge;
      this.applicationForm.houseConditionId = generalCharacteristicsDto.houseConditionId;
      this.applicationForm.housingClass = generalCharacteristicsDto.housingClass;
      this.applicationForm.materialOfConstructionId = generalCharacteristicsDto.materialOfConstructionId;
      this.applicationForm.numberOfApartments = generalCharacteristicsDto.numberOfApartments;
      this.applicationForm.numberOfFloors = generalCharacteristicsDto.numberOfFloors;
      this.applicationForm.parkingTypeIds = generalCharacteristicsDto.parkingTypeIds;
      this.applicationForm.playground = generalCharacteristicsDto.playground;
      this.applicationForm.propertyDeveloperId = generalCharacteristicsDto.propertyDeveloperId;
      this.applicationForm.typeOfElevatorList = generalCharacteristicsDto.typeOfElevatorList;
      this.applicationForm.wheelchair = generalCharacteristicsDto.wheelchair;
      this.applicationForm.yardTypeId = generalCharacteristicsDto.yardTypeId;
      this.applicationForm.yearOfConstruction = generalCharacteristicsDto.yearOfConstruction;
    }

  }

  checkPostData() {
    if (!this.util.isNullOrEmpty(this.applicationForm.postcode?.fullAddress)) {
      this.subscriptions.add(this.kazPostService.checkPostData(this.applicationForm.postcode?.fullAddress).subscribe(res => {
        this.postCode = this.applicationForm.postcode?.value;
        this.util.getDicById('Street', res.streetList)
        this.util.getDicById('District', res.districtList)
        this.util.getDicById('City', res.cityList)
      }));
    }
  }

  showModalChooseClaim() {
    if (!this.isBuy()) {
      return;
    }
    let objNumber = this.util.nvl(this.applicationForm.houseNumber, this.applicationForm.apartmentNumber);
    // let postcode = this.util.nvl('01100100', this.applicationForm.postcode.value);
    let postcode = '01100100';
    if (!this.util.isNullOrEmpty(objNumber) && !this.util.isNullOrEmpty(postcode)) {
      this.subscriptions.add(
        this.claimService.getApartmentByNumberAndPostcode(objNumber, postcode).subscribe(res => {
          if (!this.util.isNullOrEmpty(res)) {
            this.data = res;
            this.modal.open(this.modalContent, {size: 'lg'});
          }
        })
      );
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
