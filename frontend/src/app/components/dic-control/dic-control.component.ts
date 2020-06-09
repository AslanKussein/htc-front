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
  houseConditions: Dic[];
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
  postcode: any;
  timer: any;
  postcodeDic:null;
  formData: any;
  formRes: any;
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

  ngOnInit(): void {
    this.ngxLoader.start();
    this._createFormData();
    this._createFormRes();
    this.loadDictionary();
    this.loadResidenceComplex(1);
    this.resident = true;
    this.dicName = 'residential-complexes';
    this.loadDicAll();
  }

  private _createFormData() {
    this.formData = Object.assign({}, {
      code: '',
      multiLang: {
        nameEn: '',
        nameRu: '',
        nameKz: '',
      },
      parentId: null,
    });
  }

  private _createFormRes() {
    this.formRes = Object.assign({}, {
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
    });

  }

  openModal(template: TemplateRef<any>) {
    // this.modalRef = this.modalService.show(template);
    this.modalRef = this.modalService.show(template, {keyboard: false, backdrop: 'static'});
    // this.modalRef.result.then(() => { console.log('When user closes'); }, () => { console.log('Backdrop click')})
  }

  loadDictionary() {
    this.subscriptions.add(this.newDicService.getDictionary('City').subscribe(res => {
      this.cities = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('District').subscribe(res => {
      this.districts = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('Street').subscribe(res => {
      this.streets = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('PropertyDeveloper').subscribe(res => {
      this.propertyDevelopers = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('MaterialOfConstruction').subscribe(res => {
      this.materialsOfConstruction = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('TypeOfElevator').subscribe(res => {
      this.typeOfElevator = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('ParkingType').subscribe(res => {
      this.parkingTypes = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('YardType').subscribe(res => {
      this.yardTypes = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('HouseCondition').subscribe(res => {
      this.houseConditions = this.util.toSelectArray(res);
    }));

    this.ngxLoader.stop();
  }


  loadDicAll() {
    let search = {
      dictionaryName: 'AllDict',
      pageableDto: {
        direction: "ASC",
        // pageNumber: pageNo - 1,
        pageSize: 100,
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
              this.subscriptions.add(
                this.kazPostService.getDataFromDb(this.clickColumnDic.buildingDto?.postcode).subscribe(res=> {
                    this.postcode = res?.addressRus;
                  }
                )
              )

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
        if (this.util.isNullOrEmpty(this.formRes.buildingDto.cityId) || this.util.isNullOrEmpty(this.formRes.buildingDto.streetId) || this.util.isNullOrEmpty(this.formRes.buildingDto.houseNumber)
          || this.util.isNullOrEmpty(this.formRes.houseName)) {
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
    clearTimeout(this.timer);
    let me = this;
    this.timer = setTimeout(function () {
      if (!me.util.isNullOrEmpty(event)) {
        me.apiParam = event.term;
        me.searchDataPost(me.apiParam, me.apiPage);
      }
    }, 300);
  }

  searchDataPost(val: string, page: number) {
    this.subscriptions.add(this.kazPostService.getDataPost(val, page).subscribe(res => {
      this.kazPost = this.util.toSelectArrayPost(res.data)
      this.kazPost = [...this.kazPost, this.util.toSelectArrayPost(res.data)];
    }))
  }


  customSearchFn(term: string, item) {
    let result = false;
    term = term.toLowerCase();
    if (item != null && item.label != null) {
      result = item.label.toLowerCase().indexOf(term) > -1 || item.fullAddress.addressRus.toLowerCase() === term;
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

    if (!this.util.isNullOrEmpty(this.postcode?.fullAddress)) {
      this.ngxLoader.start();

      this.subscriptions.add(this.kazPostService.checkPostData(this.postcode?.fullAddress).subscribe(res => {
        this.formRes.buildingDto.postcode = this.postcode?.value;
        setTimeout(() => {
          this.loadDictionary();
          this.formRes.buildingDto.cityId = res.city.id;
          this.formRes.buildingDto.districtId = res.district.id;
          this.formRes.buildingDto.streetId = res.street.id;
          this.formRes.buildingDto.houseNumber = res.houseNumber;
          this.ngxLoader.stop();
        }, 300);
      }));
    }
  }

  showActions() {
    let isShow = true;
    if (this.dicName === 'District') {
      isShow = false;
    } else if (this.dicName === 'City') {
      isShow = false;
    } else if (this.dicName === 'Street') {
      isShow = false;
    }
    return isShow;
  }

  clearForm() {
    this._createFormData();
    this._createFormRes();
    this.clickColumnDic = null;
    this.postcode = null;
  }
}
