import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Dic} from "../../models/dic";
import {language} from "../../../environments/language";
import {Util} from "../../services/util";
import {ObjectService} from "../../services/object.service";
import {UploaderService} from "../../services/uploader.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Period} from "../../models/common/period";
import {NotificationService} from "../../services/notification.service";
import {Subscription} from "rxjs";
import {NewDicService} from "../../services/new.dic.service";
import {DicService} from "../../services/dic.service";
import {ObjectFilterDto} from "../../models/objectFilterDto";


@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.scss']
})
export class ObjectsComponent implements OnInit, OnDestroy {

  env = language;
  districts: Dic[];
  residentialComplexes: Dic[];
  dicDynamic: Dic[];
  homeTypes: Dic[];
  objectTypes: Dic[];
  myObject: boolean;
  objectMy: any;
  objectMyModel: number;
  subscriptions: Subscription = new Subscription();
  objectFilterDto: ObjectFilterDto;

  constructor(private router: Router,
              private objectService: ObjectService,
              private uploadService: UploaderService,
              private notifyService: NotificationService,
              private util: Util,
              private newDicService: NewDicService,
              private dicService: DicService,
              private uploaderService: UploaderService,
              private ngxLoader: NgxUiLoaderService) {
  }

  formData = {
    numberOfRooms: null,
    districtsId: null,
    residentialComplexes: null,
    zalog: null,
    typeHome: null,
    numKvart: '',
    priceFrom: null,
    priceTo: null,
    floorFrom: null,
    floorTo: null,
    floorsFrom: null,
    floorsTo: null,
    totalAreaFrom: null,
    totalAreaTo: null,
    livingSpaceFrom: null,
    livingSpaceTo: null,
    kitchenAreaFrom: null,
    kitchenAreaTo: null,
    distance: '',
    garage: '',
    attic: '',
    my: null,
    objectTypes: null
  };

  ngOnInit(): void {
    this.ngxLoader.start();
    this.findObjects(1);
    this.loadDictionary();
    this.myObject = true;
    this.objectMyModel = 1;
    this.objectMy = [
      {label: 'Все объекты', value: 1},
      {label: 'Мои объекты', value: 2},
    ]
  }

  myObjectChange() {
    if (this.objectMyModel == 1) {
      this.formData.my = false;
      this.findObjects(1);
    } else if (this.objectMyModel == 2) {
      this.formData.my = true;
      this.findObjects(1);
    }
  }

