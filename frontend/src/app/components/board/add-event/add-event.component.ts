import {Component, OnDestroy, OnInit} from '@angular/core';
import {BoardComponent} from "../board.component";
import {EventsService} from "../../../services/events.service";
import {Util} from "../../../services/util";
import {FormBuilder, Validators} from "@angular/forms";
import {NotificationService} from "../../../services/notification.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  time: {
    "hour": 0,
    "minute": 0,
  }
  date: Date = new Date();
  boardSelect: any;
  eventsForm: any;
  text: string;

  constructor(private board: BoardComponent,
              private util: Util,
              private eventsService: EventsService,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService) {
    this.boardSelect = this.board.boardSelect;
    console.log(this.boardSelect)
    this.board.displayBoardContent = false;
    if (this.util.isNullOrEmpty(this.boardSelect)) {
      this.cancel()
    }
  }

  createValue() {
    let text = this.boardSelect?.operationType.name[this.util.getDicNameByLanguage()];
    text += " - " + this.boardSelect?.numberOfRooms + ' ком. ' + this.boardSelect?.objectType.name[this.util.getDicNameByLanguage()];
    text += " цена " + this.boardSelect?.price;
    this.text = text;
  }

  setDateTime() {
    if (!this.util.isNullOrEmpty(this.eventsForm.value.time)) {
      this.eventsForm.value.eventDate.setHours(this.eventsForm.value.time.hour);
      this.eventsForm.value.eventDate.setMinutes(this.eventsForm.value.time.minute);
    }
  }

  ngOnInit(): void {
    this.eventsForm = this.formBuilder.group({
      comment: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      eventDate: [this.date, Validators.required],
      eventTypeId: [3, Validators.required],
      sourceApplicationId: [this.boardSelect?.id, Validators.required],
      time: [this.time, Validators.required],
    });
    this.createValue();
  }

  get f() {
    return this.eventsForm.controls;
  }

  addEvent() {
    this.setDateTime();
    this.subscriptions.add(this.eventsService.addEvent(this.eventsForm.value).subscribe(res => {
      this.eventsService.putCommentEvent(res, this.eventsForm.value.comment).subscribe();
      this.notificationService.showSuccess('Информация', 'Статус изменен');
      this.board.sortStatusesDic(this.board.activeTab);
    }))
  }

  cancel() {
    this.util.dnHref('board');
    this.board.displayBoardContent = true;
    this.board.sortStatusesDic(this.board.activeTab);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
