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
import {ActivatedRoute, Router} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {RoleManagerService} from "../../../services/roleManager.service";
import {UserService} from "../../../services/user.service";
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
import {HttpParams} from "@angular/common/http";
declare var jquery: any;   // not required
declare var $: any;   // not required

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss'],
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
  operationType: any;
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
  houseClass: Dic[];
  applicationFlagSort: Dic[];
  agentList: Dic[];
  sewerageSystems: Dic[];
  houseCondition: Dic[];
  countries: Dic[];
  materials: Dic[];
  possibleReasonForBidding: Dic[];
  possibleReasonForBiddingSort: Dic[];
  applicationForm: any;
  image: any;
  dicDynamic: any;
  elevatorType: Dic[];
  yardTypes: Dic[];
  readonlyChooseJK: boolean = false;
  saved: boolean = false;
  modalRef: BsModalRef;
  applicationId: number;
  operationList: any;
  headerDeal: boolean = false;
  clientDeal: boolean = false;
  aboutObject: boolean = false;
  aboutPhoto: boolean = false;
  aboutMap: boolean = false;
  existsClient: boolean = false;
  edit: boolean = true;
  view: boolean = true;
  filesEdited: boolean = false;
  postcode: any;
  postcode2: any;
  dicName: string;
  activeTab = 'claim';
  expandBlock: boolean = false;
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
  isUpload = false;
  percent: number;
  roles: any;
  contractDto: ContractDto;
  fromBoard: boolean = false;

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
              public actRoute: ActivatedRoute,
              private ngxLoader: NgxUiLoaderService,
              private roleManagerService: RoleManagerService,
              private userService: UserService,
              private dicService: DicService,
              private modal: NgbModal,
              private router: Router,
              private newDicService: NewDicService,
              private kazPostService: KazPostService) {
    if (this.util.isNumeric(this.actRoute.snapshot.params.id)) {
      if (!this.view) {
        this.edit = false;
      }
      this.saved = true;
      this.applicationId = Number(this.actRoute.snapshot.params.id);
    }
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('activeTab'))) {
      this.activeTab = this.actRoute.snapshot.queryParamMap.get('activeTab');
    }
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('fromBoard'))) {
      this.fromBoard = this.actRoute.snapshot.queryParamMap.get('fromBoard') == 'true';
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
    numberOfApartments: null,
    numberOfEntrances: null,
    numberOfFloors: null,
    playground: false,
    propertyDeveloperId: null,
    typeOfElevatorIdList: [],
    parkingTypeIds: [],
    wheelchair: false,
    yardTypeId: null,
    countryId: null,
    yearOfConstruction: null
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
    this.applicationForm = this.formBuilder.group({
      id: [null, Validators.nullValidator],
      operationTypeId: [null, Validators.required],
      objectTypeId: [null, Validators.required],
      objectPrice: [0, Validators.nullValidator],
      surname: [null, this.applicationId ? Validators.required : Validators.nullValidator],
      firstName: [null, this.applicationId ? Validators.required : Validators.nullValidator],
      patronymic: [null, Validators.nullValidator],
      clientId: [null, Validators.nullValidator],
      phoneNumber: [null, this.applicationId ? Validators.required : Validators.nullValidator],
      email: [null, this.applicationId ? [Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] : Validators.nullValidator],
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
      districts: [null, Validators.nullValidator],
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

    let params = new HttpParams();
    params = params.append('groupCodes', String('AGENT_GROUP'))
    this.roleManagerService.getCheckOperationList(params).subscribe(obj => {
      this.roles = obj.data
    });

    window.scrollTo(0, 0);
    this.applicationForm.unification = 'address';
    $("#wrapper").toggleClass("toggled");
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
      this.applicationFlag = this.util.toSelectArrayFlag(data);
    }));

    this.subscriptions.add(this.newDicService.getDictionary('HouseClass').subscribe(data => {
      this.houseClass = this.util.toSelectArray(data);
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
      numberOfApartments: null,
      numberOfEntrances: null,
      numberOfFloors: null,
      playground: false,
      propertyDeveloperId: null,
      typeOfElevatorIdList: [],
      parkingTypeIds: [],
      wheelchair: false,
      yardTypeId: null,
      countryId: null,
      yearOfConstruction: null
    };
    }

  loadDataById(id: number) {
    this.ngxLoader.startBackground();
    this.subscriptions.add(this.claimService.getClaimById(id).subscribe(data => {
      if (!this.util.isNullOrEmpty(data)) {
        this.searchByPhone(data.clientLogin);
        this.fillApplicationForm(data);
        this.cdRef.detectChanges();
        this.ngxLoader.stopBackground();
        this.setApplicationFlagSort();
        this.operationList = data?.operationList;
        if (data.contractDto) {
          this.contractDto = data.contractDto;
        }
      }
    }));
  }

  setValue(controlName, value) {
    this.applicationForm.controls[controlName].setValue(value);
    this.applicationForm.controls[controlName].updateValueAndValidity();
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
        if (pos["code"] == this.applicationForm?.operationTypeId?.code) {
          let m = {};
          m["value"] = pos["value"];
          m["label"] = pos["label"];
          m["code"] = pos["code"];
          this.applicationFlagSort.push(m);
        }
      }
    }
  }

  clearResidentialComplex() {
    this.applicationForm.houseNumber = null;//?????????? ????????
    this.applicationForm.houseNumberFraction = null;//?????????? ??????????
    this.applicationForm.districts = null;//??????????
    this.applicationForm.numberOfFloors = null;//?????????????????? ????????
    this.applicationForm.apartmentsOnTheSite = null;//????. ???? ????????????????
    this.applicationForm.materialOfConstructionId = null;//????????????????
    this.applicationForm.yearOfConstruction = null;//?????? ??????????????????
    this.applicationForm.typeOfElevatorList = null;//????????
    this.applicationForm.concierge = null;//????????????????
    this.applicationForm.wheelchair = null;//????????????????????
    this.applicationForm.parkingTypeIds = null;///????????????????
    this.applicationForm.yardTypeId = null;//????????
    this.applicationForm.playground = null;//?????????????? ????????????????
    this.applicationForm.propertyDeveloperId = null;//??????????????????
    this.applicationForm.housingClass = null;//?????????? ??????????
    this.applicationForm.houseConditionId = null;//??????????????????
    this.applicationForm.numberOfApartments = null;//??????-???? ????
    this.applicationForm.ceilingHeight = null;//??????-???? ????
    this.postCode = null;
    this.applicationForm.postcode = null;
  }

  setResidenceComplexType() {
    if (this.applicationId && !this.edit) return;
    this.readonlyChooseJK = !this.util.isNullOrEmpty(this.applicationForm.residentialComplexId);
    if (this.applicationForm.residentialComplexId) {
      this.applicationForm.houseNumber = this.util.nvl(this.applicationForm.residentialComplexId?.buildingDto?.houseNumber, null);//?????????? ????????
      this.applicationForm.houseNumberFraction = this.util.nvl(this.applicationForm.residentialComplexId?.buildingDto?.houseNumberFraction, null);//?????????? ??????????
      this.applicationForm.districts = this.util.nvl(this.applicationForm.residentialComplexId?.buildingDto?.districtId, null);
      this.applicationForm.numberOfFloors = this.util.nvl(this.applicationForm.residentialComplexId?.numberOfFloors, null);//?????????????????? ????????
      this.applicationForm.apartmentsOnTheSite = this.util.nvl(this.applicationForm.residentialComplexId?.apartmentsOnTheSite, null);//????. ???? ????????????????
      this.applicationForm.materialOfConstructionId = this.util.nvl(this.applicationForm.residentialComplexId?.materialOfConstructionId, null);//????????????????
      this.applicationForm.yearOfConstruction = this.util.nvl(this.applicationForm.residentialComplexId?.yearOfConstruction, null);//?????? ??????????????????
      this.applicationForm.typeOfElevatorList = this.util.nvl(this.applicationForm.residentialComplexId?.typeOfElevator, null);//????????
      this.applicationForm.concierge = this.util.nvl(this.util.toString(this.applicationForm.residentialComplexId?.concierge), null);//????????????????
      this.applicationForm.wheelchair = this.util.nvl(this.util.toString(this.applicationForm.residentialComplexId?.wheelchair), null);//????????????????????
      this.applicationForm.parkingTypeIds = this.util.nvl(this.applicationForm.residentialComplexId?.parkingTypeIds, null);///????????????????
      this.applicationForm.yardTypeId = this.util.nvl(this.applicationForm.residentialComplexId?.yardType, null);//????????
      this.applicationForm.playground = this.util.nvl(this.util.toString(this.applicationForm.residentialComplexId?.playground), null);//?????????????? ????????????????
      this.applicationForm.propertyDeveloperId = this.util.nvl(this.applicationForm.residentialComplexId?.propertyDeveloperId, null);//??????????????????
      this.applicationForm.housingClass = parseInt(this.util.nvl(this.applicationForm.residentialComplexId?.housingClass, null));//?????????? ??????????
      this.applicationForm.houseConditionId = this.util.nvl(this.applicationForm.residentialComplexId?.houseConditionId, null);//??????????????????
      this.applicationForm.numberOfApartments = this.util.nvl(this.applicationForm.residentialComplexId?.numberOfApartments, null);//??????-???? ????
      this.applicationForm.ceilingHeight = this.util.nvl(this.applicationForm.residentialComplexId?.ceilingHeight, null);//??????-???? ????
      this.postCode = this.applicationForm.residentialComplexId?.buildingDto?.postcode;
      this.loadDataFromPostApi();
    }
    if(!this.applicationId) {
      this.showModalChooseClaim();
    }
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
    this.subscriptions.add(this.ownerService.findByLoginAndAppId(login, this.applicationId)
      .subscribe(res => {
        this.fillApplicationFormClientData(res);
        this.existsClient = true;
      }));
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
      this.applicationForm.districts = data?.purchaseDataDto?.districts;
      this.applicationForm.mortgage = this.util.toString(data?.purchaseDataDto?.mortgage);
      this.applicationForm.note = data?.purchaseDataDto?.note;
      this.applicationForm.probabilityOfBidding = this.util.toString(data?.purchaseDataDto?.probabilityOfBidding);
      this.applicationForm.theSizeOfTrades = data?.purchaseDataDto?.theSizeOfTrades;
      this.applicationForm.objectPriceFrom = data?.purchaseDataDto?.objectPricePeriod?.from;
      this.applicationForm.objectPriceTo = data?.purchaseDataDto?.objectPricePeriod?.to;
      this.applicationForm.applicationFlagIdList = data?.purchaseDataDto?.applicationFlagIdList;
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
      this.applicationForm.parkingTypeIds = data?.purchaseInfoDto?.parkingTypeIds;
      this.applicationForm.playground = this.util.toString(data?.purchaseInfoDto?.playground);
      this.applicationForm.totalAreaFrom = data?.purchaseInfoDto?.totalAreaPeriod?.from;
      this.applicationForm.totalAreaTo = data?.purchaseInfoDto?.totalAreaPeriod?.to;
      this.applicationForm.typeOfElevatorList = data?.purchaseInfoDto?.typeOfElevatorList;
      this.applicationForm.wheelchair = this.util.toString(data?.purchaseInfoDto?.wheelchair);
      this.applicationForm.yardTypeId = data?.purchaseInfoDto?.yardTypeId;
      this.applicationForm.yearOfConstructionFrom = data?.purchaseInfoDto?.yearOfConstructionPeriod?.from;
      this.applicationForm.yearOfConstructionTo = data?.purchaseInfoDto?.yearOfConstructionPeriod?.to;
      this.applicationForm.atelier = data?.purchaseInfoDto?.atelier;
      this.applicationForm.separateBathroom = data?.purchaseInfoDto?.separateBathroom;
      this.applicationForm.sewerageId = data?.purchaseInfoDto?.sewerageId;
      this.applicationForm.heatingSystemId = data?.purchaseInfoDto?.heatingSystemId;
    }
    if (!this.util.isNullOrEmpty(data?.realPropertyDto)) {
      this.applicationForm.apartmentNumber = data?.realPropertyDto?.apartmentNumber;
      this.applicationForm.atelier = data?.realPropertyDto?.atelier || data?.purchaseInfoDto?.atelier;
      this.applicationForm.apartmentNumber = data?.realPropertyDto?.apartmentNumber;
      this.applicationForm.balconyArea = data?.realPropertyDto?.balconyArea;
      if (!this.util.isNullOrEmpty(data?.realPropertyDto?.buildingDto)) {
        this.applicationForm.cityId = data?.realPropertyDto?.buildingDto?.cityId;
        this.applicationForm.districts = data?.realPropertyDto?.buildingDto?.districts;
        this.applicationForm.houseNumber = data?.realPropertyDto?.buildingDto?.houseNumber;
        this.applicationForm.houseNumberFraction = data?.realPropertyDto?.buildingDto?.houseNumberFraction;
        this.latitude = data?.realPropertyDto?.buildingDto?.latitude;
        this.longitude = data?.realPropertyDto?.buildingDto?.longitude;
        this.postCode = data?.realPropertyDto?.buildingDto?.postcode;
        this.applicationForm.streetId = data?.realPropertyDto?.buildingDto?.streetId;
        this.applicationForm.residentialComplexId = this.util.getDictionaryValueById(this.residentialComplexes, data?.realPropertyDto?.buildingDto?.residentialComplexId);
      }
      this.applicationForm.floor = data?.realPropertyDto?.floor;
      if (!this.util.isNullOrEmpty(data?.realPropertyDto?.generalCharacteristicsDto)) {
        this.applicationForm.apartmentsOnTheSite = data?.realPropertyDto?.generalCharacteristicsDto?.apartmentsOnTheSite;
        this.applicationForm.ceilingHeight = data?.realPropertyDto?.generalCharacteristicsDto?.ceilingHeight;
        this.applicationForm.concierge = this.util.toString(data?.realPropertyDto?.generalCharacteristicsDto?.concierge);
        this.applicationForm.playground = this.util.toString(data?.realPropertyDto?.generalCharacteristicsDto?.playground);
        this.applicationForm.ceilingHeight = data?.realPropertyDto?.generalCharacteristicsDto?.ceilingHeight;
        this.applicationForm.houseConditionId = data?.realPropertyDto?.generalCharacteristicsDto?.houseConditionId;
        this.applicationForm.housingClass = parseInt(data?.realPropertyDto?.generalCharacteristicsDto?.housingClass);
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
      this.applicationForm.separateBathroom = data?.realPropertyDto?.separateBathroom || data?.purchaseInfoDto?.separateBathroom;
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
      this.applicationForm.applicationFlagIdList = data?.sellDataDto?.applicationFlagIdList;
    }
    this.loadDataFromPostApi();
    this.applicationForm.unification = 'address';
    if (!this.util.isNullOrEmpty(this.applicationForm.residentialComplexId) && data?.realPropertyDto?.apartmentNumber) {
      this.applicationForm.unification = 'residence';
    }
  }

  loadDataFromPostApi() {
    this.subscriptions.add(
      this.kazPostService.getDataFromDb(this.postCode).subscribe(res => {
        this.applicationForm.postcode = res?.addressRus;
        }
      )
    )
  }

  showPhotoFull(url: any) {
    this.modalRef = this.modalService.show(ModalComponent, {
      class: 'modal-xl',
      initialState: {
        title: '????????????????',
        data: url,
        centered: true
      }
    });
  }

  /**
   * ??????????????
   */
  isBuy() {
    return this.applicationForm?.operationTypeId?.code == '001002';
  }

  /**
   * ????????????;
   */
  isSell() {
    return this.applicationForm?.operationTypeId?.code == '001001';
  }

  /**
   * ????????????????
   */
  isApartment() {
    return this.applicationForm?.objectTypeId?.code == '003001';
  }

  /**
   * ??????
   */
  isHouse() {
    return this.applicationForm?.objectTypeId?.code == '003002';
  }

  validate() {
    if (this.isApartment()) { // ????
      if (this.isBuy()) { // ??????????????
        this.setValidator('objectPrice', Validators.required);
        this.setValidator('numberOfRooms', Validators.required);
        this.setValidator('totalArea', Validators.required);
        this.setValidator('apartmentNumber', Validators.required);
        this.setValidator('unification', Validators.required);
      } else if (this.isSell()) { // ????????????
        this.setValidator('districts', Validators.required);
        this.setValidator('objectPrice', Validators.nullValidator);
        this.setValidator('unification', Validators.nullValidator);
      }
    } else if (this.isHouse()) { // ??????
      this.setValidator('districts', Validators.required);
      if (this.isBuy()) { // ??????????????
        this.setValidator('houseNumber', Validators.required);
        this.setValidator('landArea', Validators.required);
        this.setValidator('totalArea', Validators.required);
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
    if (this.applicationId || this.existsClient) {
      this.setValidator('firstName', Validators.nullValidator);
      this.setValidator('surname', Validators.nullValidator);
      this.setValidator('phoneNumber', Validators.nullValidator);
      this.setValidator('email', Validators.nullValidator);
    } else {
      this.setValidator('firstName', Validators.required);
      this.setValidator('surname', Validators.required);
      this.setValidator('phoneNumber', Validators.required);
    }
  }

  setValidator(code: string, validator) {
    this.applicationForm.controls[code].setValidators([validator]);
    this.applicationForm.controls[code].updateValueAndValidity();
  }

  fillApplicationPurchaseDataDto() {
    if (this.isBuy()) {
      return
    }
    return this.application.purchaseDataDto = new ApplicationPurchaseDataDto(
      null,
      this.applicationForm.cityId,
      this.applicationForm.districts,
      this.applicationForm.mortgage,
      this.applicationForm.note,
      this.applicationForm.probabilityOfBidding,
      this.applicationForm.theSizeOfTrades,
      new Period(this.applicationForm?.objectPriceFrom, this.applicationForm?.objectPriceTo),
      this.applicationForm.possibleReasonForBiddingIdList,
      this.applicationForm.applicationFlagIdList
    );
  }

  fillPurchaseInfoDto() {
    if (this.isBuy()) {
      return
    }
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
      new Period(this.applicationForm.yearOfConstructionFrom, this.applicationForm.yearOfConstructionTo),
      this.applicationForm.atelier,
      this.applicationForm.separateBathroom,
      this.applicationForm.sewerageId,
      this.applicationForm.heatingSystemId
    )
  }

  fillBuildingDto() {
    if (this.isSell()) {
      return
    }
    return this.application.realPropertyDto.buildingDto = new BuildingDto(
      this.applicationForm.cityId,
      this.applicationForm.districts,
      this.applicationForm.houseNumber,
      this.applicationForm.houseNumberFraction,
      this.latitude,
      this.longitude,
      this.postCode,
      this.applicationForm.streetId
    )
  }

  fillGeneralCharacteristicsDto() {
    if (this.isSell()) {
      return
    }
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
      this.applicationForm.typeOfElevatorList,
      this.applicationForm.yearOfConstruction,
      this.applicationForm.wheelchair,
      this.applicationForm.yardTypeId,
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
      this.applicationForm.floor,
      this.fillGeneralCharacteristicsDto(),
      this.applicationForm.heatingSystemId,
      null,
      this.applicationForm.kitchenArea,
      this.applicationForm.landArea,
      this.applicationForm.livingArea,
      null,//todo ????????????????
      null,//todo ???????????? ????????????????
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
    );
  }

  fillSellDataDto() {
    if (this.isSell()) {
      return
    }
    return this.application.sellDataDto = new ApplicationSellDataDto(
      this.applicationForm.description, // ????????????????
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
      this.applicationForm.applicationFlagIdList
    )
  }

  fillApplication() {
    this.application = new ApplicationDto(
      this.applicationId || null,
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
      this.subscriptions.add(this.ownerService.findByLoginAndAppId(this.applicationForm.phoneNumber, null)
        .subscribe(res => {
          this.existsClient = true;
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
    this.subscriptions.add(this.userService.createUserClient(dto).subscribe(res=>{
      this.existsClient = true;
    }, () => this.notifyService.error('????????????', '?????????????????? ??????????')));
  }

  submit() {
    this.ngxLoader.startBackground();
    this.validate();
    this.application = new ApplicationDto();
    this.application.realPropertyDto = new RealPropertyDto();

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
          this.notifyService.showInfo("????????????", "???????? " + text + " ???? ??????????????????!!!");
        }));
        result = true;
      }
    }

    if (result) {
      this.ngxLoader.stopBackground();
      return;
    }

    this.fillApplication();
    if (this.applicationId != null) {
      this.subscriptions.add(this.claimService.updateClaim(this.applicationId, this.application)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('', '?????????????? ??????????????????');
            this.util.navigateByUrl(`/create-claim-view/` + this.applicationId)
          }
        }, err => {
          this.ngxLoader.stopBackground();
          this.notifyService.showWarning('', err?.ru);
        }));
    } else {
      if (this.existsClient) {
        setTimeout(()=> {
          this.subscriptions.add(this.claimService.saveClaim(this.application)
            .subscribe(data => {
              if (data != null) {
                this.saved = true;
                this.util.navigateByUrl(`/create-claim-view/` + data)
                this.notifyService.showSuccess('', '?????????????? ??????????????????');
              }
            }, err => {
              this.ngxLoader.stopBackground();
              if (err?.ru.includes('???? ??????????????????????')) {
                this.modal.open(this.modalContent, {size: 'sm'});
              } else {
                this.notifyService.showWarning('', err?.ru);
              }
            }));
        }, 1000)
      }
    }
    this.ngxLoader.stopBackground();
  }

  hasShowGroup(operation: any) {
    if (this.util.isNullOrEmpty(this.applicationId)) {
      return false;
    } else {
      if (!this.util.isNullOrEmpty(this.operationList)) {
        for (const data of this.operationList) {
          if (!this.util.isNullOrEmpty(data)) {
            if (operation.includes(data)) {
              return false;
            }
          }
        }
      }
    }
    return true
  }

  toStringCompare(data: any) {
    return data?.toString();
  }

  hasUpdateRole() {
    if (!this.util.isNullOrEmpty(this.operationList)) {
      for (const operation of this.operationList) {
        if (operation.includes("UPDATE_")) {
          return true;
        }
      }
    }
    return false;
  }

  reassignApplication() {
    this.ngxLoader.startBackground();
    let data = {};

    if (this.util.isNullOrEmpty(this.applicationForm.value.agent)) {
      this.ngxLoader.stopBackground();
      this.notifyService.showInfo('?????? ???????????????????????????? ?????????? ?????????????? ????????????', '????????????????????');
      return;
    }
    if (this.applicationId) {
      data['agent'] = this.applicationForm.value.agent;
      data['applicationId'] = this.applicationId;

      this.subscriptions.add(this.claimService.reassignApplication(data)
        .subscribe(res => {
            this.notifyService.showInfo('??????????????????????????', '????????????????????');
          }, error => {
            this.notifyService.showError('', error?.ru);
          }
        ))
    }
    this.ngxLoader.stopBackground();
  }

  cancel() {
    if (this.edit) {
      this.saved = false;
      this.canDeactivate();
    }
    this.util.dnHref('home');
  }

  showHideHeader(id: any) {
    if (id == 'headerDeal') {
      this.headerDeal = !this.headerDeal;
    }
    if (id == 'clientDeal') {
      this.clientDeal = !this.clientDeal;
    }
    if (id == 'aboutObject') {
      this.aboutObject = !this.aboutObject;
    }
    if (id == 'aboutPhoto') {
      this.aboutPhoto = !this.aboutPhoto;
    }
    if (id == 'aboutMap') {
      this.aboutMap = !this.aboutMap;
    }
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (!this.saved) {
      let result = confirm("???? ???????????? ???????????????? ?????????????????");
      if (result && !this.applicationId) {
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
    this.isUpload = true;
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.selectedFile = event.target.files[i];
        this.subscriptions.add(this.uploader.uploadData(this.selectedFile)
          .subscribe(data => {
            if (data && data.message) {
              this.percent = data.message;
            }
            if (data && data.uuid) {
              this.filesEdited = true;
              this.fillPicture(data, id);
              this.isUpload = false;
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

  getMap() {
    setTimeout(() => {
      if (!this.util.isNullOrEmpty(this.modelMap)) {
        this.loadMap();
      }
    }, 1000)
  }

  loadMap() {
    if (!this.util.isNullOrEmpty(this.applicationForm.postcode)) {
      let str = '';
      if(!this.util.isNullOrEmpty(this.applicationForm.postcode.label)){
         str = this.applicationForm.postcode?.label;
      }else {
        str = this.applicationForm.postcode;
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
      this.modelMap.instance.search(this.applicationForm.postcode?.label).then(data => {
        this.ddd.geometry.setCoordinates([data.responseMetaData.SearchResponse.Point.coordinates[1], data.responseMetaData.SearchResponse.Point.coordinates[0]])
        this.applicationForm.latitude = data.responseMetaData.SearchResponse.Point.coordinates[1];
        this.applicationForm.longitude = data.responseMetaData.SearchResponse.Point.coordinates[0];
      });
      this.ngxLoader.startBackground()
      this.subscriptions.add(this.kazPostService.checkPostData(this.applicationForm.postcode?.fullAddress)
        .subscribe(res => {
          this.postCode = this.applicationForm.postcode?.value;
          this.loadDictionary();
          this.subscriptions.add(this.newDicService.getResidentialComplexesByPostcode(this.postCode)
            .subscribe(result => {
              if (result) {
                this.applicationForm.residentialComplexId = this.util.getDictionaryValueById(this.residentialComplexes, result.buildingDto.residentialComplexId);
              }
            }));
          setTimeout(() => {
            // this.loadMap()
            this.applicationForm.cityId = res.city?.id;
            this.applicationForm.streetId = res.street?.id;
            this.applicationForm.districts = res.district?.id;
            this.applicationForm.houseNumber = res.houseNumber;
            if(!this.applicationId) {
              this.showModalChooseClaim();
            }
            this.ngxLoader.stopBackground();
          }, 1000);
        }, () => this.ngxLoader.stopBackground()));
    }
  }

  showModalChooseClaim() {
    if (!this.isBuy() || !this.edit) return;
    let objNumber;
    if (this.isApartment()) {
      objNumber = this.applicationForm.apartmentNumber;
    } else if (this.isHouse()) {
      objNumber = null;
    }
    if (!this.util.isNullOrEmpty(this.postCode)) {
      this.subscriptions.add(
        this.claimService.getApartmentByNumberAndPostcode(objNumber, this.postCode).subscribe(res => {
        }, err => {
          if (err) {
            this.modal.open(this.modalContent, {size: 'sm'});
          }
        })
      );
    }
    this.cdRef.detectChanges();
  }

  isShowAdvanceAgreement() {
    return this.util.isNullOrEmpty(this.contractDto?.contractNumber);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openModal(template: TemplateRef<any>,dicName: string) {
    this.dicName = dicName;
    if (dicName == 'residentialComplexes'){
      this.resident = true;
    } else {
      this.resident = false;
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

  closeModalContent() {
    this.modal.dismissAll();
    this.applicationForm.reset();
  }

   submitModal() {
    this.ngxLoader.startBackground();
    if (this.resident == true) {
      if (this.util.isNullOrEmpty(this.formRes.buildingDto.cityId) || this.util.isNullOrEmpty(this.formRes.buildingDto.streetId) || this.util.isNullOrEmpty(this.formRes.buildingDto.houseNumber)
        || this.util.isNullOrEmpty(this.formRes.houseName)) {
        this.notifyService.showError('????????????????????, ?????????????????? ?????? ????????', "");
        return;
      }
      let saveForm = {
        dictionaryName: this.dicName,
        nameEn: this.formRes.houseName,
        nameKz: this.formRes.houseName,
        nameRu: this.formRes.houseName,
        parentId: null,
        id: null
      };
      this.subscriptions.add(this.dicService.saveResidentalComplex(this.formRes).subscribe(data => {
          if (data != null) {
            saveForm.id = data.id;
            this.loadDictionary();
            this.notifyService.showSuccess('success', '?????????????? ??????????????????');
            this.modalRef.hide();
            this.clearForm();
            setTimeout(() => {
              this.loadDictionary();
              this.applicationForm.residentialComplexId = data;
              this.applicationForm.residentialComplexId.value = data.id;
              this.applicationForm.residentialComplexId.label = data.houseName;
              this.ngxLoader.stopBackground();
            }, 300);
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.modalRef.hide();
          this.clearForm();
        }
      ));

    } else {
      if (this.util.isNullOrEmpty(this.formData.multiLang.nameRu)) {
        this.notifyService.showError('????????????????????, ?????????????????? ?????? ????????', "");
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
          saveForm.id = data;
          this.notifyService.showSuccess('success', '?????????????? ??????????????????');
          this.modalRef.hide();
          this.clearForm();
          setTimeout(() => {
            this.loadDictionary();
            this.ngxLoader.stopBackground();
          }, 300);
        }
      }, err => {
        this.notifyService.showError('warning', err.message);
        this.modalRef.hide();
        this.clearForm();
      }));
    }
  }

  changeTab(activeTab){
    this.activeTab = activeTab;
    this.router.navigate([], {
      queryParams: {
        activeTab: activeTab
      }
    });
  }

  checkPostData2() {

    if (!this.util.isNullOrEmpty(this.postcode2?.fullAddress)) {
      this.ngxLoader.startBackground();

      this.subscriptions.add(this.kazPostService.checkPostData(this.postcode2?.fullAddress).subscribe(res => {
        this.formRes.buildingDto.postcode = this.postcode2?.value;
        setTimeout(() => {
          this.loadDictionary();
          this.formRes.buildingDto.cityId = res.city.id;
          this.formRes.buildingDto.districtId = res.district.id;
          this.formRes.buildingDto.streetId = res.street.id;
          this.formRes.buildingDto.houseNumber = res.houseNumber;
          this.ngxLoader.stopBackground();

        }, 300);
      }));
    }
  }

  expandedBlock() {
    this.expandBlock = !this.expandBlock;
  }
}
