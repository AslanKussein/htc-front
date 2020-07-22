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
import {FormBuilder, Validators} from "@angular/forms";

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
  objectTypes: any;
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
  roomsCount: any;
  expanded: boolean = false;
  objectForm: any;
  @ViewChild('openObjectClaims', {static: true}) openObjectClaims: TemplateRef<any>;

  constructor(private router: Router,
              private objectService: ObjectService,
              private uploadService: UploaderService,
              private notifyService: NotificationService,
              public util: Util,
              private actRoute: ActivatedRoute,
              private modalService: BsModalService,
              private formBuilder: FormBuilder,
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

  ngOnInit(): void {
    this.ngxLoader.startBackground();
    this.findObjects(1);
    this.loadDictionary();
    this.myObject = true;
    this.objectMyModel = 1;
    this.objectMy = [
      {label: 'Все объекты', value: 1},
      {label: 'Мои объекты', value: 2},
    ];
    this.roomsCount = []
    for (let i = 1; i < 6; i++) {
      this.roomsCount.push(i);
    }
    this.objectForm = this.formBuilder.group({
      objectTypes: [null, Validators.nullValidator],
      my: [null, Validators.nullValidator],
      attic: [null, Validators.nullValidator],
      garage: [null, Validators.nullValidator],
      distance: [null, Validators.nullValidator],
      kitchenAreaTo: [null, Validators.nullValidator],
      kitchenAreaFrom: [null, Validators.nullValidator],
      livingSpaceFrom: [null, Validators.nullValidator],
      livingSpaceTo: [null, Validators.nullValidator],
      totalAreaFrom: [null, Validators.nullValidator],
      totalAreaTo: [null, Validators.nullValidator],
      floorsFrom: [null, Validators.nullValidator],
      floorsTo: [null, Validators.nullValidator],
      floorFrom: [null, Validators.nullValidator],
      floorTo: [null, Validators.nullValidator],
      priceFrom: [null, Validators.nullValidator],
      priceTo: [null, Validators.nullValidator],
      numKvart: [null, Validators.nullValidator],
      typeHome: [null, Validators.nullValidator],
      zalog: [null, Validators.nullValidator],
      residentialComplexes: [null, Validators.nullValidator],
      districtsId: [null, Validators.nullValidator],
      numberOfRooms: [null, Validators.nullValidator],
    });
  }

  myObjectChange(id: number) {
    this.objectMyModel = id;
    if (this.objectMyModel == 1) {
      this.objectForm.my = false;
      this.findObjects(1);
    } else if (this.objectMyModel == 2) {
      this.objectForm.my = true;
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

  findObjects(pageNo: number) {
    this.ngxLoader.startBackground();
    this.objectFilterDto = new ObjectFilterDto();
    this.objectFilterDto.pageNumber = pageNo - 1;
    this.objectFilterDto.pageSize = 10;
    if (!this.util.isNullOrEmpty(this.objectForm?.districtsId)) {
      this.objectFilterDto.districtId = parseInt(this.objectForm?.districtsId);
    }
    if (!this.util.isNullOrEmpty(this.objectForm?.typeHome)) {
      this.objectFilterDto.materialOfConstructionId = parseInt(this.objectForm?.typeHome);
    }
    if (!this.util.isNullOrEmpty(this.objectForm?.residentialComplexes)) {
      this.objectFilterDto.residentialComplexId = parseInt(this.objectForm?.residentialComplexes);
    }
    if (!this.util.isNullOrEmpty(this.objectForm?.objectTypes)) {
      this.objectFilterDto.objectTypeId = this.eventCall ? 1 : this.objectForm?.objectTypes.value;
    }
    if (!this.util.isNullOrEmpty(this.objectForm?.numKvart)) {
      this.objectFilterDto.apartmentNumber = parseInt(this.objectForm?.numKvart);
    }
    if (!this.util.isNullOrEmpty(this.objectForm?.zalog)) {
      this.objectFilterDto.encumbrance = this.objectForm?.zalog;
    }
    if (!this.util.isEmptyObject(new Period(this.objectForm?.priceFrom, this.objectForm?.priceTo))) {
      this.objectFilterDto.price = new Period(this.objectForm?.priceFrom, this.objectForm?.priceTo);
    }
    if (!this.util.isEmptyObject(new Period(this.objectForm?.floorFrom, this.objectForm?.floorTo))) {
      this.objectFilterDto.floor = new Period(this.objectForm?.floorFrom, this.objectForm?.floorTo);
    }
    if (!this.util.isEmptyObject(new Period(this.objectForm?.floorsFrom, this.objectForm?.floorsTo))) {
      this.objectFilterDto.floorInTheHouse = new Period(this.objectForm?.floorsFrom, this.objectForm?.floorsTo);
    }
    if (!this.util.isEmptyObject(new Period(this.objectForm?.totalAreaFrom, this.objectForm?.totalAreaTo))) {
      this.objectFilterDto.totalArea = new Period(this.objectForm?.totalAreaFrom, this.objectForm?.totalAreaTo);
    }
    if (!this.util.isEmptyObject(new Period(this.objectForm?.livingSpaceFrom, this.objectForm?.livingSpaceTo))) {
      this.objectFilterDto.livingArea = new Period(this.objectForm?.livingSpaceFrom, this.objectForm?.livingSpaceTo);
    }
    if (!this.util.isEmptyObject(new Period(this.objectForm?.kitchenAreaFrom, this.objectForm?.kitchenAreaTo))) {
      this.objectFilterDto.kitchenArea = new Period(this.objectForm?.kitchenAreaFrom, this.objectForm?.kitchenAreaTo);
    }

    if (!this.util.isNullOrEmpty(this.objectForm?.numberOfRooms)) {
      this.objectFilterDto.numberOfRooms = parseInt(this.objectForm?.numberOfRooms);
    }
    if (!this.util.isNullOrEmpty(this.objectForm?.my)) {
      this.objectFilterDto.my = this.objectForm?.my;
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
    this.ngxLoader.stopBackground();
  }

  isEmpty(obj: any): boolean {
    for(const key in obj) {
      if (obj[key]) {
        return false;
      }
    }
    return true;
  }

  getDicNameByLanguage(claim: any, column: string) {
    let x = this.util.getDicNameByLanguage();
    if (!this.util.isNullOrEmpty(claim[column]?.name)) {
      return claim[column]?.name[x];
    }
    return null;
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

  setNullableObjectTypes() {
    this.objectForm.objectTypes = null;
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
        if (this.eventObjectId.length >= 15) {
          this.notifyService.showWarning("Добавление событий ограничено! Вы превысили лимит добавления событий к данной заявке", "Инфомарция")
          return;
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
            prevUrl = prevUrl.split('&sellApplicationId=')[0] + '&sellApplicationId=' + object.applicationId
          } else {
            prevUrl = prevUrl + '&sellApplicationId=' + object.applicationId
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
      let prevUrl = '/create-claim/' + localStorage.getItem('applicationId') + '?activeTab=events' + '&eventObjectId=' + this.eventObjectId;
      this.util.navigateByUrl(prevUrl);
    }
  }

  expandedBlock() {
    this.expanded = !this.expanded;
  }
}
