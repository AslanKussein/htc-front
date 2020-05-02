import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BsLocaleService} from "ngx-bootstrap";
import {ClaimService} from "../../services/claim.service";
import {ruLocale} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap/chronos";
import {DicService} from "../../services/dic.service";
import {Dic} from "../../models/dic";
import {language} from "../../../environments/language";
import {Validators} from "@angular/forms";
import {Util} from "../../services/util";
import {ObjectService} from "../../services/object.service";
import {UploaderService} from "../../services/uploader.service";


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
  myObject:boolean;
  objectMy:any;
  objectMyModel:number;

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
    attic: '',
    my:null
  };


  ngOnInit(): void {

    this.findObjects(1);
    this.loadDictionary();
    this.myObject=true;
    this.objectMyModel=1;
    this.objectMy=[
      {label:'Все объекты',value:1},
      {label:'Свои объекты',value:2},
    ]



    ;
  }

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }

  myObjectChange(){
    if(this.objectMyModel==1){
      this.formData.my=false;
      this.findObjects(1);
    }else if(this.objectMyModel==2){
      this.formData.my=true;
      this.findObjects(1);
    }
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
      numberOfRooms: 0,
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

  clearFilter(){
    this.formData = {
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
      attic: '',
      my:null
    };
  }

  myObjects(){
    this.formData.my=true;
    this.myObject=false;

    this.findObjects(1);
  }

  allObjects(){
    this.formData.my=false;
    this.myObject=true;
    this.findObjects(1);
  }

  findObjects(pageNo: number) {
    let searchFilter = {};

    this.loading = true;
    searchFilter['pageNumber'] = pageNo - 1;
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
    if (!this.util.isNullOrEmpty(this.formData.my)) {
      searchFilter['my'] = this.formData.my;
    }
    searchFilter['sortBy'] = 'application.objectPrice'
    // searchFilter['direction'] = 'DESC'


    this.objectService.getObjects(searchFilter).subscribe(res => {
      this.objectsData = res.data.data.data;
      this.totalItems = res.data.total;
      this.currentPage = res.data.pageNumber + 1;
    });
    this.loading = false;
  }

  getImgUrl(obj:any){
    if (!this.util.isNullOrEmpty(obj.photos.PHOTO)){
      return  this.util.generatorPreviewUrl(obj.photos.PHOTO[0])
    };
    return null;
  }

  getCountFoto(obj:any){
    let s;
    if (!this.util.isNullOrEmpty(obj.PHOTO)){
      s=obj.PHOTO.length+'/'
    }
    if (!this.util.isNullOrEmpty(obj.HOUSING_PLAN)){
      s= s + obj.HOUSING_PLAN.length+'/'
    }
    if (!this.util.isNullOrEmpty(obj.VIRTUAL_TOUR)){
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

    this.dicService.getResidentialComplexes().subscribe(data => {
      this.residentialComplexes = this.util.toSelectArrayResidenceComplex(data);
    });

    this.dicService.getDics('YES_NO').subscribe(data => {
      this.dicDynamic = this.util.toSelectArray(data);
    });
  }


}