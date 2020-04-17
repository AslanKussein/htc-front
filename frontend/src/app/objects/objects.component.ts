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
              private dicService: DicService,
              private util: Util) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  formData={
    districtsId:null,
    residentialComplexes:null,
    zalog:null,
    typeHome:null,
    numKvart:'',
    priceFrom:'',
    priceTo:'',
    floorFrom:'',
    floorTo:'',
    floorsFrom:'',
    floorsTo:'',
    totalAreaFrom:'',
    totalAreaTo:'',
    livingSpaceFrom:'',
    livingSpaceTo:'',
    kitchenAreaFrom:'',
    kitchenAreaTo:'',
    distance:'',
    garage:'',
    attic:''
  };


  ngOnInit(): void {

    this.findObjects(1);
    this.loadDictionary();
  }

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }

  objectsData = [];
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

    this.loading = true;
    console.log('formData.lastModifyDateRange', this.formData)
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = this.itemsPerPage;
    if (!this.util.isNullOrEmpty(this.formData.districtsId)) {
      searchFilter['districtsId'] = this.formData.districtsId;
    }
    this.objectService.getObjects(searchFilter).subscribe(res => {
      console.log(res)
      // if (res != null) {
      //
      //   this.claimData = res;
      //   this.totalItems = res.totalElements;
      //   this.itemsPerPage = res.size;
      //   this.currentPage = res.number + 1;
      // }
    });
    this.loading = false;
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
