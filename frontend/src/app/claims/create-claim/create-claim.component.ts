import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {BsLocaleService} from "ngx-bootstrap";
import {OwnerService} from "../../services/owner.service";
import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "../../canDeactivate/componentCanDeactivate";

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent implements OnInit, ComponentCanDeactivate {
  _language = language;
  application: ApplicationDto;
  xVal: string;
  selectedFile: File;
  loading = false;
  photo: any[] = ["3a774224-e85e-4d56-8341-cc3fe892195c", "1cebd27e-6872-4468-b4cd-3f36b605fd80"];
  operationType: Dic[];
  objectType: Dic[];
  city: Dic[];
  districts: Dic[];
  parkingTypes: Dic[];
  streets: Dic[];
  residentialComplexes: Dic[];
  realProperties: Dic[];
  propertyDevelopers: Dic[];
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
              private ownerService: OwnerService) {
    this.config.notFoundText = 'Данные не найдены';
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  get f() {
    return this.applicationForm.controls;
  }

  ngOnInit(): void {
    this.applicationForm = this.formBuilder.group({
      id: ['', Validators.nullValidator],
      surname: ['', Validators.required],
      firstName: ['', Validators.required],
      patronymic: ['', Validators.nullValidator],
      clientId: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.nullValidator],
      operationTypeId: ['', Validators.required],
      objectTypeId: ['', Validators.required],
      objectPrice: ['', Validators.required],
      objectPriceFrom: ['', Validators.nullValidator],
      objectPriceTo: ['', Validators.nullValidator],
      mortgage: ['', Validators.required],
      encumbrance: ['', Validators.required],
      exchange: ['', Validators.required],
      sharedOwnershipProperty: ['', Validators.required],
      gender: ['', Validators.nullValidator],
      cityId: ['', Validators.required],
      residentialComplexId: ['', Validators.nullValidator],
      streetId: ['', Validators.required],
      houseNumber: ['', Validators.required],
      numberOfRooms: ['', Validators.required],
      totalArea: ['', Validators.required],
      livingArea: ['', Validators.required],
      kitchenArea: ['', Validators.required],
      balconyArea: ['', Validators.required],
      ceilingHeight: ['', Validators.required],
      numberOfBedrooms: ['', Validators.required],
      atelier: ['', Validators.nullValidator],
      separateBathroom: ['', Validators.nullValidator],
      districtId: ['', Validators.required],
      numberOfFloors: ['', Validators.nullValidator],
      apartmentsOnTheSite: ['', Validators.nullValidator],
      materialOfConstructionId: ['', Validators.nullValidator],
      yearOfConstruction: ['', Validators.nullValidator],
      typeOfElevatorList: [[], Validators.nullValidator],
      concierge: ['', Validators.nullValidator],
      wheelchair: ['', Validators.nullValidator],
      playground: ['', Validators.nullValidator],
      yardTypeId: ['', Validators.nullValidator],
      parkingTypeId: ['', Validators.nullValidator],
      probabilityOfBidding: ['', Validators.nullValidator],
      theSizeOfTrades: ['', Validators.nullValidator],
      possibleReasonForBiddingIdList: ['', Validators.nullValidator],
      note: ['', Validators.nullValidator],
      contractPeriod: ['', Validators.nullValidator],
      isCommissionIncludedInThePrice: ['', Validators.nullValidator],
      amount: ['', Validators.nullValidator],
      cadastralNumber: ['', Validators.nullValidator],
      propertyDeveloperId: ['', Validators.nullValidator],
      housingClass: ['', Validators.nullValidator],
      housingCondition: ['', Validators.nullValidator],
      numberOfApartments: ['', Validators.nullValidator],
      floorFrom: ['', Validators.nullValidator],
      floorTo: ['', Validators.nullValidator],
      numberOfRoomsFrom: ['', Validators.nullValidator],
      numberOfRoomsTo: ['', Validators.nullValidator],
      totalAreaFrom: ['', Validators.nullValidator],
      totalAreaTo: ['', Validators.nullValidator],
      livingAreaFrom: ['', Validators.nullValidator],
      livingAreaTo: ['', Validators.nullValidator],
      kitchenAreaFrom: ['', Validators.nullValidator],
      kitchenAreaTo: ['', Validators.nullValidator],
      balconyAreaFrom: ['', Validators.nullValidator],
      balconyAreaTo: ['', Validators.nullValidator],
      ceilingHeightFrom: ['', Validators.nullValidator],
      ceilingHeightTo: ['', Validators.nullValidator],
      numberOfBedroomsFrom: ['', Validators.nullValidator],
      numberOfBedroomsTo: ['', Validators.nullValidator],
    });

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

  onFileChanged(event, id: number) {
    this.selectedFile = event.target.files[0];
    this.loading = true;
    console.log(this.photo)
    this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data != null) {
          if (id == 1) {
            this.photo.push(data)
          }
        }
      });
    this.loading = false;
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

  submit() {
    this.application = this.applicationForm.value;
    this.application.operationTypeId = this.applicationForm.operationTypeId?.value;
    this.application.residentialComplexId = this.applicationForm.residentialComplexId?.value;
    this.application.photoIdList = this.photo;
    console.log(this.application)
    if (!this.util.isNullOrEmpty(this.application.cadastralNumber)) {
      if (this.application.cadastralNumber.length != 16) {
        this.notifyService.showError("Ошибка", "Длина поле кадастровый номер не верно");
        return;
      }
    }
    if (!this.util.isNullOrEmpty(this.application.parkingTypeId)) {
      console.log(this.application.parkingTypeId.indexOf("1"))
      if (this.application.parkingTypeId.indexOf("1") == 0) {
        this.application.parkingTypeId = [];
        this.application.parkingTypeId.push("1");
      }
    }

    const controls = this.applicationForm.controls;
    // for (const name in controls) {
    //   if (controls[name].invalid) {
    //     this.translate.get('claim.operation').subscribe((text: string) => {
    //       this.notifyService.showInfo("Ошибка", "Поле " + name + " не заполнено!!!");
    //     });
    //     return
    //   }
    // }


    // this.loading = true;
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
      return confirm("Вы хотите покинуть страницу?");
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

}
