import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {NotificationService} from "../../services/notification.service";
import {Util} from "../../services/util";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {ApplicationNotificationService} from "../../services/application.notification.service";
import {NotificationAddresses} from "../../models/notification/notification.addresses";
import {FormControl, FormGroup} from "@angular/forms";
import {Dic} from "../../models/dic";
import {NotificationFilter} from "../../models/notification/notification.filter";
import {language} from "../../../environments/language";
import {NotesDto} from "../../models/notification/notesDto";
import {CommentService} from "../../services/comment.service";
import {NotificationsUtil} from "../../services/notifications.util";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  _language = language;
  pageable = {
    direction: 'DESC',
    sortBy: 'id',
    pageNumber: 0,
    pageSize: 10
  };
  totalItems = 0;
  currentPage = 1;

  formGroup = new FormGroup({
    dateBeg: new FormControl(),
    dateEnd: new FormControl(),
    status: new FormControl(),
    notificationType: new FormControl(),
    applicationId: new FormControl(),
  });

  filterModel: NotificationFilter;
  dicStatus: Dic[];
  dicNotificationType: Dic[];

  sending: boolean = false;

  content: NotificationAddresses[];

  constructor(
    private notifyService: NotificationService,
    public util: Util,
    public router: Router,
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private applicationNotificationService: ApplicationNotificationService,
    private commentService: CommentService,
    private notificationsUtil: NotificationsUtil) {
    localStorage.setItem('url', this.router.url);
  }

  ngOnInit(): void {
    if (!this.authenticationService.currentUserValue) {
      //this.util.openAuthDialog();
      return;
    }
    this.filterModel = new NotificationFilter();
    this.find(0);
    this.getDicStatus();
    this.getAllNotificationType();
  }

  getDicStatus() {
    this.dicStatus = this.toSelectArray([
      {id: -1, multiLang: {nameRu: "Все", nameKz: "Все", nameEn: "Все"}},
      {id: 1, multiLang: {nameRu: "Прочитано", nameKz: "Прочитано", nameEn: "Прочитано"}},
      {id: 0, multiLang: {nameRu: "Новое", nameKz: "Новое", nameEn: "Новое"}}
    ],);
  }

  toSelectArray(data, idField = 'id', labelField = this.getDicNameByLanguage()) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        list.push({
          value: data[i][idField],
          label: data[i].multiLang ? data[i].multiLang[labelField] : data[i][labelField],
          code: data[i]['code'],
          operationCode: data[i]['operationCode']
        });
      }
    }
    return list;
  }

  getDicNameByLanguage() {
    let fieldName;
    switch (this._language.language) {
      case "kz":
        fieldName = 'nameKz';
        break;
      case "en":
        fieldName = 'nameEn';
        break;
      default:
        fieldName = 'nameRu';
        break;
    }
    return fieldName;
  }

  find(page) {
    if (this.filterModel.status == 1) {
      this.filterModel.opened = true;
    } else if (this.filterModel.status == 0) {
      this.filterModel.opened = false;
    } else {
      this.filterModel.opened = null;
    }
    this.pageable.pageNumber = page;
    let params = {
      filter: this.filterModel,
      pageable: this.pageable
    };
    this.applicationNotificationService.getAllPageable(params)
      .subscribe(res => {
        this.content = res.content;

        this.totalItems = res.totalElements;
        this.currentPage = res.pageable.pageNumber + 1;
      }, err => {
        this.notifyService.showError(err, '');
      });

  }

  sanitize(val): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(val);
  }

  clearForm() {
    this.filterModel = new NotificationFilter();
    this.find(0);
  }

  getAllNotificationType() {
    this.applicationNotificationService.getAllNotificationType().subscribe(res => {
      this.dicNotificationType = this.toSelectArray(res, 'id', 'name');
    }, err => {
      this.notifyService.showError(err, '');
    });
  }

  opened(item: NotificationAddresses) {
    if (item.isReadBody) {
      item.isReadBody = false;
      return;
    }
    item.isReadBody = true;
    if (!item.isOpened) {
      this.applicationNotificationService.opened(item.notification.id).subscribe(res => {
        item.isOpened = true;
        this.notificationsUtil.getNotifCount();
      }, err => {
        this.notifyService.showError(err?.message?.ru, '');
      });
    }
  }

  answerBtnClick(item: NotificationAddresses) {
    if (this.sending) {
      return;
    }
    const data: NotesDto = {
      realPropertyId: item.notification.realPropertyId,
      text: item.notification.answer,
      questionId: item.notification.notesId
    };
    this.sending = true;
    this.commentService.saveComment(data).subscribe(res => {
      this.sending = false;
      if (res) {
        this.notifyService.showInfo('Ответ отправлен!', '');
        item.notification.answer = null;
        item.isWriteAnswer = false;
      }
    }, err => {
      this.sending = false;
      this.notifyService.showError(err?.ru, '');
    });
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.find(event.page-1);
    }
  }
}
