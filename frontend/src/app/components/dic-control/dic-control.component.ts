import {Component, OnInit, TemplateRef} from '@angular/core';
import {DicService} from "../../services/dic.service";
import {Dic} from "../../models/dic";
import {Util} from "../../services/util";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ruLocale} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap/chronos";
import {BsLocaleService} from "ngx-bootstrap";
import {NotificationService} from "../../services/notification.service";
import {User} from "../../models/users";
import {AuthenticationService} from "../../services/authentication.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-dic-control',
  templateUrl: './dic-control.component.html',
  styleUrls: ['./dic-control.component.scss']
})
export class DicControlComponent implements OnInit {

  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  dictionary: any;
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
  dictionaryes: any
  currentUser: User;
  adminRoles: boolean;
  totalItems = 0;
  itemsPerPage = 30;
  currentPage = 1;

  constructor(private util: Util,
              private modalService: BsModalService,
              private localeService: BsLocaleService,
              private notifyService: NotificationService,
              private authenticationService: AuthenticationService,
              private dicService: DicService,
              private ngxLoader: NgxUiLoaderService) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser.roles != null) {
      this.adminRoles = false;
      for (const role of this.currentUser.roles) {
        if (role == 'Administrator resursa') {
          this.adminRoles = true;
          return;
        }
      }
    }
  }

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
    playground: false,
    propertyDeveloperId: null,
    streetId: 0,
    typeOfElevatorIdList: [],
    parkingTypeIds: [],

    wheelchair: false,
    yardTypeId: null,
    countryId: null,
    yearOfConstruction: 0
  };

  formData = {
    code: '',
    multiLang:{
      nameEn: '',
      nameRu: '',
      nameKz: '',
    },
    parentId:null,

  };


  clearForm() {
    this.formData = {
      code: '',
      multiLang:{
        nameEn: '',
        nameRu: '',
        nameKz: '',
      },
      parentId:null,

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
      playground: false,
      propertyDeveloperId: null,
      streetId: 0,
      typeOfElevatorIdList: [],
      parkingTypeIds: [],
      wheelchair: false,
      yardTypeId: null,
      countryId: null,
      yearOfConstruction: 0
    };

    this.clickColumnDic = null;

  }

  ngOnInit(): void {
    this.ngxLoader.start();
    this.loadDictionary();
    this.loadResidenceComplex(1);
    this.resident = true;
    this.dicName = 'residential-complexes';
    this.loadDicAll();

  }

  openModal(template: TemplateRef<any>) {
    console.log(template)
    // this.modalRef = this.modalService.show(template);
    this.modalRef = this.modalService.show(template, {keyboard: false, backdrop: 'static'});
    // this.modalRef.result.then(() => { console.log('When user closes'); }, () => { console.log('Backdrop click')})
  }

  loadDictionary() {
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
    this.ngxLoader.stop();
  }


  loadDicAll() {
    let search = {
      dictionaryName: 'AllDict',
      pageableDto: {
        direction: "ASC",
        // pageNumber: pageNo - 1,
        pageSize: 16,
        sortBy: "id"
      }
    };
    this.dicService.getDicsAllPageable(search).subscribe(res => {
      if (res != null && res.data != null) {
        this.dictionaryes = res.data.data;
      }
      this.ngxLoader.stop();
    });
  }

  loadDicPageableByDicName(dicName, pageNo) {
    let search = {
      dictionaryName: dicName,
      pageableDto: {
        direction: "ASC",
        pageNumber: pageNo - 1,
        pageSize: 10,
        sortBy: "id"
      }
    };

    console.log(search)
    this.dicService.getDicsAllPageable(search).subscribe(res => {
      if (res != null && res.data != null) {
        this.dictionary = res.data.data;
        this.totalItems = res.total;
        this.currentPage = res.pageNumber + 1;
      }
      this.ngxLoader.stop();
    });
  }

  loadResidenceComplex(pageNo: number) {
    const searchFilter = {};
    let params = new HttpParams();
    params = params.append('pageNumber', String(pageNo - 1))
    params = params.append('pageSize', String(this.itemsPerPage))
    params = params.append('direction', 'ASC')
    params = params.append('sortBy', 'id')

    this.dicService.getResidentialComplexesPageable(params).subscribe(res => {
      if (res != null && res.data != null) {
        this.residentialComplexes = this.util.toSelectArrayResidenceComplex(res.data.data);
        this.totalItems = res.total;
        this.currentPage = res.pageNumber + 1;
      }
      this.ngxLoader.stop();
    });
  }

  loadDictionaryForEdit(dic) {
    this.ngxLoader.start();
    this.dicName = dic;

    if (dic == 'residential-complexes') {
      this.loadResidenceComplex(1);
    } else {
      this.loadDicPageableByDicName(dic, 1)
      // this.dicService.getDics(dic).subscribe(data => {
      //   this.dictionary = data;
      //   this.ngxLoader.stop();
      // });
    }
    this.clickColumnDic = null;
  }

  pageChanged(event: any): void {
    if(this.dicName=='residential-complexes'){
      if (this.currentPage !== event.page) {
        this.loadResidenceComplex(event.page);
      }
    }else{
      if (this.currentPage !== event.page) {
        this.loadDicPageableByDicName(this.dicName,event.page);
      }
    }

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

        this.dicService.getResidentialComplexesById(this.clickColumnDic.id).subscribe(data => {
            if (data != null) {
              this.formRes = data;
            }
          }, err => {
            this.notifyService.showError('warning', err);
            this.modalRef.hide();
            this.clearForm();
          }
        );
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

  deleteById() {
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
    } else {
      this.dicService.deleteDicNew(this.clickColumnDic, this.dicName).subscribe(data => {
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
    }
  }

  submit() {
    console.log(this.actions, this.dicName)
    if (this.actions == 'ADD') {
      if (this.dicName == 'residential-complexes') {
        console.log(this.formRes)
        if (this.util.isNullOrEmpty(this.formRes.cityId) || this.util.isNullOrEmpty(this.formRes.streetId) || this.util.isNullOrEmpty(this.formRes.houseNumber)) {
          this.notifyService.showError('Пожалуйста, заполните все поля', "");
          return;
        }
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
        if (this.util.isNullOrEmpty(this.formData.multiLang.nameRu)) {
          this.notifyService.showError('Пожалуйста, заполните все поля', "");
          return;
        }
        let saveForm = {
          dictionaryName: this.dicName,
          nameEn: this.formData.multiLang.nameEn,
          nameKz: this.formData.multiLang.nameKz,
          nameRu: this.formData.multiLang.nameRu,
          parentId: this.formData.parentId
        };

        this.dicService.saveDicNew(saveForm).subscribe(data => {
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
        if (this.util.isNullOrEmpty(this.formRes.cityId) || this.util.isNullOrEmpty(this.formRes.streetId) || this.util.isNullOrEmpty(this.formRes.houseNumber)) {
          this.notifyService.showError('Пожалуйста, заполните все поля', "");
          return;
        }
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
        if (this.util.isNullOrEmpty(this.formData.multiLang.nameRu)) {
          this.notifyService.showError('Пожалуйста, заполните все поля', "");
          return;
        }
        let saveForm = {
          dictionaryName: this.dicName,
          nameEn: this.formData.multiLang.nameEn,
          nameKz: this.formData.multiLang.nameKz,
          nameRu: this.formData.multiLang.nameRu,
          parentId: this.formData.parentId
        };

        this.dicService.updateDicNew(this.formData, saveForm).subscribe(data => {
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
    }
  };

  clickTr(obj) {
    this.editOrDelete = true;
    this.clickColumnDic = obj;
    console.log(this.clickColumnDic)
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef2.hide();
    this.modalRef.hide();

    this.clearForm();
  }
}
