import {Component, OnDestroy, OnInit} from '@angular/core';
import {Dic} from "../../../../models/dic";
import {Util} from "../../../../services/util";
import {CreateClaimComponent} from "../create-claim.component";
import {EventsService} from "../../../../services/events.service";
import {NotificationService} from "../../../../services/notification.service";
import {EventsDTO} from "../../../../models/eventsDTO";
import {Subscription} from "rxjs";
import {NewDicService} from "../../../../services/new.dic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ClaimService} from "../../../../services/claim.service";
declare var jquery: any;   // not required
declare var $: any;   // not required

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
  date: Date = new Date();
  applicationId: number;
  eventsData = [];
  eventObjects: any;
  eventObjectId: number;
  totalItems = 0;
  itemsPerPage = 3;
  currentPage = 1;
  eventsDTO: EventsDTO;
  commentDev: boolean = true;
  today = new Date();

  constructor(private util: Util,
              private router: Router,
              private actRoute: ActivatedRoute,
              private createClaimComponent: CreateClaimComponent,
              private claimService: ClaimService,
              private eventsService: EventsService,
              private newDicService: NewDicService,
              private notificationService: NotificationService) {
    this.applicationId = this.createClaimComponent?.applicationId;
  }

  ngOnInit(): void {
    this.eventsDTO = new EventsDTO();
    this.getEventsByApplicationId(1);
    this.sortStatus();
    this.eventObjects = [];
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('eventObjectId'))) {
      let a = this.util.toString(this.actRoute.snapshot.queryParamMap.get('eventObjectId'));
      a.split(',').forEach(e => {
        this.callShowEvent(e);
      });
      this.eventsDTO.eventTypeId = 1
    } else {
      this.eventObjects = [new EventsDTO(null, null, null, new Date(), null, this.applicationId, null, null, null)];
    }
    $("#wrapper").toggleClass("toggled");
  }

  callShowEvent(id) {
    this.subscriptions.add(
      this.claimService.getClaimById(id).subscribe(res => {
        let info = res.operationTypeId == 1 ? 'Купить' : 'Продать';
        info += res.objectTypeId == 1 ? ' квартиру ' : ' дом ';
        let events = new EventsDTO();
        events.eventDate = new Date();
        events.eventTypeId = 1;
        events.sourceApplicationId = this.applicationId;
        events.targetApplicationId = id;
        events.info = info;
        this.eventObjects.push(events);
      })
    )
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
    this.eventsData = [];
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
          obj['targetApplicationId'] = argument.targetApplicationId;
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
          if (argument.eventType.id == 1) {
            this.subscriptions.add(
                this.claimService.getClaimById(argument.targetApplicationId).subscribe(res => {
                  let info = res.operationTypeId == 1 ? 'Купить' : 'Продать';
                  info += res.objectTypeId == 1 ? ' квартиру ' : ' дом ';
                  obj['info'] = info
                })
            )
          }
          this.eventsData.push(obj)
        }
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;

      }
    }));
  }

  save(eventsDTO: EventsDTO) {
    if (!this.util.isNullOrEmpty(eventsDTO.time)) {
      eventsDTO.eventDate.setHours(eventsDTO.time.hour);
      eventsDTO.eventDate.setMinutes(eventsDTO.time.minute);
    }
    this.subscriptions.add(this.eventsService.addEvent(eventsDTO).subscribe(res => {
      if (!this.util.isNullOrEmpty(eventsDTO.comment)) {
        this.eventsService.putCommentEvent(res, eventsDTO.comment).subscribe();
      }
      this.notificationService.showSuccess('Информация', 'Событие добавлено');
      this.getEventsByApplicationId(1);
      this.eventObjects.splice(eventsDTO, 1);
      if (this.eventObjects.length == 0) {
        this.clearForm();
      }

    }, e => this.notificationService.showInfo(e.ru, 'Информация')))
  }

  clearForm() {
    this.eventObjects = [new EventsDTO(null, null, null, new Date(), null, this.applicationId, null, null, null)];
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
    time['hour'] = new Date(date).getHours();
    time['minute'] = new Date(date).getMinutes();
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

  unBlock() {
    this.commentDev = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openShowEvent(id: number) {
    return `/create-claim/` + id;
    // return `/create-claim/` + id + String(`?activeTab=events`);
  }

  setShowEvent(eventsDTO: EventsDTO) {
    if (eventsDTO.eventTypeId == 1) {
      this.subscriptions.add(
        this.claimService.getClaimById(this.applicationId).subscribe(res => {
          localStorage.setItem('applicationId', this.util.toString(this.applicationId))
          if (res.operationTypeId == 1) {
            this.router.navigate(['objects'], {queryParams: {event: 'call'}})
          } else {
            this.router.navigate(['claims'], {queryParams: {event: 'call'}})
          }
        })
      )
    }
  }
}
