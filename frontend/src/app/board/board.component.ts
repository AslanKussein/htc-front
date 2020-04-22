import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BoardService} from "../services/board.service";
import {DicService} from "../services/dic.service";
import {Dic} from "../models/dic";
import {Util} from "../services/util";
import {NotificationService} from "../services/notification.service";
import {Board} from "../models/board/board";
import {BoardData} from "../models/board/board.data";

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
  boardData: Board[] = [];

  constructor(private boardService: BoardService,
              private dicService: DicService,
              private util: Util,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.dicService.getDics('APPLICATION_STATUSES').subscribe(data => {
      this.appStatuses = this.util.toSelectArray(data);
    });
  }

  getBoardData() {
    let searchFilter = {};
    searchFilter['agentLoginList'] = ['admin', 'system'];
    searchFilter['applicationStatusList'] = [2, 1];
    searchFilter['operationTypeId'] = 1;
    this.boardService.getBoard(searchFilter).subscribe(res => {
      if (res.code == 200 && res.data.applicationMap != null) {
        this.appStatusesData = [];
        for (const argument of this.appStatusesSort) {
          if (res.data.applicationMap[argument['code']] != null) {
            argument['boardData'] = res.data.applicationMap[argument['code']];
          } else {
            this.board = new Board();
            this.board.data = [];
            argument['boardData'] = this.board;
          }
          this.appStatusesData.push(argument)
        }
        console.log(this.appStatusesData)
      } else {
        this.notificationService.showWarning('Информация', 'Техническая ошибка');
      }
    });
  }

  sortStatusesDic(tab: number) {
    this.appStatusesSort = [];
    let ids;
    if (tab == 2) {
      ids = [1, 2, 3, 4, 5, 6, 7]
    } else if (tab == 3) {
      ids = [1, 3, 6, 7]
    }
    for (const status of this.appStatuses) {
      if (ids.includes(parseInt(status['value']))) {
        let m = {};
        m['value'] = status['value'];
        m['label'] = status['label'];
        m['code'] = status['code'];
        this.appStatusesSort.push(m)
      }
    }
    this.getBoardData();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}
