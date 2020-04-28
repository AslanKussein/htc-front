import { Component, OnInit } from '@angular/core';
import {ObjectService} from "../../services/object.service";
import {Util} from "../../services/util";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ruLocale} from "ngx-bootstrap/locale";
import {BsLocaleService} from "ngx-bootstrap";

@Component({
  selector: 'app-my-objects',
  templateUrl: './my-objects.component.html',
  styleUrls: ['./my-objects.component.scss']
})
export class MyObjectsComponent implements OnInit {

  constructor(  private objectService: ObjectService,
                private localeService: BsLocaleService,
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
    my:true
  };

  ngOnInit(): void {
    this.findObjects(0);

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


  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findObjects(event.page);
    }
  }


  findObjects(pageNo: number) {
    let searchFilter = {};
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = 10;
    if (!this.util.isNullOrEmpty(this.formData.my)) {
      searchFilter['my'] = this.formData.my;
    }


    this.objectService.getObjects(searchFilter).subscribe(res => {
      this.objectsData = res.data.data.data;
      this.totalItems = res.data.totalElements;
      this.itemsPerPage = res.data.data.size;
    });
    this.loading = false;
  }

  dnHref(href) {
    this.util.dnHref(href);
  }

  getImgUrl(obj:any){
    if (obj!=null && obj.photos!=null && obj.photos.PHOTO !=null && obj.photos.PHOTO.length!=null){
      return  this.util.generatorPreviewUrl(obj.photos.PHOTO[0])
    };
    return null;
  }

  getCountFoto(obj:any){
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

}
