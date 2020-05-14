import {Component, OnInit} from '@angular/core';
import {ObjectService} from "../../../services/object.service";
import {Util} from "../../../services/util";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ruLocale} from "ngx-bootstrap/locale";
import {BsLocaleService} from "ngx-bootstrap";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-my-objects',
  templateUrl: './my-objects.component.html',
  styleUrls: ['./my-objects.component.scss']
})
export class MyObjectsComponent implements OnInit {
  text: string;

  constructor(private objectService: ObjectService,
              private localeService: BsLocaleService,
              private notifyService: NotificationService,
              private util: Util) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  ngOnInit(): void {
    this.findObjects(1);
  }

  objectsData
  totalItems = 0;
  itemsPerPage = 20;
  currentPage = 1;

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findObjects(event.page);
    }
  }

  findObjects(pageNo: number) {
    let searchFilter = {};
    searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    searchFilter['my'] = true;
    searchFilter['text'] = this.text;

    this.objectService.getObjects(searchFilter).subscribe(res => {
      this.objectsData = res.data.data.data;
      this.totalItems = res.data.total;
      this.currentPage = res.data.pageNumber + 1;
      if(res.data.data.size==0){
        this.notifyService.showInfo('Ничего не найдено!', 'Внимание');
      }
    });
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

}
