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
import {BsLocaleService} from "ngx-bootstrap";
import {defineLocale} from "ngx-bootstrap/chronos";
import {ruLocale} from "ngx-bootstrap/locale";

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit {

  locale: string = 'ru-KZ';
  events: CalendarEvent[] = [];

  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  refresh: Subject<any> = new Subject();


  viewDate: Date = new Date();

  modalData: {
    event: CalendarEvent;
  };

  eventsData = [];
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;
  date: any;

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal,
              private eventsService: EventsService,
              private util: Util,
              private localeService: BsLocaleService) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  ngOnInit() {
    this.getEventForCalendar();
  }

  handleEvent(event: CalendarEvent) {
    // this.util.dnHref('')
    // this.modalData = {event};
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

  getDicNameByLanguage(data: any, column: string) {
    let x = this.util.getDicNameByLanguage();
    return data[column]?.name[x];
  }

  getEventsByDate(pageNo: number) {
    const searchFilter = {};
    searchFilter['direction'] = 'ASC';
    searchFilter['sortBy'] = 'id';
    searchFilter['pageNumber'] = pageNo - 1;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.eventsService.getEventsByDate(addDays(this.date, 1)).subscribe(res => {
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
    searchParams['to'] = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
    this.eventsService.getEventsForCalendar(searchParams).subscribe(obj => {
      if (!this.util.isNullOrEmpty(obj.data)) {
        this.events = [];
        obj.data.data.forEach(e => {
          let data = {
            start: subDays(startOfDay(new Date(e.eventDate)), 1),
            end: subDays(startOfDay(new Date(e.eventDate)), 1),
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
        let color: {
          primary: '#ad2121',
          secondary: '#FAE3E3',
        }
        return color;
      case 2:
        let color2: {
          primary: '#e3bc08',
          secondary: '#FDF1BA',
        }
        return color2;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
    }
    /*
        "id": 1, Первичный контакт
        "id": 2 Встреча,
        "id": 3 Договор на оказание услуг,
        "id": 4 Реклама,
        "id": 5 Фотосет,
        "id": 6 Показ,
        "id": 7 Закрытие сделки,
        "id": 8 Успешно,
        "id": 9 Завершен,
        "id": 34 Договор о задатке/авансе,
    */
  }
}
