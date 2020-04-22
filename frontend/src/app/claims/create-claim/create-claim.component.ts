import {ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {ApplicationDto} from "../../models/createClaim/applicationDto";
import {Util} from "../../services/util";
import {NotificationService} from "../../services/notification.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClaimService} from "../../services/claim.service";
import {NgSelectConfig} from "@ng-select/ng-select";
import {UploaderService} from "../../services/uploader.service";
import {DicService} from "../../services/dic.service";
import {Dic} from "../../models/dic";
import {TranslateService} from "@ngx-translate/core";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ruLocale} from "ngx-bootstrap/locale";
import {BsLocaleService, BsModalRef, BsModalService} from "ngx-bootstrap";
import {OwnerService} from "../../services/owner.service";
import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "../../canDeactivate/componentCanDeactivate";
import {ConfigService} from "../../services/config.service";
import {ModalComponent} from "./modal.window/modal.component";
import {RealPropertyRequestDto} from "../../models/createClaim/realPropertyRequestDto";
import {RealPropertyOwnerDto} from "../../models/createClaim/realPropertyOwnerDto";
import {PurchaseInfoDto} from "../../models/createClaim/purchaseInfoDto";
import {BigDecimalPeriod} from "../../models/common/bigDecimalPeriod";

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
  loading = false;
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
  sewerageSystems: Dic[];
  countries: Dic[];
  materials: Dic[];
  sortMaterials: Dic[] = [];
  roomCountDic: Dic[];
  possibleReasonForBidding: Dic[];
  applicationForm: any;
  image: any;
  dicDynamic: Dic[];
  elevatorType: Dic[];
  yardTypes: Dic[];
  readonlyChooseJK: boolean = false;
  saved: boolean = false;
  modalRef: BsModalRef;

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
              private modalService: BsModalService) {
    this.config.notFoundText = 'Данные не найдены';
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  get f() {
    return this.applicationForm.controls;
  }

  ngOnInit(): void {
    this.loading = true;
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
      ownerDto: [new RealPropertyOwnerDto(), Validators.nullValidator],
      purchaseInfoDto: [new PurchaseInfoDto(), Validators.nullValidator],
    });
    this.cdRef.detectChanges();
    this.loadDictionary();
    this.loading = false;
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
      this.parkingTypes = this.util.toSelectArray(data);
    });
    this.dicService.getDics('STREETS').subscribe(data => {
      this.streets = this.util.toSelectArray(data);
    });
    this.dicService.getResidentialComplexes().subscribe(data => {
      this.residentialComplexes = this.util.toSelectArrayResidenceComplex(data);
    });
    this.dicService.getDics('POSSIBLE_REASONS_FOR_BIDDING').subscribe(data => {
      this.possibleReasonForBidding = this.util.toSelectArray(data);
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
    this.roomCountDic = this.util.roomCountDictionary();
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
    // this.applicationForm.parkingTypeId = [this.applicationForm.residentialComplexId?.parkingTypeId];///Парковка
    this.applicationForm.parkingTypeId = [1];///Парковка
    this.applicationForm.yardTypeId = this.applicationForm.residentialComplexId?.yardTypeId;//Двор
    this.applicationForm.playground = this.applicationForm.residentialComplexId?.playground;//Детская площадка
    this.applicationForm.propertyDeveloperId = this.applicationForm.residentialComplexId?.propertyDeveloperId;//Затройщик
    this.applicationForm.housingClass = this.applicationForm.residentialComplexId?.housingClass;//Класс жилья
    this.applicationForm.housingCondition = this.applicationForm.residentialComplexId?.housingCondition;//Состояния
    this.applicationForm.numberOfApartments = this.applicationForm.residentialComplexId?.numberOfApartments;//Кол-во кв
    this.readonlyChooseJK = !this.util.isNullOrEmpty(this.applicationForm.residentialComplexId);
  }

  searchByPhone() {
    if (this.applicationForm.phoneNumber != null && this.applicationForm.phoneNumber.length == 10) {
      this.loading = true;
      this.ownerService.searchByPhone('7' + this.applicationForm.phoneNumber)
        .subscribe(res => {
          this.applicationForm.clientId = res.id;
          this.applicationForm.firstName = res.firstName;
          this.applicationForm.surname = res.surname;
          this.applicationForm.patronymic = res.patronymic;
          this.applicationForm.phoneNumber = res.phoneNumber;
          this.applicationForm.email = res.email;
          this.applicationForm.gender = res.gender;
        });
      this.loading = false;
    }
  }

  searchByClientId() {
    if (this.applicationForm.clientId != null && this.applicationForm.clientId.length == 10) {
      this.loading = true;
      this.ownerService.searchByClientId(this.applicationForm.clientId)
        .subscribe(res => {
          console.log(res.content)
        });
      this.loading = false;
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
        if (this.util.isNullOrEmpty(this.applicationForm?.residentialComplexId)) {
          this.applicationForm.controls['streetId'].setValidators([Validators.required]);
          this.applicationForm.controls["streetId"].updateValueAndValidity();
          this.applicationForm.controls['houseNumber'].setValidators([Validators.required]);
          this.applicationForm.controls["houseNumber"].updateValueAndValidity();
          this.applicationForm.controls['ceilingHeight'].setValidators([Validators.required]);
          this.applicationForm.controls["ceilingHeight"].updateValueAndValidity();
          this.applicationForm.controls['districtId'].setValidators([Validators.required]);
          this.applicationForm.controls["districtId"].updateValueAndValidity();
        } else {
          this.applicationForm.controls['streetId'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["streetId"].updateValueAndValidity();
          this.applicationForm.controls['houseNumber'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["houseNumber"].updateValueAndValidity();
          this.applicationForm.controls['ceilingHeight'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["ceilingHeight"].updateValueAndValidity();
          this.applicationForm.controls['districtId'].setValidators([Validators.nullValidator]);
          this.applicationForm.controls["districtId"].updateValueAndValidity();
        }
        this.applicationForm.controls['objectPrice'].setValidators([Validators.required]);
        this.applicationForm.controls["objectPrice"].updateValueAndValidity();
        this.applicationForm.controls['numberOfRooms'].setValidators([Validators.required]);
        this.applicationForm.controls["numberOfRooms"].updateValueAndValidity();
        this.applicationForm.controls['totalArea'].setValidators([Validators.required]);
        this.applicationForm.controls["totalArea"].updateValueAndValidity();
        this.applicationForm.controls['livingArea'].setValidators([Validators.required]);
        this.applicationForm.controls["livingArea"].updateValueAndValidity();
        this.applicationForm.controls['kitchenArea'].setValidators([Validators.required]);
        this.applicationForm.controls["kitchenArea"].updateValueAndValidity();
        this.applicationForm.controls['ceilingHeight'].setValidators([Validators.required]);
        this.applicationForm.controls["ceilingHeight"].updateValueAndValidity();
        this.applicationForm.controls['numberOfBedrooms'].setValidators([Validators.required]);
        this.applicationForm.controls["numberOfBedrooms"].updateValueAndValidity();
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
        this.applicationForm.controls['kitchenArea'].setValidators([Validators.required]);
        this.applicationForm.controls["kitchenArea"].updateValueAndValidity();
      }
    }
  }

  fillApplication() {
    this.application = new ApplicationDto();
    this.application.operationTypeId = this.applicationForm.operationTypeId?.value;
    this.application.mortgage = this.applicationForm.mortgage;
    this.application.encumbrance = this.applicationForm.encumbrance;
    this.application.sharedOwnershipProperty = this.applicationForm.sharedOwnershipProperty;
    this.application.exchange = this.applicationForm.exchange;
    this.application.probabilityOfBidding = this.applicationForm.probabilityOfBidding;
    this.application.theSizeOfTrades = this.applicationForm.theSizeOfTrades;
    this.application.possibleReasonForBiddingIdList = this.applicationForm.possibleReasonForBiddingIdList;
    this.application.contractPeriod = this.applicationForm.contractPeriod;
    this.application.amount = this.applicationForm.amount;
    this.application.isCommissionIncludedInThePrice = this.applicationForm.isCommissionIncludedInThePrice;
    this.application.note = this.applicationForm.note;
  }

  fillPurchaseInfoDto() {
    this.application.realPropertyRequestDto.purchaseInfoDto = new PurchaseInfoDto();
    this.application.realPropertyRequestDto.purchaseInfoDto.objectPricePeriod = new BigDecimalPeriod(this.applicationForm?.objectPriceFrom, this.applicationForm?.objectPriceTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.numberOfFloorsPeriod = new BigDecimalPeriod(this.applicationForm?.numberOfFloorsFrom, this.applicationForm?.numberOfFloorsTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.floorPeriod = new BigDecimalPeriod(this.applicationForm?.floorFrom, this.applicationForm?.floorTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.numberOfRoomsPeriod = new BigDecimalPeriod(this.applicationForm?.numberOfRoomsFrom, this.applicationForm?.numberOfRoomsTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.totalAreaPeriod = new BigDecimalPeriod(this.applicationForm?.totalAreaFrom, this.applicationForm?.totalAreaTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.livingAreaPeriod = new BigDecimalPeriod(this.applicationForm?.livingAreaFrom, this.applicationForm?.livingAreaTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.kitchenAreaPeriod = new BigDecimalPeriod(this.applicationForm?.kitchenAreaFrom, this.applicationForm?.kitchenAreaTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.balconyAreaPeriod = new BigDecimalPeriod(this.applicationForm?.balconyAreaFrom, this.applicationForm?.balconyAreaTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.ceilingHeightPeriod = new BigDecimalPeriod(this.applicationForm?.ceilingHeightFrom, this.applicationForm?.ceilingHeightTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.numberOfBedroomsPeriod = new BigDecimalPeriod(this.applicationForm?.numberOfBedroomsFrom, this.applicationForm?.numberOfBedroomsTo);
    this.application.realPropertyRequestDto.purchaseInfoDto.landAreaPeriod = new BigDecimalPeriod(this.applicationForm?.landAreaFrom, this.applicationForm?.landAreaTo);
  }

  fillRealPropertyRequestDto() {
    this.application.realPropertyRequestDto = new RealPropertyRequestDto();
    this.application.realPropertyRequestDto.objectTypeId = this.applicationForm.objectTypeId?.value;
    this.application.realPropertyRequestDto.cityId = this.applicationForm.cityId;
    this.application.realPropertyRequestDto.cadastralNumber = this.applicationForm.cadastralNumber;
    this.application.realPropertyRequestDto.residentialComplexId = this.applicationForm.residentialComplexId?.value;
    this.application.realPropertyRequestDto.streetId = this.applicationForm.streetId;
    this.application.realPropertyRequestDto.houseNumber = this.applicationForm.houseNumber;
    this.application.realPropertyRequestDto.houseNumberFraction = this.applicationForm.houseNumberFraction;
    this.application.realPropertyRequestDto.floor = this.applicationForm.floor;
    this.application.realPropertyRequestDto.apartmentNumber = this.applicationForm.houseNumber
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
    for (const ph of this.photoList) {
      this.application.realPropertyRequestDto.photoIdList = [];
      this.application.realPropertyRequestDto.photoIdList.push(ph.guid);
    }
    for (const ph of this.photoPlanList) {
      this.application.realPropertyRequestDto.housingPlanImageIdList = [];
      this.application.realPropertyRequestDto.housingPlanImageIdList.push(ph.guid);
    }
    for (const ph of this.photo3DList) {
      this.application.realPropertyRequestDto.virtualTourImageIdList = [];
      this.application.realPropertyRequestDto.virtualTourImageIdList.push(ph.guid);
    }
    this.application.realPropertyRequestDto.sewerageId = this.applicationForm.sewerageId;
    this.application.realPropertyRequestDto.heatingSystemId = this.applicationForm.heatingSystemId;
    this.application.realPropertyRequestDto.numberOfApartments = this.applicationForm.numberOfApartments;
    this.application.realPropertyRequestDto.landArea = this.applicationForm.landArea;
  }

  fillRealPropertyOwnerDto(data: any) {
    this.application.ownerDto = new RealPropertyOwnerDto();
    this.application.ownerDto.id = data.clientId;
    this.application.ownerDto.firstName = data.firstName;
    this.application.ownerDto.surname = data.surname;
    this.application.ownerDto.patronymic = data.patronymic;
    this.application.ownerDto.phoneNumber = '7' + data.phoneNumber;
    this.application.ownerDto.email = data.email;
    this.application.ownerDto.gender = data.gender;
  }

  submit() {
    this.validate();

    this.fillApplication();
    this.fillRealPropertyRequestDto();
    this.fillRealPropertyOwnerDto(this.applicationForm);
    if (this.applicationForm?.operationTypeId?.code == '001001') {
      this.fillPurchaseInfoDto();
    }

    console.log(this.application.ownerDto)

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

    if (!this.util.isNullOrEmpty(this.applicationForm?.cadastralNumber)) {
      if (this.applicationForm?.cadastralNumber.length != 16) {
        this.notifyService.showError("Ошибка", "Длина поле кадастровый номер не верно");
        return;
      }
    }

    if (!this.util.isNullOrEmpty(this.application.realPropertyRequestDto.parkingTypeId)) {
      if (this.application.realPropertyRequestDto.parkingTypeId.indexOf("1") == 0) {
        this.application.realPropertyRequestDto.parkingTypeId = [];
        this.application.realPropertyRequestDto.parkingTypeId.push("1");
      }
    }

    this.loading = true;
    this.claimService.saveClaim(this.application)
      .subscribe(data => {
        if (data != null) {
          // this.resumeModel = data;
          this.saved = true;
          this.notifyService.showSuccess('success', 'Успешно сохранено');
        }
      }, err => {
        this.notifyService.showWarning('warning', err);
      });
    this.loading = false;
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

  removePhoto(data: any) {
    for (const element of data) {
      this.uploader.removePhotoById(element.guid)
        .subscribe(data => {
        });
    }
  }

  onFileChanged(event, id: number) {
    this.selectedFile = event.target.files[0];
    this.loading = true;
    this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data != null) {
          this.fillPicture(data, id);
        }
      });
    this.loading = false;
  }

  fillPicture(guid: any, id: number) {
    let fm = `${this.configService.apiFileManagerUrl}`;
    let obj = {};
    obj['guid'] = guid.uuid;
    obj['image'] = 'https://fm-htc.dilau.kz/download/' + guid.uuid + '/preview?access_token=' + this.util.getCurrentUser().access_token;
    obj['fullImage'] = 'https://fm-htc.dilau.kz/download/' + guid.uuid + '?access_token=' + this.util.getCurrentUser().access_token;
    if (id == 1) {
      this.photoList.push(obj)
    } else if (id == 2) {
      this.photoPlanList.push(obj)
    } else if (id == 3) {
      this.photo3DList.push(obj)
    }
  }
}
