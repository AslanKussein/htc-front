import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BsLocaleService} from "ngx-bootstrap";
import {ClaimService} from "../services/claim.service";
import {ruLocale} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap/chronos";
import {DicService} from "../services/dic.service";
import {Dic} from "../models/dic";
import {language} from "../../environments/language";
import {Validators} from "@angular/forms";
import {Util} from "../services/util";
import {ObjectService} from "../services/object.service";
import {UploaderService} from "../services/uploader.service";


@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.scss']
})
export class ObjectsComponent implements OnInit {

  env = language;
  districts: Dic[];
  residentialComplexes: Dic[];
  dicDynamic: Dic[];
  homeTypes: Dic[];

  constructor(private router: Router,
              private localeService: BsLocaleService,
              private objectService: ObjectService,
              private uploadService: UploaderService,
              private dicService: DicService,
              private util: Util) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  formData = {
    numberOfRooms:null,
    districtsId: null,
    residentialComplexes: null,
    zalog: null,
    typeHome: null,
    numKvart: '',
    priceFrom: '',
    priceTo: '',
    floorFrom: '',
    floorTo: '',
    floorsFrom: '',
    floorsTo: '',
    totalAreaFrom: '',
    totalAreaTo: '',
    livingSpaceFrom: '',
    livingSpaceTo: '',
    kitchenAreaFrom: '',
    kitchenAreaTo: '',
    distance: '',
    garage: '',
    attic: ''
  };


  ngOnInit(): void {

    this.findObjects(0);
    this.loadDictionary();
  }

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }


  objectsData = [
    {
      realPropertyId: null,
      photos: {
        VIRTUAL_TOUR: [],
        PHOTO: [],
        HOUSING_PLAN: []
      },
      address: [],
      price: null,
      numberOfRooms: null,
      photosCount: '',
      encumbrance: '',
      priceAnalytics: '',
      contactsOfAgent: '',
      photo:[]
    }
  ];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;
  model:'Middle';
  uncheckableRadioModel:null;


  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findObjects(event.page);
    }
  }

  findObjects(pageNo: number) {
    let searchFilter = {};

    this.loading = true;
    console.log('formData.lastModifyDateRange', this.formData)
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = 10;
    if (!this.util.isNullOrEmpty(this.formData.districtsId)) {
      searchFilter['districtId'] = parseInt(this.formData.districtsId);
    }
    if (!this.util.isNullOrEmpty(this.formData.typeHome)) {
      searchFilter['materialOfConstructionId'] = parseInt(this.formData.typeHome);
    }
    if (!this.util.isNullOrEmpty(this.formData.residentialComplexes)) {
      searchFilter['residentialComplexId'] = parseInt(this.formData.residentialComplexes);
    }
    if (!this.util.isNullOrEmpty(this.formData.numKvart)) {
      searchFilter['apartmentNumber'] = parseInt(this.formData.numKvart);
    }
    let obj = {};
    if (!this.util.isNullOrEmpty(this.formData.priceFrom)) {
      obj['from'] = this.formData.priceFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.priceTo)) {
      obj['to'] = this.formData.priceTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['price'] = obj;
    }
    obj = {};
    if (!this.util.isNullOrEmpty(this.formData.floorFrom)) {
      obj['from'] = this.formData.floorFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.floorTo)) {
      obj['to'] = this.formData.floorTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['floor'] = obj;
    }
    obj = {};
    if (!this.util.isNullOrEmpty(this.formData.floorsFrom)) {
      obj['from'] = this.formData.floorsFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.floorsTo)) {
      obj['to'] = this.formData.floorsTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['floorInTheHouse'] = obj;
    }
    if (!this.util.isNullOrEmpty(this.formData.zalog)) {
      searchFilter['encumbrance'] = parseInt(this.formData.zalog);
    }
    obj = {};
    if (!this.util.isNullOrEmpty(this.formData.totalAreaFrom)) {
      obj['from'] = this.formData.totalAreaFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.totalAreaTo)) {
      obj['to'] = this.formData.totalAreaTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['totalArea'] = obj;
    }
    obj = {};
    if (!this.util.isNullOrEmpty(this.formData.livingSpaceFrom)) {
      obj['from'] = this.formData.livingSpaceFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.livingSpaceTo)) {
      obj['to'] = this.formData.livingSpaceTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['livingArea'] = obj;
    }
    obj = {};
    if (!this.util.isNullOrEmpty(this.formData.kitchenAreaFrom)) {
      obj['from'] = this.formData.kitchenAreaFrom;
    }
    if (!this.util.isNullOrEmpty(this.formData.kitchenAreaTo)) {
      obj['to'] = this.formData.kitchenAreaTo;
    }
    if (this.util.getObjectLength(obj) > 0) {
      searchFilter['kitchenArea'] = obj;
    }
    if (!this.util.isNullOrEmpty(this.formData.numberOfRooms)) {
      searchFilter['numberOfRooms'] = parseInt(this.formData.numberOfRooms);
    }


    this.objectService.getObjects(searchFilter).subscribe(res => {



        this.objectsData = res.data.data.data;
        this.totalItems = res.data.totalElements;
        this.itemsPerPage = res.data.data.size;

    });
    this.loading = false;
  }

  getImgUrl(uiid:string){
    return 'https://fm-htc.dilau.kz/download/' + '98d3a7fe-01f4-460e-9a99-300cb8c66d8c'+ '/preview?access_token=' + this.util.getCurrentUser().access_token;
  }

  getCountFoto(obj:any){
    console.log(obj)
    let s;
    if (obj!=null && obj.PHOTO !=null && obj.PHOTO.length!=null){
      s=obj.PHOTO.length+'/'
    }
    if (obj!=null && obj.HOUSING_PLAN !=null && obj.HOUSING_PLAN.length!=null){
      s= s + obj.HOUSING_PLAN.length+'/'
    }
    if (obj!=null && obj.VIRTUAL_TOUR !=null && obj.VIRTUAL_TOUR.length!=null){
      s= s + obj.VIRTUAL_TOUR.length
    }
    return s;
  }



  loadDictionary() {
    this.dicService.getDics('DISTRICTS').subscribe(data => {
      this.districts = this.util.toSelectArray(data);
    });
    this.dicService.getDics('MATERIALS_OF_CONSTRUCTION').subscribe(data => {
      this.homeTypes = this.util.toSelectArray(data);
    });

    this.dicService.getDics('residentialComplexes').subscribe(data => {
      this.residentialComplexes = this.util.toSelectArrayResidenceComplex(data);
    });

    this.dicService.getDics('YES_NO').subscribe(data => {
      this.dicDynamic = this.util.toSelectArray(data);
    });
  }


}
