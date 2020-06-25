import {Component, OnDestroy, OnInit} from '@angular/core';
import {Dic} from "../../../../models/dic";
import {Util} from "../../../../services/util";
import {FormBuilder, Validators} from "@angular/forms";
import {CreateClaimComponent} from "../create-claim.component";
import {EventsService} from "../../../../services/events.service";
import {NotificationService} from "../../../../services/notification.service";
import {EventsDTO} from "../../../../models/eventsDTO";
import {Subscription} from "rxjs";
import {NewDicService} from "../../../../services/new.dic.service";

@Component({
  selector: 'app-claim-events',
  templateUrl: './claim-events.component.html',
  styleUrls: ['./claim-events.component.scss']
})
export class ClaimEventsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
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

  constructor(private util: Util,
              private formBuilder: FormBuilder,
              private createClaimComponent: CreateClaimComponent,
              private eventsService: EventsService,
              private newDicService: NewDicService,
              private notificationService: NotificationService) {
    this.applicationId = this.createClaimComponent?.applicationId;
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
    this.subscriptions.add(this.newDicService.getDictionary('EventType').subscribe(res => {
      this.appStatusesSort = this.util.toSelectArray(res);
    }));
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.getEventsByApplicationId(event.page);
    }
  }

  getEventsByApplicationId(pageNo: number) {
    if (!this.applicationId) {
      return
    }
    let searchParams = {};
    searchParams['applicationId'] = this.applicationId;
    searchParams['pageNumber'] = pageNo - 1;
    searchParams['pageSize'] = this.itemsPerPage;
    this.subscriptions.add(this.eventsService.getEventsByApplicationId(searchParams).subscribe(res => {
      if (res != null && res.data != null) {
        for (const argument of res.data.data.data) {
          let obj = {};
          obj['applicationId'] = argument.applicationId;
          obj['comment'] = argument.comment;
          obj['description'] = argument.description;
          obj['eventId'] = argument.eventId;
          obj['operationType'] = argument.operationType;
          obj['photoSet'] = argument.photoSet;
          obj['realPropertyId'] = argument.realPropertyId;
          obj['eventDate'] = this.util.formatDate(argument.eventDate);
          obj['time'] = this.getTime(argument.eventDate);
          obj['eventType'] = argument.eventType
          obj['disabledDev'] = true
          obj['disabledDevComment'] = true
          this.eventsData.push(obj)
        }
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
      }
    }));
  }

  setDateTime() {
    if (!this.util.isNullOrEmpty(this.eventsForm.value.time)) {
      this.eventsForm.value.eventDate.setHours(this.eventsForm.value.time.hour);
      this.eventsForm.value.eventDate.setMinutes(this.eventsForm.value.time.minute);
    }
  }

  save() {
    this.setDateTime();
    this.subscriptions.add(this.eventsService.addEvent(this.eventsForm.value).subscribe(res => {
      this.eventsService.putCommentEvent(res, this.eventsForm.value.comment).subscribe();
      this.notificationService.showSuccess('Информация', 'Событие добавлено');
      this.getEventsByApplicationId(1);
    }))
  }

  update(events: any) {
    if (!this.util.isNullOrEmpty(events.time)) {
      events.eventDate = new Date(events.eventDate);
      events.eventDate.setHours(events.time.hour);
      events.eventDate.setMinutes(events.time.minute);
    } else {
      this.notificationService.showInfo('Информация', 'Введите время');
    }
    if (this.util.isNullOrEmpty(events.eventDate)) {
      this.notificationService.showInfo('Информация', 'Введите дату');
    }
    this.subscriptions.add(this.eventsService.updateEvent(events.eventId, events).subscribe(res => {
      this.changeDisableDev(events, true);
      this.notificationService.showSuccess('Информация', 'Событие изменено');
      this.eventsService.putCommentEvent(res, events.comment).subscribe();
    }));
  }

  getTime(date: any) {
    let time = {};
    time['hour'] = new Date(date).getUTCHours();
    time['minute'] = new Date(date).getUTCMinutes();
    return time;
  }

  deleteEvent(id: any) {
    if (confirm("Вы действительно хотите удалить событие?")) {
      this.subscriptions.add(this.eventsService.deleteEventById(id).subscribe(res => {
        this.getEventsByApplicationId(1);
      }));
    }
  }

  changeDisableDev(events: any, res: boolean) {
    events.disabledDev = res;
    events.disabledDevComment = res;
  }

  editEvent(events: any) {
    this.changeDisableDev(events, false);
  }

  editEventComment(events: any) {
    events.disabledDevComment = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
