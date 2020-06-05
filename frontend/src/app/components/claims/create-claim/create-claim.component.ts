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
import {NewDicService} from "../../../services/new.dic.service";
import {DicService} from "../../../services/dic.service";
import {Subject} from "rxjs/internal/Subject";

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
  kazPost2: any;
  districts: Dic[];
  parkingTypes: Dic[];
  streets: Dic[];
  residentialComplexes: Dic[];
  propertyDevelopers: Dic[];
  heatingSystems: Dic[];
  applicationFlag: Dic[];
  applicationFlagSort: Dic[];
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
  filesEdited: boolean = false;
  postcode: any;
  postcode2: any;
  dicName:string;

  public parameters = {
    options: {
      provider: 'yandex#search'
    }
  };
  apiParam: string;
  apiPage: number = 0;
  modalRef2: BsModalRef;
  resident: boolean;
  timer: any;

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
              private dicService: DicService,
              private modal: NgbModal,
              private newDicService: NewDicService,
              private kazPostService: KazPostService) {
    if (this.util.isNumeric(this.actRoute.snapshot.params.id)) {
      this.edit = false;
      this.saved = true;
      this.applicationId = Number(this.actRoute.snapshot.params.id);
    }
  }


  formRes = {
    apartmentsOnTheSite: '',
    buildingDto: {
      cityId: null,
      districtId: null,
      houseNumber: null,
      houseNumberFraction: '',
      latitude: null,
      longitude: null,
      postcode: '',
      streetId: null,
    },
    ceilingHeight: null,
    concierge: false,
    houseName: '',
    housingClass: '',
    housingConditionId: null,
    materialOfConstructionId: null,
    numberOfApartments: 0,
    numberOfEntrances: 0,
    numberOfFloors: 0,
    playground: false,
    propertyDeveloperId: null,
    typeOfElevatorIdList: [],
    parkingTypeIds: [],
    wheelchair: false,
    yardTypeId: null,
    countryId: null,
    yearOfConstruction: 0
  };

  formData = {
    code: '',
    multiLang: {
      nameEn: '',
      nameRu: '',
      nameKz: '',
    },
    parentId: null,

  };

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
      cityId: [null, Validators.nullValidator],
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
      postcode: [null, Validators.nullValidator],
      yearOfConstructionFrom: [null, Validators.nullValidator],
      yearOfConstructionTo: [null, Validators.nullValidator],
      apartmentsOnTheSiteFrom: [null, Validators.nullValidator],
      apartmentsOnTheSiteTo: [null, Validators.nullValidator],
      postValue: [null, Validators.nullValidator],
      applicationFlagIdList: [null, Validators.nullValidator],
      unification: ['address', this.applicationId ? Validators.nullValidator : Validators.required],
    });
    this.cdRef.detectChanges();
    this.loadResidentialComplexes();
    this.loadDictionary();

    if (this.applicationId != null) {
      setTimeout(() => {
        this.loadDataById(this.applicationId);
      }, 1000);
    } else {
      this.ngxLoader.stopBackground();
    }
    window.scrollTo(0, 0);
    this.applicationForm.unification = 'address';
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

  loadResidentialComplexes() {
    this.subscriptions.add(this.newDicService.getResidentialComplexes().subscribe(data => {
      this.residentialComplexes = this.util.toSelectArrayResidenceComplex(data);
    }));
  }

  loadDictionary() {
    this.subscriptions.add(this.newDicService.getDictionary('OperationType').subscribe(data => {
      this.operationType = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('ObjectType').subscribe(data => {
      this.objectType = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('City').subscribe(data => {
      this.city = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('District').subscribe(data => {
      this.districts = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('Street').subscribe(data => {
      this.streets = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('ParkingType').subscribe(data => {
      this.parkingTypes = this.util.toSelectArray(data);
    }));

    this.subscriptions.add(this.newDicService.getDictionary('PossibleReasonForBidding').subscribe(data => {
      this.possibleReasonForBidding = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('Country').subscribe(data => {
      this.countries = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('MaterialOfConstruction').subscribe(data => {
      this.materials = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.dicService.getDics('YES_NO').subscribe(data => {
      this.dicDynamic = this.util.toSelectArrayOldDic(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('TypeOfElevator').subscribe(data => {
      this.elevatorType = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('YardType').subscribe(data => {
      this.yardTypes = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('PropertyDeveloper').subscribe(data => {
      this.propertyDevelopers = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('Sewerage').subscribe(data => {
      this.sewerageSystems = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('HouseCondition').subscribe(data => {
      this.houseCondition = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('HeatingSystem').subscribe(data => {
      this.heatingSystems = this.util.toSelectArray(data);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('ApplicationFlag').subscribe(data => {
      this.applicationFlag = this.util.toSelectArray(data);
    }));

    this.subscriptions.add(this.userService.getAgentsToAssign().subscribe(obj => {
      this.agentList = this.util.toSelectArrayRoles(obj.data, 'login');
    }));
  }

  clearForm() {
    this.formData = {
      code: '',
      multiLang: {
        nameEn: '',
        nameRu: '',
        nameKz: '',
      },
      parentId: null,
    };
    this.formRes = {
      apartmentsOnTheSite: '',
      buildingDto: {
        cityId: null,
        districtId: null,
        houseNumber: null,
        houseNumberFraction: '',
        latitude: null,
        longitude: null,
        postcode: '',
        streetId: null,
      },
      ceilingHeight: null,
      concierge: false,
      houseName: '',
      housingClass: '',
      housingConditionId: null,
      materialOfConstructionId: null,
      numberOfApartments: 0,
      numberOfEntrances: 0,
      numberOfFloors: 0,
      playground: false,
      propertyDeveloperId: null,
      typeOfElevatorIdList: [],
      parkingTypeIds: [],
      wheelchair: false,
      yardTypeId: null,
      countryId: null,
      yearOfConstruction: 0
    };
    }

  loadDataById(id: number) {
    this.ngxLoader.startBackground();

    this.subscriptions.add(this.claimService.getClaimById(id).subscribe(data => {
      if (data != null) {
        this.searchByPhone(data.clientLogin);
        this.fillApplicationForm(data);
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

  setApplicationFlagSort() {
    this.applicationFlagSort = [];
    if (!this.util.isNullOrEmpty(this.applicationFlag)) {
      for (const pos of this.applicationFlag) {
        if (pos['operationCode'] == this.applicationForm?.operationTypeId?.code) {
          let m = {};
          m['value'] = pos['value'];
          m['label'] = pos['label'];
          m['code'] = pos['code'];
          this.applicationFlagSort.push(m)
        }
      }
    }
  }

  setHouseOrApartmentsForMaterials() {
    this.sortMaterials = [];
    if (this.isApartment()) {//кв
      this.sortMaterials = this.materials;
    } else if (this.isHouse()) {//дом
      for (const materials of this.materials) {
        if (materials['code'] == 'house') {
          let m = {};
          m['value'] = materials['value'];
          m['label'] = materials['label'];
          m['code'] = materials['code'];
          this.sortMaterials.push(m)
        }
      }
    }
  }

  setResidenceComplexType() {
    if (this.applicationId && !this.edit) return;
    this.readonlyChooseJK = !this.util.isNullOrEmpty(this.applicationForm.residentialComplexId);
    if (this.util.isNullOrEmpty(this.applicationForm.residentialComplexId)) {
      return;
    }
    this.applicationForm.houseNumber = this.util.nvl(this.applicationForm.residentialComplexId?.buildingDto?.houseNumber, null);//Номер дома
    this.applicationForm.houseNumberFraction = this.util.nvl(this.applicationForm.residentialComplexId?.buildingDto?.houseNumberFraction, null);//номер дробь
    this.applicationForm.districtId = this.util.nvl(this.applicationForm.residentialComplexId?.buildingDto?.districtId, null);//Район
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
    this.postCode = this.applicationForm.residentialComplexId?.buildingDto?.postcode;
    this.loadDataFromPostApi();

    this.cdRef.detectChanges();
  }

  editClient() {
    clearTimeout(this.timer)
    let me = this;
    this.timer = setTimeout(function () {
      me.searchByPhone(me.applicationForm.phoneNumber);
    }, 800);
  }

  searchByPhone(login: string) {
    if (this.util.isNullOrEmpty(login)) return;
    this.subscriptions.add(this.ownerService.searchByPhone(login)
      .subscribe(res => {
        this.fillApplicationFormClientData(res);
        this.existsClient = true;
      }, () => this.clearApplicationFormClientData()));
  }

  clearApplicationFormClientData() {
    this.applicationForm.clientId = null;
    this.applicationForm.firstName = null;
    this.applicationForm.surname = null;
    this.applicationForm.patronymic = null;
    this.applicationForm.email = null;
    this.applicationForm.gender = null;
  }

  fillApplicationFormClientData(res: any) {
    this.applicationForm.clientId = res?.id;
    this.applicationForm.firstName = res?.firstName;
    this.applicationForm.surname = res?.surname;
    this.applicationForm.patronymic = res?.patronymic;
    this.applicationForm.email = res?.email;
    this.applicationForm.gender = res?.gender;
    this.applicationForm.phoneNumber = res?.phoneNumber;
  }

  fillApplicationForm(data: any) {
    this.applicationForm.operationTypeId = this.util.getDictionaryValueById(this.operationType, data?.operationTypeId);
    this.applicationForm.objectTypeId = this.util.getDictionaryValueById(this.objectType, data?.objectTypeId);
    this.setPossibleReasonForBidding();
    this.applicationForm.agent = data?.agent;
    if (!this.util.isNullOrEmpty(data?.purchaseDataDto)) {
      this.applicationForm.cityId = data?.purchaseDataDto?.cityId;
      this.applicationForm.districtId = data?.purchaseDataDto?.districtId;
      this.applicationForm.mortgage = this.util.toString(data?.purchaseDataDto?.mortgage);
      this.applicationForm.note = data?.purchaseDataDto?.note;
      this.applicationForm.probabilityOfBidding = this.util.toString(data?.purchaseDataDto?.probabilityOfBidding);
      this.applicationForm.theSizeOfTrades = data?.purchaseDataDto?.theSizeOfTrades;
      this.applicationForm.objectPriceFrom = data?.purchaseDataDto?.objectPricePeriod?.from;
      this.applicationForm.objectPriceTo = data?.purchaseDataDto?.objectPricePeriod?.to;
      this.applicationForm.applicationFlagIdList = data?.purchaseInfoDto?.applicationFlagIdList;
      setTimeout(() => {
        this.applicationForm.possibleReasonForBiddingIdList = this.util.nvl(data?.purchaseDataDto?.possibleReasonForBiddingIdList, null);
      }, 1000);
    }
    if (!this.util.isNullOrEmpty(data?.purchaseInfoDto)) {
      this.applicationForm.apartmentsOnTheSiteFrom = data?.purchaseInfoDto?.apartmentsOnTheSitePeriod?.from;
      this.applicationForm.apartmentsOnTheSiteTo = data?.purchaseInfoDto?.apartmentsOnTheSitePeriod?.to;
      this.applicationForm.balconyAreaFrom = data?.purchaseInfoDto?.balconyAreaPeriod?.from;
      this.applicationForm.balconyAreaTo = data?.purchaseInfoDto?.balconyAreaPeriod?.to;
      this.applicationForm.ceilingHeightFrom = data?.purchaseInfoDto?.ceilingHeightPeriod?.from;
      this.applicationForm.ceilingHeightTo = data?.purchaseInfoDto?.ceilingHeightPeriod?.to;
      this.applicationForm.concierge = this.util.toString(data?.purchaseInfoDto?.concierge);
      this.applicationForm.floorFrom = data?.purchaseInfoDto?.floorPeriod?.from;
      this.applicationForm.floorTo = data?.purchaseInfoDto?.floorPeriod?.to;
      this.applicationForm.kitchenAreaFrom = data?.purchaseInfoDto?.kitchenAreaPeriod?.from;
      this.applicationForm.kitchenAreaTo = data?.purchaseInfoDto?.kitchenAreaPeriod?.to;
      this.applicationForm.landAreaFrom = data?.purchaseInfoDto?.landAreaPeriod?.from;
      this.applicationForm.landAreaTo = data?.purchaseInfoDto?.landAreaPeriod?.to;
      this.applicationForm.livingAreaFrom = data?.purchaseInfoDto?.livingAreaPeriod?.from;
      this.applicationForm.livingAreaTo = data?.purchaseInfoDto?.livingAreaPeriod?.to;
      this.applicationForm.materialOfConstructionId = data?.purchaseInfoDto?.materialOfConstructionId;
      this.applicationForm.numberOfBedroomsFrom = data?.purchaseInfoDto?.numberOfBedroomsPeriod?.from;
      this.applicationForm.numberOfBedroomsTo = data?.purchaseInfoDto?.numberOfBedroomsPeriod?.to;
      this.applicationForm.numberOfFloorsFrom = data?.purchaseInfoDto?.numberOfFloorsPeriod?.from;
      this.applicationForm.numberOfFloorsTo = data?.purchaseInfoDto?.numberOfFloorsPeriod?.to;
      this.applicationForm.numberOfRoomsFrom = data?.purchaseInfoDto?.numberOfRoomsPeriod?.from;
      this.applicationForm.numberOfRoomsTo = data?.purchaseInfoDto?.numberOfRoomsPeriod?.to;
      this.applicationForm.parkingTypeIds = data?.purchaseInfoDto?.numberOfRoomsPeriod?.parkingTypeIds;
      this.applicationForm.playground = this.util.toString(data?.purchaseInfoDto?.playground);
      this.applicationForm.totalAreaFrom = data?.purchaseInfoDto?.totalAreaPeriod?.from;
      this.applicationForm.totalAreaTo = data?.purchaseInfoDto?.totalAreaPeriod?.to;
      this.applicationForm.typeOfElevatorList = data?.purchaseInfoDto?.typeOfElevatorList;
      this.applicationForm.wheelchair = this.util.toString(data?.purchaseInfoDto?.wheelchair);
      this.applicationForm.yardTypeId = data?.purchaseInfoDto?.yardTypeId;
      this.applicationForm.yearOfConstructionFrom = data?.purchaseInfoDto?.yearOfConstructionPeriod?.from;
      this.applicationForm.yearOfConstructionTo = data?.purchaseInfoDto?.yearOfConstructionPeriod?.to;
    }
    if (!this.util.isNullOrEmpty(data?.realPropertyDto)) {
      this.applicationForm.apartmentNumber = data?.realPropertyDto?.apartmentNumber;
      this.applicationForm.atelier = this.util.toString(data?.realPropertyDto?.atelier);
      this.applicationForm.apartmentNumber = data?.realPropertyDto?.apartmentNumber;
      this.applicationForm.balconyArea = data?.realPropertyDto?.balconyArea;
      if (!this.util.isNullOrEmpty(data?.realPropertyDto?.buildingDto)) {
        this.applicationForm.cityId = data?.realPropertyDto?.buildingDto?.cityId;
        this.applicationForm.districtId = data?.realPropertyDto?.buildingDto?.districtId;
        this.applicationForm.houseNumber = data?.realPropertyDto?.buildingDto?.houseNumber;
        this.applicationForm.houseNumberFraction = data?.realPropertyDto?.buildingDto?.houseNumberFraction;
        this.latitude = data?.realPropertyDto?.buildingDto?.latitude;
        this.longitude = data?.realPropertyDto?.buildingDto?.longitude;
        this.postCode = data?.realPropertyDto?.buildingDto?.postcode;
        this.applicationForm.streetId = data?.realPropertyDto?.buildingDto?.streetId;
        this.applicationForm.residentialComplexId = this.util.getDictionaryValueById(this.residentialComplexes, data?.realPropertyDto?.buildingDto?.residentialComplexId);
      }
      this.fillCadastralNumber(data?.realPropertyDto?.cadastralNumber);
      this.applicationForm.floor = data?.realPropertyDto?.floor;
      if (!this.util.isNullOrEmpty(data?.realPropertyDto?.generalCharacteristicsDto)) {
        this.applicationForm.apartmentsOnTheSite = data?.realPropertyDto?.generalCharacteristicsDto?.apartmentsOnTheSite;
        this.applicationForm.ceilingHeight = data?.realPropertyDto?.generalCharacteristicsDto?.ceilingHeight;
        this.applicationForm.concierge = this.util.toString(data?.realPropertyDto?.generalCharacteristicsDto?.concierge);
        this.applicationForm.playground = this.util.toString(data?.realPropertyDto?.generalCharacteristicsDto?.playground);
        this.applicationForm.ceilingHeight = data?.realPropertyDto?.generalCharacteristicsDto?.ceilingHeight;
        this.applicationForm.houseConditionId = data?.realPropertyDto?.generalCharacteristicsDto?.houseConditionId;
        this.applicationForm.housingClass = data?.realPropertyDto?.generalCharacteristicsDto?.housingClass;
        this.applicationForm.materialOfConstructionId = data?.realPropertyDto?.generalCharacteristicsDto?.materialOfConstructionId;
        this.applicationForm.numberOfApartments = data?.realPropertyDto?.generalCharacteristicsDto?.numberOfApartments;
        this.applicationForm.numberOfFloors = data?.realPropertyDto?.generalCharacteristicsDto?.numberOfFloors;
        this.applicationForm.parkingTypeIds = data?.realPropertyDto?.generalCharacteristicsDto?.parkingTypeIds;
        this.applicationForm.propertyDeveloperId = data?.realPropertyDto?.generalCharacteristicsDto?.propertyDeveloperId;
        this.applicationForm.typeOfElevatorList = data?.realPropertyDto?.generalCharacteristicsDto?.typeOfElevatorList;
        this.applicationForm.yearOfConstruction = data?.realPropertyDto?.generalCharacteristicsDto?.yearOfConstruction;
      }
      this.applicationForm.heatingSystemId = data?.realPropertyDto?.heatingSystemId;
      this.applicationForm.kitchenArea = data?.realPropertyDto?.kitchenArea;
      this.applicationForm.landArea = data?.realPropertyDto?.landArea;
      this.applicationForm.livingArea = data?.realPropertyDto?.livingArea;
      this.applicationForm.metadataId = data?.realPropertyDto?.metadataId;
      this.applicationForm.metadataStatusId = data?.realPropertyDto?.metadataStatusId;
      this.applicationForm.numberOfBedrooms = data?.realPropertyDto?.numberOfBedrooms;
      this.applicationForm.numberOfRooms = data?.realPropertyDto?.numberOfRooms;
      this.applicationForm.separateBathroom = data?.realPropertyDto?.separateBathroom;
      this.applicationForm.sewerageId = data?.realPropertyDto?.sewerageId;
      this.applicationForm.totalArea = data?.realPropertyDto?.totalArea;
      if (!this.util.isNullOrEmpty(data?.realPropertyDto?.photoIdList)) {
        for (const ph of data?.realPropertyDto.photoIdList) {
          this.fillPicture(ph, 1);
        }
      }
      if (!this.util.isNullOrEmpty(data?.realPropertyDto?.housingPlanImageIdList)) {
        for (const ph of data?.realPropertyDto.housingPlanImageIdList) {
          this.fillPicture(ph, 2);
        }
      }
      if (!this.util.isNullOrEmpty(data?.realPropertyDto?.virtualTourImageIdList)) {
        for (const ph of data?.realPropertyDto?.virtualTourImageIdList) {
          this.fillPicture(ph, 3);
        }
      }
    }
    if (!this.util.isNullOrEmpty(data?.sellDataDto)) {
      this.applicationForm.description = data?.sellDataDto?.description;
      this.applicationForm.encumbrance = this.util.toString(data?.sellDataDto?.encumbrance);
      this.applicationForm.exchange = this.util.toString(data?.sellDataDto?.exchange);
      this.applicationForm.mortgage = this.util.toString(data?.sellDataDto?.mortgage);
      this.applicationForm.sharedOwnershipProperty = this.util.toString(data?.sellDataDto?.sharedOwnershipProperty);
      this.applicationForm.note = data?.sellDataDto?.note;
      this.applicationForm.objectPrice = data?.sellDataDto?.objectPrice;
      setTimeout(() => {
        this.applicationForm.possibleReasonForBiddingIdList = this.util.nvl(data?.sellDataDto?.possibleReasonForBiddingIdList, null);
      }, 1000);
      this.applicationForm.probabilityOfBidding = this.util.toString(data?.sellDataDto?.probabilityOfBidding);
      this.applicationForm.theSizeOfTrades = data?.sellDataDto?.theSizeOfTrades;
    }
    this.loadDataFromPostApi();
    this.applicationForm.unification = 'address';
    if (!this.util.isNullOrEmpty(this.applicationForm.residentialComplexId)) {
      this.applicationForm.unification = 'residence';
    }
  }

  loadDataFromPostApi() {
    this.subscriptions.add(
      this.kazPostService.getDataFromDb(this.postCode).subscribe(res=> {
        this.applicationForm.postcode = res?.addressRus;
        }
      )
    )
  }

  fillCadastralNumber(data: string) {
    if (!this.util.isNullOrEmpty(data)) {
      let splited = data?.split(':');
      this.applicationForm.cadastralNumber = this.util.nvl(splited[0], null);
      this.applicationForm.cadastralNumber1 = this.util.nvl(splited[1], null);
      this.applicationForm.cadastralNumber2 = this.util.nvl(splited[2], null);
      this.applicationForm.cadastralNumber3 = this.util.nvl(splited[3], null);
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
        this.setValidator('objectPrice', Validators.required);
        this.setValidator('numberOfRooms', Validators.required);
        this.setValidator('totalArea', Validators.required);
        this.setValidator('livingArea', Validators.required);
        this.setValidator('numberOfBedrooms', Validators.required);
        if (this.util.isNullOrEmpty(this.applicationForm?.residentialComplexId)) {
          this.setValidator('apartmentNumber', Validators.required);
        } else {
          this.setValidator('apartmentNumber', Validators.nullValidator);
        }
      } else if (this.isSell()) { //купить
        this.setValidator('districtId', Validators.required);
        this.setValidator('objectPrice', Validators.nullValidator);
      }
    } else if (this.isHouse()) {//дом
      this.setValidator('districtId', Validators.required);
      if (this.isBuy()) {//продать
        this.setValidator('houseNumber', Validators.required);
        this.setValidator('landArea', Validators.required);
        this.setValidator('totalArea', Validators.required);
        this.setValidator('livingArea', Validators.required);
      }
    }
    if (!this.util.isNullOrEmpty(this.applicationForm.phoneNumber)) {
      this.setValidator('firstName', Validators.required);
      this.setValidator('surname', Validators.required);
      this.setValidator('phoneNumber', Validators.required);
    } else {
      this.setValidator('firstName', Validators.nullValidator);
      this.setValidator('surname', Validators.nullValidator);
      this.setValidator('phoneNumber', Validators.required);
    }
    if (this.applicationForm.unification == 'address') {
      this.setValidator('residentialComplexId', Validators.nullValidator);
      this.setValidator('postcode', this.isBuy() ? Validators.required : Validators.nullValidator);
    } else if (this.applicationForm.unification == 'residence') {
      this.setValidator('postcode', Validators.nullValidator);
      this.setValidator('residentialComplexId', Validators.required);
    }
    if (this.isSell()) {
      this.setValidator('postcode', Validators.nullValidator);
      this.setValidator('postcode', Validators.nullValidator);
    } else {
      this.setValidator('postcode', Validators.required);
      this.setValidator('postcode', Validators.required);
    }
  }

  setValidator(code: string, validator) {
    this.applicationForm.controls[code].setValidators([validator]);
    this.applicationForm.controls[code].updateValueAndValidity();
  }

  fillApplicationPurchaseDataDto() {
    return this.application.purchaseDataDto = new ApplicationPurchaseDataDto(
      null,
      this.applicationForm.cityId,
      this.applicationForm.districtId,
      this.applicationForm.mortgage,
      this.applicationForm.note,
      this.applicationForm.probabilityOfBidding,
      this.applicationForm.theSizeOfTrades,
      new Period(this.applicationForm?.objectPriceFrom, this.applicationForm?.objectPriceTo),
      this.applicationForm.possibleReasonForBiddingIdList,
      this.applicationForm.applicationFlagIdList
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
    let photoList = [];
    this.photoList.forEach(photo => {
      photoList.push(photo.guid);
    })
    let photoPlanList = [];
    this.photoPlanList.forEach(photo => {
      photoPlanList.push(photo.guid);
    })
    let photo3DList = [];
    this.photo3DList.forEach(photo => {
      photo3DList.push(photo.guid);
    })
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
      this.edit,
      this.filesEdited,
      this.applicationForm.numberOfBedrooms,
      this.applicationForm.numberOfRooms,
      this.applicationForm.separateBathroom,
      this.applicationForm.sewerageId,
      this.applicationForm.totalArea,
      photoPlanList,
      photoList,
      photo3DList
    )
  }

  fillSellDataDto() {
    return this.application.sellDataDto = new ApplicationSellDataDto(
      this.applicationForm.description, // описание
      this.applicationForm.encumbrance,
      this.applicationForm.exchange,
      null,
      this.applicationForm.mortgage,
      this.applicationForm.note,
      this.applicationForm.objectPrice,
      this.applicationForm.possibleReasonForBiddingIdList,
      this.applicationForm.probabilityOfBidding,
      this.applicationForm.sharedOwnershipProperty,
      this.applicationForm.theSizeOfTrades,
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

  createClientIfNotPresent() {
    if (!this.applicationId) {
      if (this.util.isNullOrEmpty(this.applicationForm.phoneNumber)) return;
      this.subscriptions.add(this.ownerService.searchByPhone(this.applicationForm.phoneNumber)
        .subscribe(res => {
        }, () => this.createClient()));

    }
    this.application.clientLogin = this.applicationForm.phoneNumber;
  }

  createClient() {
    let dto = new ClientDto();
    dto.firstName = this.applicationForm.firstName;
    dto.surname = this.applicationForm.surname;
    dto.patronymic = this.applicationForm.patronymic;
    dto.email = this.applicationForm.email;
    dto.gender = this.applicationForm.gender;
    dto.phoneNumber = this.applicationForm.phoneNumber;
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

    this.createClientIfNotPresent();

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

    this.fillApplication();

    console.log(this.application)

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
    } else if (id == 2) {
      this.headerDeal = true;
    }
    if (id == 3) {
      this.clientDeal = false;
    } else if (id == 4) {
      this.clientDeal = true;
    }
    if (id == 5) {
      this.aboutObject = false;
    } else if (id == 6) {
      this.aboutObject = true;
    }
    if (id == 7) {
      this.aboutPhoto = false;
    } else if (id == 8) {
      this.aboutPhoto = true;
    }
    if (id == 9) {
      this.aboutMap = false;
    } else if (id == 10) {
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

  onFileChange(event, id: number) {
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.selectedFile = event.target.files[i];
        this.subscriptions.add(this.uploader.uploadData(this.selectedFile)
          .subscribe(data => {
            if (data != null) {
              this.filesEdited = true;
              this.fillPicture(data, id);
            }
          }));
      }
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
      let str = this.util.getDictionaryValueById(this.streets, this.applicationForm.streetId)?.label + ' ' + this.applicationForm.houseNumber;
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
    clearTimeout(this.timer);
    let me = this;
    this.timer = setTimeout(function () {
      if (!me.util.isNullOrEmpty(event)) {
        me.apiParam = event.term;
        me.searchDataPost(me.apiParam, me.apiPage);
      }
    }, 300);
  }

  getDataKzPost2(event) {
    clearTimeout(this.timer);
    let me = this;
    this.timer = setTimeout(function () {
      if (!me.util.isNullOrEmpty(event)) {
        me.apiParam = event.term;
        me.searchDataPost2(me.apiParam, me.apiPage);
      }
    }, 300);
  }

  searchDataPost(val: string, page: number) {
    this.subscriptions.add(this.kazPostService.getDataPost(val, page).subscribe(res => {
      this.kazPost = this.util.toSelectArrayPost(res.data)
      this.kazPost = [...this.kazPost, this.util.toSelectArrayPost(res.data)];
    }))
  }

  searchDataPost2(val: string, page: number) {
    this.subscriptions.add(this.kazPostService.getDataPost(val, page).subscribe(res => {
      this.kazPost2 = this.util.toSelectArrayPost(res.data)
      this.kazPost2 = [...this.kazPost2, this.util.toSelectArrayPost(res.data)];
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

  customSearchFn(term: string, item) {
    let result = false;
    term = term.toLowerCase();
    if (item != null && item.label != null) {
      result = item.label.toLowerCase().indexOf(term) > -1 || item.fullAddress?.addressRus.toLowerCase() === term;
      if (!result) {
        let search = term.split(",")[1];
        if (search != null) {
          result = item.label.toLowerCase().includes(search.substr(0, search.length - 1));
        } else {
          return true;
        }
      }
    }
    return result;
  }

  checkPostData() {
    if (!this.util.isNullOrEmpty(this.applicationForm.postcode?.fullAddress)) {
      this.ngxLoader.startBackground()
      this.subscriptions.add(this.kazPostService.checkPostData(this.applicationForm.postcode?.fullAddress).subscribe(res => {
        this.postCode = this.applicationForm.postcode?.value;
        this.loadDictionary();
        this.subscriptions.add(this.newDicService.getResidentialComplexesByPostcode(this.postCode).subscribe(res =>
          this.applicationForm.residentialComplexId = this.util.getDictionaryValueById(this.residentialComplexes, res.buildingDto.residentialComplexId)
        ))
        setTimeout(() => {

          this.applicationForm.cityId = res.city?.id;
          this.applicationForm.streetId = res.street?.id;
          this.applicationForm.districtId = res.district?.id;
          this.applicationForm.houseNumber = res.houseNumber;

          this.ngxLoader.stopBackground()
        }, 1000);
      }, () => this.ngxLoader.stopBackground()));
    }
  }

  showModalChooseClaim() {
    if (!this.isBuy()) {
      return;
    }
    if (!this.edit) {
      return;
    }
    let objNumber = this.util.nvl(this.applicationForm.houseNumber, this.applicationForm.apartmentNumber);
    if (!this.util.isNullOrEmpty(objNumber) && !this.util.isNullOrEmpty(this.postCode)) {
      this.subscriptions.add(
        this.claimService.getApartmentByNumberAndPostcode(objNumber, this.postCode).subscribe(res => {
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

  openModal(template: TemplateRef<any>,dicName: string) {
    this.dicName=dicName;
    if (dicName=='residentialComplexes'){
      this.resident=true;
    }else{
      this.resident=false;
    }
    this.modalRef = this.modalService.show(template, {keyboard: false, backdrop: 'static'});
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef2.hide();
    this.modalRef.hide();
    this.clearForm();
  }

   submitModal() {
    this.ngxLoader.startBackground();
    if (this.resident == true) {
      if (this.util.isNullOrEmpty(this.formRes.buildingDto.cityId) || this.util.isNullOrEmpty(this.formRes.buildingDto.streetId) || this.util.isNullOrEmpty(this.formRes.buildingDto.houseNumber)
        || this.util.isNullOrEmpty(this.formRes.houseName)) {
        this.notifyService.showError('Пожалуйста, заполните все поля', "");
        return;
      }
      let saveForm = {
        dictionaryName: this.dicName,
        nameEn: this.formRes.houseName,
        nameKz: this.formRes.houseName,
        nameRu: this.formRes.houseName,
        parentId: null,
        id:null
      };
      this.subscriptions.add(this.dicService.saveResidentalComplex(this.formRes).subscribe(data => {
          if (data != null) {
            saveForm.id=data.id;
            this.loadDictionary();
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.modalRef.hide();
            this.clearForm();
            let interval;
            let timeLeft: number = 1;
            interval = setInterval(() => {
              if (timeLeft > 0) {
                timeLeft--;
              } else {
                this.loadDictionary();
                this.applicationForm.residentialComplexId=data;
                this.applicationForm.residentialComplexId.value=data.id;
                this.applicationForm.residentialComplexId.label=data.houseName;
                this.ngxLoader.stopBackground();
              }
            }, 300)
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.modalRef.hide();
          this.clearForm();
        }
      ));

    } else {
      if (this.util.isNullOrEmpty(this.formData.multiLang.nameRu)) {
        this.notifyService.showError('Пожалуйста, заполните все поля', "");
        return;
      }
      let saveForm = {
        dictionaryName: this.dicName,
        nameEn: this.formData.multiLang.nameEn,
        nameKz: this.formData.multiLang.nameKz,
        nameRu: this.formData.multiLang.nameRu,
        parentId: this.formData.parentId,
        id:null
      };

      this.subscriptions.add(this.dicService.saveDicNew(saveForm).subscribe(data => {
        if (data != null) {
          saveForm.id=data;
          this.notifyService.showSuccess('success', 'Успешно сохранено');
          this.modalRef.hide();
          this.clearForm();
          let interval;
          let timeLeft: number = 1;
          interval = setInterval(() => {
            if (timeLeft > 0) {
              timeLeft--;
            } else {
              this.loadDictionary();
              this.ngxLoader.stopBackground();
              }
          }, 300)
        }
      }, err => {
        this.notifyService.showError('warning', err.message);
        this.modalRef.hide();
        this.clearForm();
      }));


    }
  }


  checkPostData2() {
    if (!this.util.isNullOrEmpty(this.postcode2?.fullAddress)) {
      this.ngxLoader.startBackground();

      this.subscriptions.add(this.kazPostService.checkPostData(this.postcode2?.fullAddress).subscribe(res => {
        this.formRes.buildingDto.postcode = this.postcode2?.value;
        let interval;
        let timeLeft: number = 1;
        interval = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
          } else {
            this.loadDictionary();
            this.formRes.buildingDto.cityId = res.city.id;
            this.formRes.buildingDto.districtId = res.district.id;
            this.formRes.buildingDto.streetId = res.street.id;
            this.formRes.buildingDto.houseNumber = res.houseNumber;
            this.ngxLoader.stopBackground();

          }
        }, 300)

      }));
    }
  }
}
