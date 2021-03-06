import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {HttpParams} from "@angular/common/http";
import {RoleManagerService} from "../../services/roleManager.service";
import {UploaderService} from "../../services/uploader.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  height: number;
  appStatuses: Dic[];
  appStatusesSort: Dic[];
  appStatusesData: any;
  board: Board;
  private _boardSelect: Board;
  totalCommission: number;
  applicationCount: number;
  activeTab: number = 3;
  selectId: number;
  displayBoardContent: boolean = true;
  agentList: any;
  login: any;
  modalRef2: BsModalRef;
  objectData: any;
  applicationId: number;
  isSell: boolean;
  targetAppData: any[] = [];
  isActive: boolean = false;
  secondId: number;
  file: any;
  isSellTargetApp: boolean;
  roles: any;
  isClosingDeal: boolean;
  isConfirmDeal: boolean;
  isUpload: boolean;
  percent: number;
  isTargetApplicationId: boolean;

  get boardSelect(): Board {
    return this._boardSelect;
  }

  @ViewChild('modalContentAdvance', {static: true}) private _modalContentAdvance: TemplateRef<any>;

  constructor(private boardService: BoardService,
              public util: Util,
              private modalService: BsModalService,
              private notificationService: NotificationService,
              private ngxLoader: NgxUiLoaderService,
              private newDicService: NewDicService,
              private router: Router,
              private actRoute: ActivatedRoute,
              private userService: UserService,
              private roleManagerService: RoleManagerService,
              private uploader: UploaderService) {

    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('activeTab'))) {
      this.activeTab = parseInt(this.actRoute.snapshot.queryParamMap.get('activeTab'));
    }
    this.util.showHideMenu(true);
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    this.subscriptions.add(this.userService.getAgents().subscribe(obj => {
      this.agentList = obj.data;
      this.subscriptions.add(this.newDicService.getDictionary('ApplicationStatus').subscribe(res => {
        this.appStatuses = this.util.toSelectArray(res);
        this.sortStatusesDic(this.activeTab);
      }));
    }));
    this.getCheckOperationList();
    setTimeout(() => {
      this.height = document.body.scrollHeight;
    }, 2000);
  }

  getCheckOperationList() {
    let params = new HttpParams();
    params = params.append('groupCodes', String('APPLICATION_GROUP'))
    params = params.append('groupCodes', String('REAL_PROPERTY_GROUP'))
    params = params.append('groupCodes', String('CLIENT_GROUP'))
    params = params.append('groupCodes', String('AGENT_GROUP'))
    this.roleManagerService.getCheckOperationList(params).subscribe(obj => {
      this.roles = obj.data;
    });
  }

  getBoardData(tab: number, ids: number, login) {
    this.ngxLoader.startBackground()
    let searchFilter = {};

    searchFilter['agentLoginList'] = login
    if (this.util.isNullOrEmpty(searchFilter['agentLoginList'])) {
      this.login = [];
      this.agentList.forEach(e => this.login.push(e?.login))
      searchFilter['agentLoginList'] = this.login;
    }
    if (this.util.isNullOrEmpty(searchFilter['agentLoginList'])) {
      searchFilter['agentLoginList'] = [this.util.getCurrentUser().login]
    }

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

          this.appStatusesData.push(argument);
        }
        this.applicationCount = res?.data.applicationCount
        this.totalCommission = res?.data.totalCommission
      } else {
        this.notificationService.showWarning('????????????????????', '?????????????????????? ????????????');
      }
    }));
    this.ngxLoader.stopBackground();
    this.ngxLoader.stop();
  }

  getStatusIdsByTab() {
    let ids;
    if (this.activeTab == 3) {
      ids = [1, 2, 3, 5, 4, 6, 7, 11, 12];
    } else if (this.activeTab == 2) {
      ids = [1, 2, 3, 4, 5, 6, 7, 11, 12];
    } else if (this.activeTab == 1) {
      ids = [1, 2, 3, 6, 10, 7, 11, 12];
    }
    return ids;
  }

  /*
    "id": 1,002001 : "?????????????????? ??????????????",
    "id": 2,002002: "??????????????",
    "id": 3,002003: "?????????????? ???? ???????????????? ??????????",
    "id": 4,002004: "??????????????",
    "id": 5,002005: "??????????????",
    "id": 6,002006: "??????????",
    "id": 7,002007: "???????????????? ????????????",
    "id": 8,002008: "??????????????",
    "id": 9,002009: "????????????????",
    "id": 10,002010: "?????????????? ?? ??????????????/????????????",
    "id": 11,002011: "???????????????????????? ???????????????? ???????????????????? ????????????",
    "id": 12,002012: "???????????????????????? ???? ?????????????????????????? ????????????"
  }
]*/
  getStatusCodesByTab() {
    let code;
    if (this.activeTab == 3) {
      code = ['002001', '002002', '002003', '002005', '002004', '002006', '002010', '002007', '002011', '002012'];
    } else if (this.activeTab == 2) {
      code = ['002001', '002002', '002003', '002005', '002004', '002006', '002007', '002011', '002012'];
    } else if (this.activeTab == 1) {
      code = ['002001', '002002', '002003', '002006', '002010', '002007', '002011', '002012'];
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

  filtredLogin(login: string) {
    if (!this.util.isNullOrEmpty(login)) {
      this.login = [login];
    } else {
      this.login = [];
      this.agentList.forEach(e => this.login.push(e?.login))
    }
    this.sortStatusesDic(this.activeTab);
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
    this.getBoardData(tab, ids, this.login);

    // if (this.router.url.includes("board/close-deal")) {
    //   this.displayBoardContent = false;
    //   this.openInnerPage('board/close-deal/' + this.activeTab);
    //   return
    // } else {
    this.router.navigate(['/board'], {
      queryParams: {
        activeTab: tab
      }
    });
    // }
  }

  getBgColorBySumm(price: number) {
    let bgColor = 'bg-primary'
    if (price > 15000000 && price < 25000000) {
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

  getCharFromList(list) {
    let district = '';
    if (!this.util.isNullOrEmpty(list)) {
      for (let distr of list) {
        if (!this.util.isNullOrEmpty(distr))
          district += this.util.isNullOrEmpty(district) ? distr?.name[this.getDicNameByLanguage()] : ',' + distr?.name[this.getDicNameByLanguage()]
      }
    }
    return district;
  }

  /**
   "id": 1, "?????????????????? ??????????????",
   "id": 2, ??????????????
   "id": 3, ?????????????? ???? ???????????????? ??????????
   "id": 4, ??????????????
   "id": 5, ??????????????
   "id": 6, ??????????
   "id": 7, ???????????????? ????????????
   "id": 8, ??????????????
   "id": 9, ????????????????
   "id": 10, ?????????????? ?? ??????????????/????????????
   "id": 11, ???????????????????????? ???????????????? ???????????????????? ????????????
   "id": 12, ???????????????????????? ???? ?????????????????????????? ????????????
   * @param event
   * @param item
   * @param prevStatusId
   */
  changeStatus(event: CdkDragDrop<string[]>, item: any, prevStatusId: number) {
    let currentStatusId = parseInt(event.container.id);

    if (parseInt(event.previousContainer.id) > parseInt(event.container.id)) {
      if ((prevStatusId != 5 && currentStatusId != 4) && (prevStatusId != 10 && currentStatusId != 7)) {
        return
      }
    }
    this._boardSelect = item;
    this.selectId = item.id;
    let data = {applicationId: item.id, statusId: currentStatusId};
    localStorage.setItem('backUrl', '/board?activeTab=' + this.activeTab);
    if (this.activeTab == 1) { // ?????????????? ??????????????????????
      if (prevStatusId == 1 && currentStatusId == 2) {//  2.1. ?? "?????????????????? ?????????????? *" ???? "?????????????? *"
        this.openInnerPage('board/add-event');
        return;
      } else if ((prevStatusId == 1 || prevStatusId == 2) && currentStatusId == 3) {//2.2. ?? "?????????????? *" ???? "?????????????? ???? ???????????????? ?????????? *"
        this.util.dnHrefParam('create-claim/' + item.id, 'ou');
        return;
      } else if (prevStatusId == 3 && currentStatusId == 6) {//  2.3. ?? "?????????????? ???? ???????????????? ?????????? *" ???? "?????????? *"
        this.moveStatus(data);
      } else if (prevStatusId == 6 && currentStatusId == 10) { // 2.4. ?? "?????????? *" ???? "?????????????? ?? ??????????????/???????????? *"
        this.openModal2(this._modalContentAdvance, '-modal-sm');
        return;
      } else if (prevStatusId == 6 && currentStatusId == 7) { //NEW ?? "?????????? *" ???? ???? "???????????????? ???????????? *" - ???????????????????????? ????????????
        this.openInnerPage('board/close-deal/' + this.activeTab);
        return;
      } else if (prevStatusId == 10 && currentStatusId == 7) { // 2.5. ?? "?????????????? ?? ??????????????/???????????? *" ???? "???????????????? ???????????? *"
        this.openInnerPage('board/close-deal/' + this.activeTab);
        return;
      }
    } else if (this.activeTab == 2) {// ?????????????? ??????????????
      if (prevStatusId == 1 && currentStatusId == 2) {//  2.1. ?? "?????????????????? ?????????????? *" ???? "?????????????? *"
        this.openInnerPage('board/add-event');
        return;
      } else if ((prevStatusId == 1 || prevStatusId == 2) && currentStatusId == 3) {//2.2. ?? "?????????????? *" ???? "?????????????? ???? ???????????????? ?????????? *"
        this.util.dnHrefParam('create-claim/' + item.id, 'ou');
        return;
      } else if (prevStatusId == 3 && (currentStatusId == 4 || currentStatusId == 5)) {// ?? "?????????????? ???? ???????????????? ?????????? *" ???? "??????????????", "??????????????"
        this.moveStatus(data);
      } else if (prevStatusId == 3 && currentStatusId == 6) {//  2.4. ?? "?????????????? ???? ???????????????? ?????????? *" ???? "?????????? *"
        this.moveStatus(data);
      } else if (prevStatusId == 5 && currentStatusId == 4) {//  2.4. ?? "??????????????*" ???? "?????????????? *"
        this.moveStatus(data);
      } else if ((prevStatusId == 4 || prevStatusId == 5) && currentStatusId == 6) {//  2.5. ??????????????" ?????? "??????????????" ???? ???????????? "??????????"
        this.moveStatus(data);
      } else if (prevStatusId == 5 && currentStatusId == 4) {// 2.4 NEW ???????????? ?????????? ???????????????????????? ???? ?????????????? "??????????????" ???? ???????????? "??????????????"
        this.moveStatus(data);
      } else if (prevStatusId == 6 && currentStatusId == 7) { // 2.5. ?? "?????????????? ?? ??????????????/???????????? *" ???? "???????????????? ???????????? *"
        this.openInnerPage('board/close-deal/' + this.activeTab);
        return;
      }
    }
    setTimeout(() => {
      this.sortStatusesDic(this.activeTab);
    }, 500)
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

  openModal2(template, class_) {
    this.modalRef2 = this.modalService.show(template, {class: class_});
  }

  closeApplication(template, data: any): void {
    this.clearTargetAppData();
    this.isSell = this.isSellTargetApp = data.operationType?.code === '001002'; // ??????????????
    this.applicationId = data.id;
    this.subscriptions.add(this.boardService.getApplication(this.applicationId).subscribe(res => {
      if (res) {
        this.fillObjectData(res);
      }
    }));
    this.subscriptions.add(this.boardService.getTargetApplication(this.applicationId).subscribe(res => {
      if (res) {
        this.isActive = true;
        this.isTargetApplicationId = true;
        this.secondId = res.id;
        this.isSellTargetApp = res.operationType?.code === '001002'; // ??????????????
        const data = {
          id: res.id,
          operationType: res.operationType?.name[this.util.getDicNameByLanguage()],
          objectPrice: res.objectPrice,
          objectPricePeriod: res.objectPricePeriod,
          numberOfRooms: res.numberOfRooms,
          numberOfRoomsPeriod: res.numberOfRoomsPeriod,
          createDate: res.createDate,
          districts: this.getCharFromList(res.districts),
          totalArea: res.totalArea,
          totalAreaPeriod: res.totalAreaPeriod,
          floor: res.floor,
          floorPeriod: res.floorPeriod,
          status: res.status?.name[this.util.getDicNameByLanguage()],
          agentFullname: res.agentFullname,
          agentPhone: res.agentPhone
        };
        this.targetAppData.push(data);
      }
    }));

    this.openModal2(template, 'modal-xl');
  }

  fillObjectData(data: any): void {
    this.clearObjectData();
    this.isClosingDeal = data.status?.code === '002007';
    this.isConfirmDeal = data.status?.code === '002011' || data.status?.code === '002012';
    this.objectData = data;
    if (this.objectData.contractGuid) {
      this.getFileInfo(this.objectData.contractGuid, 'contractName');
    }
    if (this.objectData.depositGuid) {
      this.getFileInfo(this.objectData.depositGuid, 'depositName');
    }
  }

  getFileInfo(guid: string, field: string): void {
    this.subscriptions.add(this.uploader.getFileInfoUsingGET(guid).subscribe(res => {
      this.objectData[field] = res?.name;
    }));
  }

  clearObjectData(): void {
    this.objectData = null;
  }

  getImgUrl(photoIdList: any) {
    if (!this.util.isNullOrEmpty(photoIdList) && !this.util.isNullOrEmpty(photoIdList)) {
      return this.util.generatorPreviewUrl(photoIdList[0]);
    }
    return null;
  }

  showToAdvance(param) {
    this.util.dnHrefParam('create-claim/' + this.selectId, param);
  }

  refresh(): void {
    window.location.reload();
  }

  onToggle() {
    this.isActive = !this.isActive;
  }

  onSearch(): void {
    this.targetAppData = [];
    this.subscriptions.add(this.boardService.completeTargetApplication(this.secondId).subscribe(res => {
      this.isSellTargetApp = res.operationType?.code === '001002'; // ??????????????
      const data = {
        id: res.id,
        operationType: res.operationType?.name[this.util.getDicNameByLanguage()],
        objectPrice: res.objectPrice,
        objectPricePeriod: res.objectPricePeriod,
        numberOfRooms: res.numberOfRooms,
        numberOfRoomsPeriod: res.numberOfRoomsPeriod,
        createDate: res.createDate,
        districts: this.getCharFromList(res.districts),
        totalArea: res.totalArea,
        totalAreaPeriod: res.totalAreaPeriod,
        floor: res.floor,
        floorPeriod: res.floorPeriod,
        status: res.status?.name[this.util.getDicNameByLanguage()],
        agentFullname: res.agentFullname,
        agentPhone: res.agentPhone
      };
      this.targetAppData.push(data);
    }, err => {
      this.notificationService.showInfo('', err?.ru);
    }));
  }

  closeDeal(type: boolean, appId: any = null) {
    const obj = {
      applicationId: this.applicationId,
      comment: this.objectData?.comment,
      approve: type,
      targetApplicationId: appId
    };
    this.subscriptions.add(this.boardService.forceCloseDeal(obj).subscribe(res => {
      this.notificationService.showSuccess('', '?????????????? ??????????????????');
      this.sortStatusesDic(this.activeTab);
      this.modalRef2.hide();
      this.clearTargetAppData();
    }, err => {
      this.notificationService.showError('????????????', err?.ru);
    }));
  }

  clearTargetAppData(): void {
    this.secondId = null;
    this.targetAppData = [];
    this.file = null;
    this.isActive = false;
    this.isTargetApplicationId = false;
    this.isSell = this.isSellTargetApp = this.objectData?.operationType?.code === '001002'; // ??????????????
  }

  confirmDeal(approveType: boolean): void {
    const obj = {
      applicationId: this.applicationId,
      approve: approveType,
      guid: this.file?.uuid
    };
    if (!this.util.hasShowAgentGroup('CHOOSE_GROUP_AGENT', this.roles)) {
      this.subscriptions.add(this.boardService.confirmCloseDeal(obj).subscribe(res => {
        this.notificationService.showSuccess('', '?????????????? ??????????????????');
        this.sortStatusesDic(this.activeTab);
        this.modalRef2.hide();
      }, err => {
        this.notificationService.showError('????????????', err?.ru);
      }));
    }

    if (!this.util.hasShowApplicationGroup('CLOSE_APPLICATION', this.roles)) {
      this.subscriptions.add(this.boardService.confirmComplete(obj).subscribe(res => {
        this.notificationService.showSuccess('', '?????????????? ??????????????????');
        this.sortStatusesDic(this.activeTab);
        this.modalRef2.hide();
      }, err => {
        this.notificationService.showError('????????????', err?.ru);
      }));
    }

  }

  onFileChange(event) {
    this.isUpload = true;
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.subscriptions.add(this.uploader.uploadData(event.target.files[i])
          .subscribe(data => {
            if (data && data.message) {
              this.percent = data.message;
            }
            if (data && data.uuid) {
              this.file = data;
              this.isUpload = false;
            }
          }));
      }
    }
  }

  deleteFile(): void {
    this.subscriptions.add(this.uploader.removePhotoById(this.file.uuid).subscribe());
    this.file = null;
  }
}
