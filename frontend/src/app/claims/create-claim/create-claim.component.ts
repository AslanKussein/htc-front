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

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent implements OnInit {
  _language = language;
  application: ApplicationDto;
  xVal: string;
  selectedFile: File;
  loading = false;
  file: any;
  operationType: Dic[];
  objectType: Dic[];
  city: Dic[];
  districts: Dic[];
  parkingTypes: Dic[];
  streets: Dic[];
  residentialComplexes: Dic[];
  realProperties: Dic[];
  propertyOwners: Dic[];
  countries: Dic[];
  materials: Dic[];
  possibleReasonForBidding: Dic[];
  applicationForm: any;
  showModalWin: boolean = false;
  image: any;
  dicDynamic: Dic[];
  dic: Dic;

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
      materialOfConstruction: ['', Validators.nullValidator],
      yearOfConstruction: ['', Validators.nullValidator],
      typeOfElevator: ['', Validators.nullValidator],
      concierge: ['', Validators.nullValidator],
      wheelchair: ['', Validators.nullValidator],
      playground: ['', Validators.nullValidator],
      yardType: ['', Validators.nullValidator],
      parkingTypeId: ['', Validators.nullValidator],
      probabilityOfBidding: ['', Validators.nullValidator],
      theSizeOfTrades: ['', Validators.nullValidator],
      possibleReasonForBiddingId: ['', Validators.nullValidator],
    })

    this.loadDictionary();
  }

  loadDictionary() {
    this.dicService.getDics('operationType').subscribe(data => {
      this.operationType = this.util.toSelectArray(data);
    });
    this.dicService.getDics('objectType').subscribe(data => {
      this.objectType = this.util.toSelectArray(data);
    });
    this.dicService.getDics('city').subscribe(data => {
      this.city = this.util.toSelectArray(data);
    });
    this.dicService.getDics('districts').subscribe(data => {
      this.districts = this.util.toSelectArray(data);
    });
    this.dicService.getDics('parkingTypes').subscribe(data => {
      this.parkingTypes = this.util.toSelectArray(data);
    });
    this.dicService.getDics('streets').subscribe(data => {
      this.streets = this.util.toSelectArray(data);
    });
    this.dicService.getDics('residentialComplexes').subscribe(data => {
      this.residentialComplexes = this.util.toSelectArray(data);
    });
    this.dicService.getDics('possibleReasonForBidding').subscribe(data => {
      this.possibleReasonForBidding = this.util.toSelectArray(data);
    });
    this.dicService.getDics('countries').subscribe(data => {
      this.countries = this.util.toSelectArray(data);
    });
    this.dicService.getDics('materials').subscribe(data => {
      this.materials = this.util.toSelectArray(data);
    });
    this.loading = false;
    this.dicDynamic = [];
    this.dic = new Dic();
    this.dic.code = 'true';
    this.dic.nameEn = 'Да';
    this.dic.nameKz = 'Да';
    this.dic.nameRu = 'Да';
    this.dicDynamic.push(this.dic);
    this.dic = new Dic();
    this.dic.code = 'false';
    this.dic.nameEn = 'Нет';
    this.dic.nameKz = 'Нет';
    this.dic.nameRu = 'Нет';
    this.dicDynamic.push(this.dic);
    console.log(this.dicDynamic)
  }

  setOperationType(event) {
    console.log(this.applicationForm.operationTypeId)
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];

    this.loading = true;
    this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data != null) {
          this.file = data.fileBody;
        }
      });
    this.loading = false;
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
    this.claimService.saveClaim('{\n' +
      '  "amount": 0,\n' +
      '  "apartmentNumber": "string",\n' +
      '  "apartmentsOnTheSite": "string",\n' +
      '  "atelier": true,\n' +
      '  "balconyArea": 0,\n' +
      '  "balconyAreaFrom": 0,\n' +
      '  "balconyAreaTo": 0,\n' +
      '  "cadastralNumber": "string",\n' +
      '  "ceilingHeight": 0,\n' +
      '  "ceilingHeightFrom": 0,\n' +
      '  "ceilingHeightTo": 0,\n' +
      '  "cityId": 0,\n' +
      '  "clientId": 0,\n' +
      '  "commissionIncludedInThePrice": true,\n' +
      '  "concierge": true,\n' +
      '  "contractPeriod": "2020-04-02T16:45:06.072Z",\n' +
      '  "district": "string",\n' +
      '  "districtId": 0,\n' +
      '  "email": "string",\n' +
      '  "encumbrance": true,\n' +
      '  "exchange": true,\n' +
      '  "firstName": "string",\n' +
      '  "floor": 0,\n' +
      '  "floorFrom": 0,\n' +
      '  "floorTo": 0,\n' +
      '  "gender": "MALE",\n' +
      '  "houseNumber": 0,\n' +
      '  "houseNumberFraction": "string",\n' +
      '  "id": 0,\n' +
      '  "kitchenArea": 0,\n' +
      '  "kitchenAreaFrom": 0,\n' +
      '  "kitchenAreaTo": 0,\n' +
      '  "livingArea": 0,\n' +
      '  "livingAreaFrom": 0,\n' +
      '  "livingAreaTo": 0,\n' +
      '  "materialOfConstruction": "string",\n' +
      '  "mortgage": true,\n' +
      '  "note": "string",\n' +
      '  "numberOfBedrooms": 0,\n' +
      '  "numberOfBedroomsFrom": 0,\n' +
      '  "numberOfBedroomsTo": 0,\n' +
      '  "numberOfFloors": 0,\n' +
      '  "numberOfRooms": 0,\n' +
      '  "numberOfRoomsFrom": 0,\n' +
      '  "numberOfRoomsTo": 0,\n' +
      '  "objectPrice": 0,\n' +
      '  "objectPriceFrom": 0,\n' +
      '  "objectPriceTo": 0,\n' +
      '  "objectTypeId": 0,\n' +
      '  "operationTypeId": 0,\n' +
      '  "parkingTypeId": 0,\n' +
      '  "patronymic": "string",\n' +
      '  "phoneNumber": "string",\n' +
      '  "playground": true,\n' +
      '  "possibleReasonForBiddingId": 0,\n' +
      '  "probabilityOfBidding": true,\n' +
      '  "residentialComplexId": 0,\n' +
      '  "separateBathroom": true,\n' +
      '  "sharedOwnershipProperty": true,\n' +
      '  "street": "string",\n' +
      '  "streetId": 0,\n' +
      '  "surname": "string",\n' +
      '  "theSizeOfTrades": "string",\n' +
      '  "totalArea": 0,\n' +
      '  "totalAreaFrom": 0,\n' +
      '  "totalAreaTo": 0,\n' +
      '  "typeOfElevator": "string",\n' +
      '  "wheelchair": true,\n' +
      '  "yardType": "PRIVATE",\n' +
      '  "yearOfConstruction": 0\n' +
      '}')
      .subscribe(data => {
        if (data != null) {
          // this.resumeModel = data;
          this.notifyService.showSuccess('success', 'Успешно сохранено');
        }
      }, err => {
        this.notifyService.showError('warning', err.message);
      });
    // this.loading = false;
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