  objectsData;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;
  model: 'Middle';

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findObjects(event.page);
    }
  }

  clearFilter() {
    this.formData = {
      numberOfRooms: null,
      districtsId: null,
      residentialComplexes: null,
      zalog: null,
      typeHome: null,
      numKvart: '',
      priceFrom: null,
      priceTo: null,
      floorFrom: null,
      floorTo: null,
      floorsFrom: null,
      floorsTo: null,
      totalAreaFrom: null,
      totalAreaTo: null,
      livingSpaceFrom: null,
      livingSpaceTo: null,
      kitchenAreaFrom: null,
      kitchenAreaTo: null,
      distance: '',
      garage: '',
      attic: '',
      my: null,
      objectTypes: 1
    };
  }

  findObjects(pageNo: number) {
    this.ngxLoader.start();
    this.objectFilterDto = new ObjectFilterDto();
    this.objectFilterDto.pageNumber = pageNo - 1;
    this.objectFilterDto.pageSize = 10;
    if (!this.util.isNullOrEmpty(this.formData.districtsId)) {
      this.objectFilterDto.districtId = parseInt(this.formData.districtsId);
    }
    if (!this.util.isNullOrEmpty(this.formData.typeHome)) {
      this.objectFilterDto.materialOfConstructionId = parseInt(this.formData.typeHome);
    }
    if (!this.util.isNullOrEmpty(this.formData.residentialComplexes)) {
      this.objectFilterDto.residentialComplexId = parseInt(this.formData.residentialComplexes);
    }
    if (!this.util.isNullOrEmpty(this.formData.objectTypes)) {
      this.objectFilterDto.objectTypeId = this.formData.objectTypes;
    }
    if (!this.util.isNullOrEmpty(this.formData.numKvart)) {
      this.objectFilterDto.apartmentNumber = parseInt(this.formData.numKvart);
    }
    if (!this.util.isNullOrEmpty(this.formData.zalog)) {
      this.objectFilterDto.encumbrance = parseInt(this.formData.zalog) == 1 ? true : false;
    }
    if (!this.util.isEmptyObject(new Period(this.formData.priceFrom, this.formData.priceTo))) {
      this.objectFilterDto.price = new Period(this.formData.priceFrom, this.formData.priceTo);
    }
    if (!this.util.isEmptyObject(new Period(this.formData.floorFrom, this.formData.floorTo))) {
      this.objectFilterDto.floor = new Period(this.formData.floorFrom, this.formData.floorTo);
    }
    if (!this.util.isEmptyObject(new Period(this.formData.floorsFrom, this.formData.floorsTo))) {
      this.objectFilterDto.floorInTheHouse = new Period(this.formData.floorsFrom, this.formData.floorsTo);
    }
    if (!this.util.isEmptyObject(new Period(this.formData.totalAreaFrom, this.formData.totalAreaTo))) {
      this.objectFilterDto.totalArea = new Period(this.formData.totalAreaFrom, this.formData.totalAreaTo);
    }
    if (!this.util.isEmptyObject(new Period(this.formData.livingSpaceFrom, this.formData.livingSpaceTo))) {
      this.objectFilterDto.livingArea = new Period(this.formData.livingSpaceFrom, this.formData.livingSpaceTo);
    }
    if (!this.util.isEmptyObject(new Period(this.formData.kitchenAreaFrom, this.formData.kitchenAreaTo))) {
      this.objectFilterDto.kitchenArea = new Period(this.formData.kitchenAreaFrom, this.formData.kitchenAreaTo);
    }

    if (!this.util.isNullOrEmpty(this.formData.numberOfRooms)) {
      this.objectFilterDto.numberOfRooms = parseInt(this.formData.numberOfRooms);
    }
    if (!this.util.isNullOrEmpty(this.formData.my)) {
      this.objectFilterDto.my = this.formData.my;
    }

    this.subscriptions.add(this.objectService.getObjects(this.objectFilterDto).subscribe(res => {
      this.objectsData = res.data.data.data;
      this.totalItems = res.data.total;
      this.currentPage = res.data.pageNumber + 1;
      if (res.data.data.size == 0) {
        this.notifyService.showInfo('Ничего не найдено!', 'Внимание');
      }
    }));
    this.ngxLoader.stop();
  }

  isEmpty(obj: any): boolean {
    for(const key in obj) {
      if (obj[key]) {
        return false;
      }
    }
    return true;
  }

  getImgUrl(obj: any) {
    if (!this.util.isNullOrEmpty(obj.photos)&&!this.util.isNullOrEmpty(obj.photos.PHOTO)) {
      return this.util.generatorPreviewUrl(obj.photos.PHOTO[0])
    }
    return null;
  }

  getName(obj){
    if(obj){
      return 'Да'
    }else{
      return 'Нет'
    }
  }

  getCountFoto(obj: any) {
    let s;
    if (!this.util.isNullOrEmpty(obj)&&!this.util.isNullOrEmpty(obj.PHOTO)) {
      s = obj.PHOTO.length + '/'
    }
    if (!this.util.isNullOrEmpty(obj)&&!this.util.isNullOrEmpty(obj.HOUSING_PLAN)) {
      s = s + obj.HOUSING_PLAN.length + '/'
    }
    if (!this.util.isNullOrEmpty(obj)&&!this.util.isNullOrEmpty(obj.VIRTUAL_TOUR)) {
      s = s + obj.VIRTUAL_TOUR.length
    }
    return s;
  }

  loadDictionary() {

    this.subscriptions.add(this.newDicService.getDictionary('ObjectType').subscribe(res => {
      this.objectTypes = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('District').subscribe(res => {
      this.districts = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.newDicService.getDictionary('MaterialOfConstruction').subscribe(res => {
      this.homeTypes = this.util.toSelectArray(res);
    }));
    this.subscriptions.add(this.dicService.getDics('YES_NO').subscribe(res => {
      this.dicDynamic = this.util.toSelectArrayOldDic(res);
    }));
    this.subscriptions.add(this.newDicService.getResidentialComplexes().subscribe(res => {
      this.residentialComplexes = this.util.toSelectArrayResidenceComplex(res);
    }));
  }

  addObjectTypes(id) {
    this.formData.objectTypes = id;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
