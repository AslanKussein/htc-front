import {ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {ApplicationDto} from "../../models/applicationDto";
import {Util} from "../../services/util";
import {NotificationService} from "../../services/notification.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClaimService} from "../../services/claim.service";
import {NgSelectConfig} from "@ng-select/ng-select";
import {UploaderService} from "../../services/uploader.service";
import {DicService} from "../../services/dic.service";
import {Dic} from "../../models/dic";
import {language} from "../../../environments/language";
import {TranslateService} from "@ngx-translate/core";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ruLocale} from "ngx-bootstrap/locale";
import {BsLocaleService, BsModalRef, BsModalService} from "ngx-bootstrap";
import {OwnerService} from "../../services/owner.service";
import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "../../canDeactivate/componentCanDeactivate";
import {ModalDirective} from "angular-bootstrap-md";
import {ConfigService} from "../../services/config.service";

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent implements OnInit, ComponentCanDeactivate {

  @ViewChild('showHideModal')
  public modalActAgree: ModalDirective;

  _language = language;
  application: ApplicationDto;
  xVal: string;
  selectedFile: File;
  loading = false;
  photoList: any[] = [];
  photoPlanList: any[] = [];
  photo3DList: any[] = [];
  imgSrc: Observable<string>;
  // photo: any[] = [
  //   "1", "2","3", "4",
  //   "5", "6","7", "8",
  //   "9", "10","11", "12"
  // ];
  operationType: Dic[];
  objectType: Dic[];
  city: Dic[];
  districts: Dic[];
  parkingTypes: Dic[];
  streets: Dic[];
  residentialComplexes: Dic[];
  realProperties: Dic[];
  propertyDevelopers: Dic[];
  heatingSystems: Dic[];
  sewerageSystems: Dic[];
  countries: Dic[];
  materials: Dic[];
  roomCountDic: Dic[];
  possibleReasonForBidding: Dic[];
  applicationForm: any;
  showModalWin: boolean = false;
  image: any;
  dicDynamic: Dic[];
  elevatorType: Dic[];
  yardTypes: Dic[];
  readonlyChooseJK: boolean = false;
  saved: boolean = false;

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
              private cdRef: ChangeDetectorRef) {
    this.config.notFoundText = 'Данные не найдены';
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  get f() {
    return this.applicationForm.controls;
  }

  ngOnInit(): void {
    this.applicationForm = this.formBuilder.group({
      id: [null, Validators.nullValidator],
      operationTypeId: ['', Validators.required],
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
    });
    this.cdRef.detectChanges();
    this.loadDictionary();
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
    this.dicService.getDics('residentialComplexes').subscribe(data => {
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

  setResidenceComplexType() {
    this.applicationForm.streetId = this.applicationForm.residentialComplexId?.streetId;//Улица
    this.applicationForm.houseNumber = this.applicationForm.residentialComplexId?.houseNumber;//Номер дома
    this.applicationForm.districtId = this.applicationForm.residentialComplexId?.districtId;//Район
    this.applicationForm.numberOfFloors = this.applicationForm.residentialComplexId?.numberOfFloors;//Этажность дома
    this.applicationForm.apartmentsOnTheSite = this.applicationForm.residentialComplexId?.apartmentsOnTheSite;//Кв. на площадке
    this.applicationForm.materialOfConstructionId = this.applicationForm.residentialComplexId?.materialOfConstructionId;//Материал
    this.applicationForm.yearOfConstruction = this.applicationForm.residentialComplexId?.yearOfConstruction;//Год постройки
    this.applicationForm.typeOfElevatorList = this.applicationForm.residentialComplexId?.yearOfConstruction;//Лифт
    this.applicationForm.concierge = this.applicationForm.residentialComplexId?.concierge;//Консьерж
    this.applicationForm.wheelchair = this.applicationForm.residentialComplexId?.wheelchair;//Колясочная
    this.applicationForm.parkingTypeId = this.applicationForm.residentialComplexId?.parkingTypeId;///Парковка
    this.applicationForm.yardTypeId = this.applicationForm.residentialComplexId?.yardType;//Двор
    this.applicationForm.playground = this.applicationForm.residentialComplexId?.playground;//Детская площадка
    this.applicationForm.propertyDeveloperId = this.applicationForm.residentialComplexId?.propertyDeveloperId;//Затройщик
    this.applicationForm.housingClass = this.applicationForm.residentialComplexId?.housingClass;//Класс жилья
    this.applicationForm.housingCondition = this.applicationForm.residentialComplexId?.housingCondition;//Состояния
    this.applicationForm.numberOfApartments = this.applicationForm.residentialComplexId?.numberOfApartments;//Кол-во кв
    this.readonlyChooseJK = !this.util.isNullOrEmpty(this.applicationForm.residentialComplexId);
  }

  getPhotoById(guid: string) {
    // console.log(guid)
    // this.uploader.getPhotoById(guid)
    //   .subscribe(data => {
    //     if (data != null) {
    //     }
    //   });
  }

  searchByPhone() {
    if (this.applicationForm.phoneNumber != null && this.applicationForm.phoneNumber.length == 10) {
      this.loading = true;
      this.ownerService.searchByPhone(this.applicationForm.phoneNumber)
        .subscribe(res => {
          console.log(res.content)
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

  showPhotoFull(xIndex: any) {
    this.image = xIndex;
    this.showModalWin = true;
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

  submit() {
    this.validate();

    const controls = this.applicationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        this.translate.get('claim.validator.' + name).subscribe((text: string) => {
          this.notifyService.showInfo("Ошибка", "Поле " + text + " не заполнено!!!");
        });
      }
    }

    this.application = this.applicationForm.value;

    if (!this.util.isNullOrEmpty(this.application.cadastralNumber)) {
      if (this.application.cadastralNumber.length != 16) {
        this.notifyService.showError("Ошибка", "Длина поле кадастровый номер не верно");
        return;
      }
    }

    this.application.operationTypeId = this.applicationForm.operationTypeId?.value;
    this.application.objectTypeId = this.applicationForm.objectTypeId?.value;
    if (!this.util.isNullOrEmpty(this.applicationForm.residentialComplexId?.value)) {
      this.application.residentialComplexId = this.applicationForm.residentialComplexId?.value;
    }
    for (const ph of this.photoList) {
      this.application.photoIdList.push(ph.guid);
    }
    for (const ph of this.photoPlanList) {
      this.application.housingPlanImageIdList.push(ph.guid);
    }

    console.log(this.application)

    if (!this.util.isNullOrEmpty(this.application.parkingTypeId)) {
      console.log(this.application.parkingTypeId.indexOf("1"))
      if (this.application.parkingTypeId.indexOf("1") == 0) {
        this.application.parkingTypeId = [];
        this.application.parkingTypeId.push("1");
      }
    }

    this.loading = true;
    this.claimService.saveClaim(this.application)
      .subscribe(data => {
        if (data != null) {
          // this.resumeModel = data;
          this.notifyService.showSuccess('success', 'Успешно сохранено');
        }
      }, err => {
        this.notifyService.showError('warning', err.message);
      });
    // this.loading = false;
    this.saved = true;
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (!this.saved) {
      let result = confirm("Вы хотите покинуть страницу?");
      console.log('result ', result)
      return result;
    } else {
      return true;
    }
  }

  validator() {
    let xResult = true, xColumn, xId;
    if (this.util.isNullOrEmpty(this.application.surname)) {
      xResult = false;
      xColumn = 'surname';
    }
    if (!xResult) {
      this.xVal = xColumn;
      this.notifyService.showError("Ошибка", "Поле " + xColumn + " не заполнено!!!")
      return xResult;
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
    obj['image'] = 'https://fm-htc.dilau.kz/download/' + guid.uuid + '/preview?access_token=' + this.util.getToken().access_token;
    // obj['image'] = fm.toString() + '/download/' + guid.uuid + '/preview?access_token=' + this.util.getToken().access_token;
    if (id == 1) {
      this.photoList.push(obj)
    } else if (id == 2) {
      this.photoPlanList.push(obj)
    } else if (id == 3) {
      this.photo3DList.push(obj)
    }
  }
}
