import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BsLocaleService} from "ngx-bootstrap";
import {ruLocale} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap/chronos";
import {DicService} from "../../services/dic.service";
import {Dic} from "../../models/dic";
import {language} from "../../../environments/language";
import {Util} from "../../services/util";
import {ObjectService} from "../../services/object.service";
import {UploaderService} from "../../services/uploader.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {BigDecimalPeriod} from "../../models/common/bigDecimalPeriod";


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
  myObject: boolean;
  objectMy: any;
  objectMyModel: number;

  constructor(private router: Router,
              private localeService: BsLocaleService,
              private objectService: ObjectService,
              private uploadService: UploaderService,
              private dicService: DicService,
              private util: Util,
              private ngxLoader: NgxUiLoaderService) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
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
    my: null
  };

  ngOnInit(): void {
    this.ngxLoader.start();
    this.findObjects(1);
    this.loadDictionary();
    this.myObject = true;
    this.objectMyModel = 1;
    this.objectMy = [
      {label: 'Все объекты', value: 1},
      {label: 'Свои объекты', value: 2},
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
      my: null
    };
  }

  findObjects(pageNo: number) {
    this.ngxLoader.start();
    let searchFilter = {};

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
    if (!this.util.isNullOrEmpty(this.formData.zalog)) {
      searchFilter['encumbrance'] = parseInt(this.formData.zalog);
    }
    searchFilter['price'] = new BigDecimalPeriod(this.formData?.priceFrom, this.formData?.priceTo);
    searchFilter['floor'] = new BigDecimalPeriod(this.formData?.floorFrom, this.formData?.floorTo);
    searchFilter['floorInTheHouse'] = new BigDecimalPeriod(this.formData?.floorsFrom, this.formData?.floorsTo);
    searchFilter['totalArea'] = new BigDecimalPeriod(this.formData?.totalAreaFrom, this.formData?.totalAreaTo);
    searchFilter['livingArea'] = new BigDecimalPeriod(this.formData?.livingSpaceFrom, this.formData?.livingSpaceTo);
    searchFilter['kitchenArea'] = new BigDecimalPeriod(this.formData?.kitchenAreaFrom, this.formData?.kitchenAreaTo);

    if (!this.util.isNullOrEmpty(this.formData.numberOfRooms)) {
      searchFilter['numberOfRooms'] = parseInt(this.formData.numberOfRooms);
    }
    if (!this.util.isNullOrEmpty(this.formData.my)) {
      searchFilter['my'] = this.formData.my;
    }
    searchFilter['sortBy'] = 'application.objectPrice'

    this.objectService.getObjects(searchFilter).subscribe(res => {
      this.objectsData = res.data.data.data;
      this.totalItems = res.data.total;
      this.currentPage = res.data.pageNumber + 1;
    });
    this.ngxLoader.stop();
  }

  getImgUrl(obj: any) {
    if (!this.util.isNullOrEmpty(obj.photos.PHOTO)) {
      return this.util.generatorPreviewUrl(obj.photos.PHOTO[0])
    }
    return null;
  }

  getCountFoto(obj: any) {
    let s;
    if (!this.util.isNullOrEmpty(obj.PHOTO)) {
      s = obj.PHOTO.length + '/'
    }
    if (!this.util.isNullOrEmpty(obj.HOUSING_PLAN)) {
      s = s + obj.HOUSING_PLAN.length + '/'
    }
    if (!this.util.isNullOrEmpty(obj.VIRTUAL_TOUR)) {
      s = s + obj.VIRTUAL_TOUR.length
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
