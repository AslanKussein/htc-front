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
      this.sortStatusesDic(3);
    });
  }

  getBoardData(tab: number, ids: number) {
    let searchFilter = {};
    searchFilter['agentLoginList'] = this.util.getCurrentUser().roles;
    searchFilter['applicationStatusList'] = ids;
    searchFilter['operationTypeId'] = tab == 3 ? null : tab;
    this.boardService.getBoard(searchFilter).subscribe(res => {
      if (res.code == 200 && res.data.applicationMap != null) {
        this.appStatusesData = [];
        for (const argument of this.appStatusesSort) {
          if (res.data.applicationMap[argument['code']] != null) {
            argument['size'] = res.data.applicationMap[argument['code']].size
            argument['boardData'] = res.data.applicationMap[argument['code']];
          } else {
            this.board = new Board();
            this.board.data = [];
            argument['boardData'] = this.board;
            argument['size'] = 0
          }
          if (argument.id == 1) {
            argument['board.data.style'] = 'addRight';
          }

          this.appStatusesData.push(argument)
        }
      } else {
        this.notificationService.showWarning('Информация', 'Техническая ошибка');
      }
    });
    this.ngxLoader.stop();
  }

  sortStatusesDic(tab: number) {
    this.appStatusesSort = [];
    let ids;
    if (tab == 3) {
      ids = [1, 2, 3, 5, 4, 6, 7];
    } else if (tab == 2) {
      ids = [1, 2, 3, 4, 5, 6, 7]
    } else if (tab == 1) {
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
    this.getBoardData(tab, ids);
  }

  getBgColorBySumm(price: number) {
    let bgColor = 'bg-primary'
    if (price > 15000000 && price < 25000000) {
      bgColor = 'bg-warning'
    } else if (price > 25000000 && price < 35000000) {
      bgColor = 'bg-success'
    } else if (price > 35000000 && price < 45000000) {
      bgColor = 'bg-secondary'
    }
    return bgColor;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (parseInt(event.previousContainer.id.split('cdk-drop-list-')[1]) > parseInt(event.container.id.split('cdk-drop-list-')[1])) {
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

}
