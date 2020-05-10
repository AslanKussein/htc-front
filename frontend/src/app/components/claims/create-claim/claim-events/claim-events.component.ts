import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ruLocale} from "ngx-bootstrap/locale";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/ru-KZ";
import {BsLocaleService} from "ngx-bootstrap";
import {Dic} from "../../../../models/dic";
import {DicService} from "../../../../services/dic.service";
import {Util} from "../../../../services/util";
import {FormBuilder, Validators} from "@angular/forms";
import {CreateClaimComponent} from "../create-claim.component";
import {EventsService} from "../../../../services/events.service";
import {NotificationService} from "../../../../services/notification.service";
import {EventsDTO} from "../../../../models/eventsDTO";

@Component({
  selector: 'app-claim-events',
  templateUrl: './claim-events.component.html',
  styleUrls: ['./claim-events.component.scss']
})
export class ClaimEventsComponent implements OnInit {

  time: {
    "hour": 0,
    "minute": 0,
  }
  appStatusesSort: Dic[] = [];
  eventsForm: any;
  date: Date = new Date();
  applicationId: number;
  eventsData = [];
  totalItems = 0;
  itemsPerPage = 3;
  currentPage = 1;
  eventsDTO: EventsDTO;

  constructor(private localeService: BsLocaleService,
              private dicService: DicService,
              private util: Util,
              private formBuilder: FormBuilder,
              private createClaimComponent: CreateClaimComponent,
              private eventsService: EventsService,
              private notificationService: NotificationService) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
    this.applicationId = 175;
    // this.applicationId = this.createClaimComponent?.applicationId;
    registerLocaleData(localeFr, 'ru-KZ');
  }

  ngOnInit(): void {
    this.eventsDTO = new EventsDTO();
    this.eventsForm = this.formBuilder.group({
      comment: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      eventDate: [this.date, Validators.required],
      eventTypeId: [null, Validators.required],
      sourceApplicationId: [this.applicationId, Validators.required],
      time: [this.time, Validators.required],
    });
    this.getEventsByApplicationId(1);
    this.sortStatus();
  }

  sortStatus() {
    let m = {};
    m['value'] = 1;
    m['label'] = 'Показ';
    this.appStatusesSort.push(m)
    m = {};
    m['value'] = 2;
    m['label'] = 'Звонок';
    this.appStatusesSort.push(m)
    m = {};
    m['value'] = 3;
    m['label'] = 'Встреча';
    this.appStatusesSort.push(m)
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.getEventsByApplicationId(event.page);
    }
  }

  getEventsByApplicationId(pageNo: number) {
    let searchParams = {};
    searchParams['applicationId'] = this.applicationId;
    searchParams['pageNumber'] = pageNo - 1;
    searchParams['pageSize'] = this.itemsPerPage;
    this.eventsService.getEventsByApplicationId(searchParams).subscribe(res => {
      if (res != null && res.data != null) {
        this.eventsData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
      }
    })
  }

  setDateTime() {
    if (!this.util.isNullOrEmpty(this.eventsForm.value.time)) {
      this.eventsForm.value.eventDate.setHours(this.eventsForm.value.time.hour);
      this.eventsForm.value.eventDate.setMinutes(this.eventsForm.value.time.minute);
    }
  }

  save() {
    this.setDateTime();
    this.eventsService.addEvent(this.eventsForm.value).subscribe(res => {
      this.eventsService.putCommentEvent(res, this.eventsForm.value.comment).subscribe();
      this.notificationService.showSuccess('Информация', 'Событие добавлено');
      this.getEventsByApplicationId(1);
    })
  }

  getDateByString(events: any) {
    console.log(events)
    this.eventsDTO.eventDate = new Date(events.eventDate);
  }

  deleteEvent(id: any) {
    this.eventsService.deleteEventById(id).subscribe(res => {
      this.getEventsByApplicationId(1);
    });
  }
}
