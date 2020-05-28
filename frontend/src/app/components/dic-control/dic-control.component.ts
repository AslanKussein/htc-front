import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {DicService} from "../../services/dic.service";
import {Dic} from "../../models/dic";
import {Util} from "../../services/util";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ruLocale} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap/chronos";
import {NotificationService} from "../../services/notification.service";
import {User} from "../../models/users";
import {AuthenticationService} from "../../services/authentication.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {HttpParams} from "@angular/common/http";
import {Subscription} from "rxjs";
import {KazPostService} from "../../services/kaz.post.service";
import {NewDicService} from "../../services/new.dic.service";

@Component({
  selector: 'app-dic-control',
  templateUrl: './dic-control.component.html',
  styleUrls: ['./dic-control.component.scss']
})
export class DicControlComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  dictionary: any;
  cities: Dic[];
  districts: Dic[];
  streets: Dic[];
  propertyDevelopers: Dic[];
  materialsOfConstruction: Dic[];
  residentialComplexes: any;
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
  subscriptions: Subscription = new Subscription();
  kazPost: any;
  apiParam: string;
  apiPage: number = 0;
  postCode: string;
  postcode: any;

  constructor(private util: Util,
              private modalService: BsModalService,
              private notifyService: NotificationService,
              private authenticationService: AuthenticationService,
              private dicService: DicService,
              private newDicService: NewDicService,
              private ngxLoader: NgxUiLoaderService,
              private kazPostService: KazPostService) {
    this.subscriptions.add(this.authenticationService.currentUser.subscribe(x => this.currentUser = x));
    if (this.currentUser.roles != null) {
      this.adminRoles = false;
      for (const role of this.currentUser.roles) {
        if (role == 'Administrator resursa') {
          this.adminRoles = true;
          return;
        }
      }
    }
    this.adminRoles = true;
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
      "buildingDto": {
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
    this.util.getAllDic('City').then(res => {
      this.cities = res;
    });
    this.util.getAllDic('District').then(data => {
      this.districts = data;
    });
    this.util.getAllDic('Street').then(data => {
      this.streets = data;
    });
    this.util.getAllDic('PropertyDeveloper').then(data => {
      this.propertyDevelopers = data
    });
    this.util.getAllDic('MaterialOfConstruction').then(data => {
      this.materialsOfConstruction = data
    });
    this.util.getAllDic('TypeOfElevator').then(data => {
      this.typeOfElevator = data
    });
    this.util.getAllDic('ParkingType').then(data => {
      this.parkingTypes = data
    });
    this.util.getAllDic('YardType').then(data => {
      this.yardTypes = data
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
    this.subscriptions.add(this.dicService.getDicsAllPageable(search).subscribe(res => {
      if (res != null && res.data != null) {
        this.dictionaryes = res.data.data;
      }
      this.ngxLoader.stop();
    }));
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
    this.subscriptions.add(this.dicService.getDicsAllPageable(search).subscribe(res => {
      if (res != null && res.data != null) {
        this.dictionary = res.data.data;
        this.totalItems = res.total;
        this.currentPage = res.pageNumber + 1;
      }
      this.ngxLoader.stop();
    }));
  }

  loadResidenceComplex(pageNo: number) {
    const searchFilter = {};
    let params = new HttpParams();
    params = params.append('pageNumber', String(pageNo - 1))
    params = params.append('pageSize', String(this.itemsPerPage))
    params = params.append('direction', 'ASC')
    params = params.append('sortBy', 'id')

    this.subscriptions.add(this.dicService.getResidentialComplexesPageable(params).subscribe(res => {
      if (res != null && res.data != null) {
        this.residentialComplexes = res.data.data;
        this.totalItems = res.total;
        this.currentPage = res.pageNumber + 1;
      }
      this.ngxLoader.stop();
    }));
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
    if (this.dicName == 'residential-complexes') {
      if (this.currentPage !== event.page) {
        this.loadResidenceComplex(event.page);
      }
    } else {
      if (this.currentPage !== event.page) {
        this.loadDicPageableByDicName(this.dicName, event.page);
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

        this.subscriptions.add(this.newDicService.getResidentialComplexesByPostcode(this.clickColumnDic.buildingDto?.postcode).subscribe(data => {
            if (data != null) {
              this.formRes = data;
            }
          }, err => {
            this.notifyService.showError('warning', err);
            this.modalRef.hide();
            this.clearForm();
          }
        ));
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
      this.subscriptions.add(this.dicService.deleteResidentalComplex(this.clickColumnDic).subscribe(data => {
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
      ));
    } else {
      this.subscriptions.add(this.dicService.deleteDicNew(this.clickColumnDic, this.dicName).subscribe(data => {
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
      ));
    }
  }

  submit() {
    if (this.actions == 'ADD') {
      if (this.dicName == 'residential-complexes') {
        console.log(this.formRes)
        if (this.util.isNullOrEmpty(this.formRes.buildingDto.cityId) || this.util.isNullOrEmpty(this.formRes.buildingDto.streetId) || this.util.isNullOrEmpty(this.formRes.buildingDto.houseNumber)) {
          this.notifyService.showError('Пожалуйста, заполните все поля', "");
          return;
        }
        this.subscriptions.add(this.dicService.saveResidentalComplex(this.formRes).subscribe(data => {
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
          parentId: this.formData.parentId
        };

        this.subscriptions.add(this.dicService.saveDicNew(saveForm).subscribe(data => {
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
        }));
      }
    } else {
      if (this.dicName == 'residential-complexes') {
        if (this.util.isNullOrEmpty(this.formRes.buildingDto.cityId) || this.util.isNullOrEmpty(this.formRes.buildingDto.streetId) || this.util.isNullOrEmpty(this.formRes.buildingDto.houseNumber)) {
          this.notifyService.showError('Пожалуйста, заполните все поля', "");
          return;
        }
        this.subscriptions.add(this.dicService.updateResidentalComplex(this.formRes).subscribe(data => {
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
        }));

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

        this.subscriptions.add(this.dicService.updateDicNew(this.formData, saveForm).subscribe(data => {
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
        }));
      }
    }
  };

  clickTr(obj) {
    this.editOrDelete = true;
    this.clickColumnDic = obj;
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef2.hide();
    this.modalRef.hide();
    this.clearForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

  checkPostData() {

    if (!this.util.isNullOrEmpty(this.postcode?.fullAddress)) {
      this.ngxLoader.start();

      this.subscriptions.add(this.kazPostService.checkPostData(this.postcode?.fullAddress).subscribe(res => {
        this.formRes.buildingDto.postcode = this.postcode?.value;
        this.util.addDicById('Street', res.street);
        this.util.addDicById('District', res.district);
        this.util.addDicById('City', res.city);
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
            this.ngxLoader.stop();

          }
        }, 1000)

      }));
    }
  }

}
