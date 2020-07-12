import {Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit,} from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,} from 'date-fns';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import {CustomDateFormatter} from './customDateFormatter';
import {EventsService} from "../../../services/events.service";
import {Util} from "../../../services/util";

const colors: any = {
  blue: {
    primary: '#0f42d9',
    secondary: '#0c2878',
  },
  yellow: {
    primary: '#eec406',
    secondary: '#a88a00',
  },
  green: {
    primary: '#519012',
    secondary: '#06e748',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit {

  locale: string = 'ru-Ru';
  events: CalendarEvent[] = [];

  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  refresh: Subject<any> = new Subject();

  viewDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  eventsData = [];
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;
  date: any;


  constructor(private modal: NgbModal,
              private eventsService: EventsService,
              private util: Util) {
  }

  ngOnInit() {
    this.getEventForCalendar();
  }

  handleEvent(event: CalendarEvent) {
    this.modal.open(this.modalContent, {size: 'lg'});
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.getEventsByDate(event.page);
    }
  }

  getEventsByClick({date, events}: { date: Date; events: CalendarEvent[] }) {
    this.date = date;
    this.getEventsByDate(1);
  }

  format(date: any) {
    return this.util.formatDate(date);
  }

  format2(date: any) {
    return new Date(date).toLocaleString();
  }

  getDicNameByLanguage(data: any, column: string) {
    let x = this.util.getDicNameByLanguage();
    return data[column]?.name[x];
  }

  getEventsByDate(pageNo: number) {
    console.log(this.date)
    console.log()
    this.eventsService.getEventsByDate(startOfDay(addDays(this.date, 1))).subscribe(res => {
      if (res != null && res.data != null) {
        this.eventsData = res.data.data.data;
        this.totalItems = res.data.total;
        this.currentPage = res.data.pageNumber + 1;
        if (!this.util.isNullOrEmpty(this.eventsData)) {
          this.modal.open(this.modalContent, {size: 'xl'});
        }
      }
    });
  }

  getEventForCalendar() {
    let searchParams = {};
    searchParams['from'] = this.viewDate;
    searchParams['to'] = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.eventsService.getEventsForCalendar(searchParams).subscribe(obj => {
      if (!this.util.isNullOrEmpty(obj.data)) {
        this.events = [];

        obj.data.data.forEach(e => {
          // console.log(subDays(startOfDay(new Date(e.eventDate)), 0))
          let data = {
            start: new Date(e.eventDate),
            end: new Date(e.eventDate),
            title: e.eventType.name[this.util.getDicNameByLanguage()],
            color: this.getColorsByStatusId(e.eventType.id),
            allDay: true,
          }
          this.refresh.next();
          this.events.push(data)
        })
      }
    });
  }

  getColorsByStatusId(statusId: number) {
    switch (statusId) {
      case 1:
        return colors.blue;
      case 2:
        return colors.yellow;
      case 3:
        return colors.green;
    }
    //1 показ 2 звонок 3 встреча
    //Просил цвета на отметки: синий – показ, зеленый – встреча, желтый – звонок.
  }
}
