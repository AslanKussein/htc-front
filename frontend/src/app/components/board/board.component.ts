import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BoardService} from "../../services/board.service";
import {DicService} from "../../services/dic.service";
import {Dic} from "../../models/dic";
import {Util} from "../../services/util";
import {NotificationService} from "../../services/notification.service";
import {Board} from "../../models/board/board";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  appStatuses: Dic[];
  appStatusesSort: Dic[];
  appStatusesData: any;
  board: Board;
  private _boardSelect: Board;
  totalCommission: number;
  applicationCount: number;
  activeTab: number = 1;
  displayBoardContent: boolean = true;

  get boardSelect(): Board {
    return this._boardSelect;
  }


  constructor(private boardService: BoardService,
              private dicService: DicService,
              private util: Util,
              private notificationService: NotificationService,
              private ngxLoader: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    this.dicService.getDics('APPLICATION_STATUSES').subscribe(data => {
      this.appStatuses = this.util.toSelectArray(data);
      this.sortStatusesDic(this.activeTab);
    });
  }

  getBoardData(tab: number, ids: number) {
    let searchFilter = {};
    searchFilter['agentLoginList'] = ['artursaduov'];
    // searchFilter['agentLoginList'] = this.util.getCurrentUser().roles;
    searchFilter['applicationStatusList'] = ids;
    searchFilter['operationTypeId'] = tab == 3 ? null : tab;
    this.boardService.getBoard(searchFilter).subscribe(res => {
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
          if (argument.id == 1) {
            argument['board.data.style'] = 'addRight';
          }
          console.log(argument)
          this.appStatusesData.push(argument)
        }
        this.applicationCount = res?.data.applicationCount
        this.totalCommission = res?.data.totalCommission
      } else {
        this.notificationService.showWarning('Информация', 'Техническая ошибка');
      }
    });
    this.ngxLoader.stop();
  }

  getStatusIdsByTab() {
    let ids;
    if (this.activeTab == 3) {
      ids = [1, 2, 3, 5, 4, 6, 7];
    } else if (this.activeTab == 2) {
      ids = [1, 2, 3, 4, 5, 6, 7]
    } else if (this.activeTab == 1) {
      ids = [1, 3, 6, 7]
    }
    return ids;
  }

  sortStatusesDic(tab: number) {
    this.appStatusesSort = [];
    this.activeTab = tab;
    let ids = this.getStatusIdsByTab();
    for (const status of this.appStatuses) {
      if (ids.includes(parseInt(status['value']))) {
        let m = {};
        m['value'] = status['value'];
        m['label'] = status['label'];
        m['code'] = status['code'];
        this.appStatusesSort.push(m)
      }
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
   * @param event
   * @param item
   * @param prevStatusId
   */
  changeStatus(event: CdkDragDrop<string[]>, item: any, prevStatusId: number) {
    if (parseInt(event.previousContainer.id) > parseInt(event.container.id)) {
      return
    }
    let currentStatusId = parseInt(event.container.id);
    if (currentStatusId == 7) {
      this._boardSelect = item;
      this.util.dnHref('board/close-deal/' + this.activeTab);
      this.displayBoardContent = false;

    }
    if (this.activeTab == 2) {// воронка покупателей
      if (prevStatusId == 1 && currentStatusId == 2) {//  2.1. С "Первичный контакт *" на "Встреча *"
        alert('add event')
      } else if (prevStatusId == 2 && currentStatusId == 3) {//2.2. С "Встреча *" на "Договор на оказание услуг *"
        alert('create dogovor')
      } else if (prevStatusId == 3 && currentStatusId == 4) {//2.2. С "Встреча *" на "Договор на оказание услуг *"
        alert('create dogovor')
      } else {
        return;
      }
    }


    if (prevStatusId == 1 && currentStatusId == 2) {//  2.1. С "Первичный контакт *" на "Встреча *"
      alert('add event')
    }
    if (prevStatusId == 2 && currentStatusId == 3) {//2.2. С "Встреча *" на "Договор на оказание услуг *"
      alert('create dogovor')
    }

    // let data = {applicationId: item.id, statusId: currentStatusId};
    // console.log(event.container)
    // this.boardService.changeStatus(data).subscribe(res => {
    //   console.log(res)
    // })
    // this.sortStatusesDic(this.activeTab);
    // ;
  }
}
