import {Component, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BoardService} from "../../services/board.service";
import {Dic} from "../../models/dic";
import {Util} from "../../services/util";
import {NotificationService} from "../../services/notification.service";
import {Board} from "../../models/board/board";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";
import {NewDicService} from "../../services/new.dic.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  appStatuses: Dic[];
  appStatusesSort: Dic[];
  appStatusesData: any;
  board: Board;
  private _boardSelect: Board;
  totalCommission: number;
  applicationCount: number;
  activeTab: number = 3;
  displayBoardContent: boolean = true;
  agentList: Dic[];

  get boardSelect(): Board {
    return this._boardSelect;
  }

  constructor(private boardService: BoardService,
              private util: Util,
              private notificationService: NotificationService,
              private ngxLoader: NgxUiLoaderService,
              private newDicService: NewDicService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    this.subscriptions.add(this.newDicService.getDictionary('ApplicationStatus').subscribe(res => {
      this.appStatuses = this.util.toSelectArray(res);
      this.sortStatusesDic(this.activeTab);
    }));

    this.subscriptions.add(this.userService.getAgents().subscribe(obj => {
      this.agentList = obj.data;
    }));
  }

  getBoardData(tab: number, ids: number) {
    let searchFilter = {};
    searchFilter['agentLoginList'] = ['artursaduov'];
    // searchFilter['agentLoginList'] = this.util.getCurrentUser().roles;
    searchFilter['applicationStatusList'] = ids;
    searchFilter['operationTypeId'] = tab == 3 ? null : tab;
    this.subscriptions.add(this.boardService.getBoard(searchFilter).subscribe(res => {
      if (res.code == 200 && res.data.applicationMap != null) {
        this.appStatusesData = [];
        for (const argument of this.appStatusesSort) {
          if (res.data.applicationMap[argument['code']] != null) {
            argument['boardData'] = res.data.applicationMap[argument['code']];
          } else {
            this.board = new Board();
            this.board.applicationLightDtoList = {};
            this.board.applicationLightDtoList.data = []
            argument['boardData'] = this.board;
          }

          this.appStatusesData.push(argument)
        }
        this.applicationCount = res?.data.applicationCount
        this.totalCommission = res?.data.totalCommission
      } else {
        this.notificationService.showWarning('Информация', 'Техническая ошибка');
      }
    }));
    this.ngxLoader.stop();
  }

  getStatusIdsByTab() {
    let ids;
    if (this.activeTab == 3) {
      ids = [1, 2, 3, 5, 4, 6, 7];
    } else if (this.activeTab == 2) {
      ids = [1, 2, 3, 4, 5, 6, 7]
    } else if (this.activeTab == 1) {
      ids = [1, 2, 3, 6, 10, 7]
    }
    return ids;
  }

  /*
    "id": 1,002001 : "Первичный контакт",
    "id": 2,002002: "Встреча",
    "id": 3,002003: "Договор на оказание услуг",
    "id": 4,002004: "Реклама",
    "id": 5,002005: "Фотосет",
    "id": 6,002006: "Показ",
    "id": 7,002007: "Закрытие сделки",
    "id": 8,002008: "Успешно",
    "id": 9,002009: "Завершен",
    "id": 10,002010: "Договор о задатке/авансе",
  }
]*/
  getStatusCodesByTab() {
    let code;
    if (this.activeTab == 3) {
      code = ['002001', '002002', '002003', '002005', '002004', '002006', '002010', '002007'];
    } else if (this.activeTab == 2) {
      code = ['002001', '002002', '002003', '002005', '002004', '002006', '002007']
    } else if (this.activeTab == 1) {
      code = ['002001', '002002', '002003', '002006', '002010', '002007']
    }
    return code;
  }

  getDictionaryValueById(code: string) {
    for (const obj of this.appStatuses) {
      if (obj['code'] == code) {
        return obj;
      }
    }
  }

  sortStatusesDic(tab: number) {
    this.appStatusesSort = [];
    this.activeTab = tab;
    let ids = this.getStatusIdsByTab();
    let code = this.getStatusCodesByTab();
    for (const status of code) {
      let m = {};
      let dic = this.getDictionaryValueById(status);
      m['value'] = dic['value'];
      m['label'] = dic['label'];
      m['code'] = status;
      this.appStatusesSort.push(m)
    }
    this.getBoardData(tab, ids);
  }

  getBgColorBySumm(price: number) {
    let bgColor = 'bg-primary'
    if (price > 15000000 && price < 25000000) {
      alert(1)
      bgColor = 'bg-warning'
    } else if (price > 25000000 && price < 35000000) {
      bgColor = 'bg-success'
    } else if (price > 35000000 && price < 45000000) {
      bgColor = 'bg-secondary'
    } else if (price > 45000000) {
      bgColor = 'bg-info'
    }
    return bgColor;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (parseInt(event.previousContainer.id) > parseInt(event.container.id)) {
      return
    }
    let currentStatusId = parseInt(event.container.id);
    let prevStatusId = parseInt(event.previousContainer.id);

    if (prevStatusId == 1 && currentStatusId != 2) {
      return;
    }
    if (prevStatusId == 2 && currentStatusId != 3) {
      return;
    }
    if (this.activeTab == 2) {
      if (prevStatusId == 3 && currentStatusId != 6) {
        return;
      }
      if (prevStatusId == 6 && currentStatusId != 7) {
        return;
      }
    } else if (this.activeTab == 1) {

      if (prevStatusId == 6 && currentStatusId != 10) {
        return;
      }
      if (prevStatusId == 10 && currentStatusId != 7) {
        return;
      }
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getDicNameByLanguage() {
    return this.util.getDicNameByLanguage();
  }

  /**
   "id": 1, "Первичный контакт",
   "id": 2, Встреча
   "id": 3, Договор на оказание услуг
   "id": 4, Реклама
   "id": 5, Фотосет
   "id": 6, Показ
   "id": 7, Закрытие сделки
   "id": 8, Успешно
   "id": 9, Завершен
   "id": 10, Договор о задатке/авансе
   * @param event
   * @param item
   * @param prevStatusId
   */
  changeStatus(event: CdkDragDrop<string[]>, item: any, prevStatusId: number) {
    if (parseInt(event.previousContainer.id) > parseInt(event.container.id)) {
      return
    }
    this._boardSelect = item;

    let currentStatusId = parseInt(event.container.id);

    let data = {applicationId: item.id, statusId: currentStatusId};

    if (this.activeTab == 1) {// воронка покупателей
      if (prevStatusId == 1 && currentStatusId == 2) {//  2.1. С "Первичный контакт *" на "Встреча *"
        this.openInnerPage('board/add-event');
      } else if (prevStatusId == 2 && currentStatusId == 3) {//2.2. С "Встреча *" на "Договор на оказание услуг *"
        alert('create dogovor')
      } else if (prevStatusId == 3 && currentStatusId == 6) {//  2.3. С "Договор на оказание услуг *" на "Показ *"
        this.moveStatus(data);
      } else if (prevStatusId == 6 && currentStatusId == 10) { // 2.4. С "Показ *" на "Договор о задатке/авансе *"
        alert('БУДЕТ ССЫЛКА')
      }else if (prevStatusId == 6 && currentStatusId == 7) { //NEW С "Показ *" на на "Закрытие сделки *" - обязательный статус
        alert('БУДЕТ ССЫЛКА')
      } else if (prevStatusId == 10 && currentStatusId == 7) { // 2.5. С "Договор о задатке/авансе *" на "Закрытие сделки *"
        this.openInnerPage('board/close-deal/' + this.activeTab);
      }
    } else if (this.activeTab == 2) {// воронка ПРОДАЖИ
      if (prevStatusId == 1 && currentStatusId == 2) {//  2.1. С "Первичный контакт *" на "Встреча *"
        this.openInnerPage('board/add-event');
      } else if (prevStatusId == 2 && currentStatusId == 3) {//2.2. С "Встреча *" на "Договор на оказание услуг *"
        alert('create dogovor')
      } else if (prevStatusId == 3 && (currentStatusId == 4 || currentStatusId == 5)) {// С "Договор на оказание услуг *" на "Фотосет", "Реклама"
        this.moveStatus(data);
      } else if (prevStatusId == 3 && currentStatusId == 6) {//  2.4. С "Договор на оказание услуг *" на "Показ *"
        this.moveStatus(data);
      } else if ((prevStatusId == 4 || prevStatusId == 5) && currentStatusId == 6) {//  2.5. Фотосет" или "Реклама" на статус "Показ"
        this.moveStatus(data);
      } else if (prevStatusId == 5 && currentStatusId == 4) {// 2.4 NEW Заявка может переноситься со статуса "Фотосет" на статус "Реклама"
        this.moveStatus(data);
      } else if (prevStatusId == 6 && currentStatusId == 7) { // 2.5. С "Договор о задатке/авансе *" на "Закрытие сделки *"
        this.openInnerPage('board/close-deal/' + this.activeTab);
      }
    }
    this.sortStatusesDic(this.activeTab);
  }

  openInnerPage(url: string) {
    this.util.dnHref(url);
    this.displayBoardContent = false;
  }

  moveStatus(data: any) {
    this.subscriptions.add(this.boardService.changeStatus(data).subscribe(res => {
      this.sortStatusesDic(this.activeTab);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
