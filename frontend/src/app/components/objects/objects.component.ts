import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
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
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {filter, pairwise} from "rxjs/operators";
import {AdvanceComponent} from "../claims/create-claim/advance/advance.component";

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
  eventCall: any = false;
  objectMyModel: number;
  subscriptions: Subscription = new Subscription();
  objectFilterDto: ObjectFilterDto;
  modalRef: BsModalRef;
  empty: boolean = false;
  fromBoard: boolean = false;
  eventObjectId = [];

  @ViewChild('openObjectClaims', {static: true}) openObjectClaims: TemplateRef<any>;

  constructor(private router: Router,
              private objectService: ObjectService,
              private uploadService: UploaderService,
              private notifyService: NotificationService,
              public util: Util,
              private actRoute: ActivatedRoute,
              private modalService: BsModalService,
              private newDicService: NewDicService,
              private dicService: DicService,
              private uploaderService: UploaderService,
              private ngxLoader: NgxUiLoaderService) {

    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('fromBoard'))) {
      this.fromBoard = this.actRoute.snapshot.queryParamMap.get('fromBoard') == 'true';
    }
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('event'))) {
      if (this.actRoute.snapshot.queryParamMap.get('event') == 'call') {
        this.fromBoard = true;
        this.eventCall = true;
      }
    }
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        localStorage.setItem('previousUrl', events[0].urlAfterRedirects)
      })
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
    ];
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
  selectObject: any;
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
    if (this.fromBoard) {
      this.subscriptions.add(this.objectService.getRealPropertyWithAppList(this.objectFilterDto).subscribe(res => {
        this.objectsData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
        if (res.data.data.empty) {
          this.empty = true;
        }
      }));
    } else {
      this.subscriptions.add(this.objectService.getObjects(this.objectFilterDto).subscribe(res => {
        this.objectsData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
        if (res.data.data.size == 0) {
          this.notifyService.showInfo('Ничего не найдено!', 'Внимание');
        }
      }));
    }
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

  openModal(template, class_, object: any) {
    this.selectObject = object;
    this.modalRef = this.modalService.show(template, {class: class_});
  }

  backToPrev() {
    this.util.navigateByUrl(localStorage.getItem('previousUrl'));
  }

  checkedObjects(object: any, $event: any) {
    if (this.eventCall) {
      if ($event.target.checked) {
        object.check = true;
        if (this.eventObjectId.length >= 1) {
          // this.notification.showWarning("Добавление событий ограничено! Вы превысили лимит добавления событий к данной заявке", "Инфомарция")
        }
        this.eventObjectId.push(object.applicationId);
      } else {
        object.check = false;
        const index = this.eventObjectId.indexOf(object.applicationId);
        if (index > -1) {
          this.eventObjectId.splice(index, 1);
        }
      }
    } else {
      if ($event.target.checked) {
        let prevUrl = localStorage.getItem('previousUrl');
        if (!this.util.isNullOrEmpty(prevUrl)) {
          if (!this.util.isNullOrEmpty(localStorage.getItem('previousUrl').split('&sellApplicationId=')[0])) {
            prevUrl = localStorage.getItem('previousUrl').split('&sellApplicationId=')[0] + '&sellApplicationId=' + object.applicationId
          } else {
            prevUrl = localStorage.getItem('previousUrl') + '&sellApplicationId=' + object.applicationId
          }
        }
        this.util.navigateByUrl(prevUrl);
        this.modalRef.hide();
        return;
      }
    }
  }

  addEventShow() {
    if (this.eventCall) {
      let prevUrl = localStorage.getItem('previousUrl');

      if (!this.util.isNullOrEmpty(localStorage.getItem('previousUrl').split('&eventObjectId=')[0])) {
        prevUrl = prevUrl.split('&eventObjectId=')[0] + '&eventObjectId=' + this.eventObjectId
      } else {
        prevUrl = prevUrl + '&eventObjectId=' + this.eventObjectId
      }

      this.util.navigateByUrl(prevUrl);
    }
  }
}
