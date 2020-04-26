import {Component, OnInit, TemplateRef} from '@angular/core';
import {DicService} from "../services/dic.service";
import {Dic} from "../models/dic";
import {Util} from "../services/util";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ruLocale} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap/chronos";
import {BsLocaleService} from "ngx-bootstrap";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-dic-control',
  templateUrl: './dic-control.component.html',
  styleUrls: ['./dic-control.component.scss']
})
export class DicControlComponent implements OnInit {
  modalRef: BsModalRef;
  dictionary: Dic[];
  countries: Dic[];
  cities: Dic[];
  districts: Dic[];
  streets: Dic[];
  propertyDevelopers: Dic[];
  materialsOfConstruction: Dic[];
  residentialComplexes: Dic[];
  typeOfElevator: Dic[];
  parkingTypes: Dic[];
  yardTypes: Dic[];
  resident: boolean;
  editOrDelete: boolean;
  actions: string;
  dicName: string;
  clickColumnDic: any;

  constructor(private util: Util,
              private modalService: BsModalService,
              private localeService: BsLocaleService,
              private notifyService: NotificationService,
              private dicService: DicService) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }


  formData = {
    code: '',
    nameEn: '',
    nameRu: '',
    nameKz: '',
  };

  formRes = {
    apartmentsOnTheSite: '',
    ceilingHeight: null,
    cityId: null,
    concierge: false,
    districtId: null,
    houseName: '',
    houseNumber: null,
    houseNumberFraction: '',
    housingClass: '',
    housingCondition: '',
    materialOfConstructionId: null,
    numberOfApartments: 0,
    numberOfEntrances: 0,
    numberOfFloors: 0,
    parkingTypeIds: null,
    playground: false,
    propertyDeveloperId: null,
    streetId: 0,
    typeOfElevatorIdList: [],
    wheelchair: false,
    yardTypeId: null,
    countryId: null,
    yearOfConstruction: 0
  };

  clearForm() {
    this.formData = {
      code: '',
      nameEn: '',
      nameRu: '',
      nameKz: '',
    };

    this.formRes = {
      apartmentsOnTheSite: '',
      ceilingHeight: null,
      cityId: null,
      concierge: false,
      districtId: null,
      houseName: '',
      houseNumber: null,
      houseNumberFraction: '',
      housingClass: '',
      housingCondition: '',
      materialOfConstructionId: null,
      numberOfApartments: 0,
      numberOfEntrances: 0,
      numberOfFloors: 0,
      parkingTypeIds: null,
      playground: false,
      propertyDeveloperId: null,
      streetId: 0,
      typeOfElevatorIdList: [],
      wheelchair: false,
      yardTypeId: null,
      countryId: null,
      yearOfConstruction: 0
    };

    this.clickColumnDic = null;

  }

  ngOnInit(): void {
    this.loadDictionary();
    this.loadDictionaryForEdit('residential-complexes');
    this.resident = true;
  }

  openModal(template: TemplateRef<any>) {
    console.log(template)
    this.modalRef = this.modalService.show(template);
  }

  loadDictionary() {
    this.dicService.getDics('COUNTRIES').subscribe(data => {
      this.countries = this.util.toSelectArray(data);
    });
    this.dicService.getDics('CITIES').subscribe(data => {
      this.cities = this.util.toSelectArray(data);
    });
    this.dicService.getDics('DISTRICTS').subscribe(data => {
      this.districts = this.util.toSelectArray(data);
    });
    this.dicService.getDics('STREETS').subscribe(data => {
      this.streets = this.util.toSelectArray(data);
    });
    this.dicService.getDics('PROPERTY_DEVELOPERS').subscribe(data => {
      this.propertyDevelopers = this.util.toSelectArray(data);
    });
    this.dicService.getDics('MATERIALS_OF_CONSTRUCTION').subscribe(data => {
      this.materialsOfConstruction = this.util.toSelectArray(data);
    });
    this.dicService.getDics('TYPE_OF_ELEVATOR').subscribe(data => {
      this.typeOfElevator = this.util.toSelectArray(data);
    });
    this.dicService.getDics('PARKING_TYPES').subscribe(data => {
      this.parkingTypes = this.util.toSelectArray(data);
    });
    this.dicService.getDics('YARD_TYPES').subscribe(data => {
      this.yardTypes = this.util.toSelectArray(data);
    });

  }

  loadDictionaryForEdit(dic) {
    this.dicName = dic;
    if (dic == 'residential-complexes') {
      this.dicService.getResidentialComplexes().subscribe(data => {
        this.residentialComplexes = this.util.toSelectArrayResidenceComplex(data);
      });
    } else {
      this.dicService.getDics(dic).subscribe(data => {
        this.dictionary = data;
      });
    }
    this.clickColumnDic = null;
  }

  addDic() {
    this.actions = 'ADD';
  }

  editDic() {
    this.actions = 'EDIT';
    if (this.clickColumnDic == null) {
      this.notifyService.showError('warning', 'Не выбрана запись для редактирования');
      this.modalRef.hide();
    } else {
      if (this.dicName == 'residential-complexes') {
        this.formRes = this.clickColumnDic;
      } else {
        this.formData = this.clickColumnDic;
      }
    }
  }

  deleteDic() {
    if (this.clickColumnDic == null) {
      this.notifyService.showError('warning', 'Не выбрана запись для удаления');
      this.modalRef.hide();
    } else {
      if (this.dicName == 'residential-complexes') {
        this.formRes = this.clickColumnDic;
      } else {
        this.formData = this.clickColumnDic;
      }
    }
  }

  deleteById(){
    if (this.dicName == 'residential-complexes') {
      this.dicService.deleteResidentalComplex(this.clickColumnDic).subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.loadDictionaryForEdit(this.dicName);///////////////
            this.modalRef.hide();
            this.clearForm();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.loadDictionaryForEdit(this.dicName);
          this.modalRef.hide();
          this.clearForm();
        }
      );
    }else{
      this.dicService.deleteDic(this.clickColumnDic,this.dicName).subscribe(data => {
          if (data == null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.loadDictionaryForEdit(this.dicName);
            this.modalRef.hide();
            this.clearForm();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.loadDictionaryForEdit(this.dicName);
          this.modalRef.hide();
          this.clearForm();
        }
      );
    }
  }

  submit() {
    if (this.actions == 'ADD') {
      if (this.dicName == 'residential-complexes') {
        this.dicService.saveResidentalComplex(this.formRes).subscribe(data => {
            if (data != null) {
              this.notifyService.showSuccess('success', 'Успешно сохранено');
              this.loadDictionaryForEdit(this.dicName);
              this.modalRef.hide();
              this.clearForm();
            }
          }, err => {
            this.notifyService.showError('warning', err.message);
            this.loadDictionaryForEdit(this.dicName);
            this.modalRef.hide();
            this.clearForm();
          }
        );

      } else {
        this.dicService.saveDic(this.formData, this.dicName).subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.loadDictionaryForEdit(this.dicName);
            this.modalRef.hide();
            this.clearForm();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.loadDictionaryForEdit(this.dicName);
          this.modalRef.hide();
          this.clearForm();
        });
      }
    } else {
      if (this.dicName == 'residential-complexes') {
        this.dicService.updateResidentalComplex(this.formRes).subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.loadDictionaryForEdit(this.dicName);
            this.modalRef.hide();
            this.clearForm();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.loadDictionaryForEdit(this.dicName);
          this.modalRef.hide();
          this.clearForm();
        });

      } else {
        this.dicService.updateDic(this.formData, this.dicName).subscribe(data => {
          if (data == null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.loadDictionaryForEdit(this.dicName);
            this.modalRef.hide();
            this.clearForm();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.loadDictionaryForEdit(this.dicName);
          this.modalRef.hide();
          this.clearForm();
        });
      }
    }
  };

  clickTr(obj) {
    this.editOrDelete = true;
    this.clickColumnDic = obj;
  }
}
