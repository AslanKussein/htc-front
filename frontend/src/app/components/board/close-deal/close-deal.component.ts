import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Util} from "../../../services/util";
import {BoardComponent} from "../board.component";
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {BoardService} from "../../../services/board.service";
import {Subscription} from "rxjs";
import {NotificationService} from "../../../services/notification.service";
import {UploaderService} from "../../../services/uploader.service";
import {Location} from '@angular/common';
import {FileDto} from "../../../models/fileDto";

@Component({
  selector: 'app-close-deal',
  templateUrl: './close-deal.component.html',
  styleUrls: ['./close-deal.component.scss']
})
export class CloseDealComponent implements OnInit {
  subscriptions: Subscription = new Subscription();
  @ViewChild('_modalContentAdvance', {static: true}) private _modalContentAdvance: TemplateRef<any>;
  boardSelect: any;
  operationId: number;
  contractStatus: number;
  contractStatusName: string;
  depositStatusName: string;
  selectedFile: File;
  contract: FileDto;
  deposit: FileDto;
  //contractStatus: | GENERATED = 1| MISSING = 2
  modalRef2: BsModalRef;

  constructor(private board: BoardComponent,
              public util: Util,
              private location: Location,
              private boardService: BoardService,
              private notificationService: NotificationService,
              private modalService: BsModalService,
              private uploader: UploaderService,
              private actRoute: ActivatedRoute) {
    this.board.displayBoardContent = false;
    this.boardSelect = this.board.boardSelect;
    this.contractStatus = this.util.isNullOrEmpty(this.boardSelect?.contractStatus) ? 2 : this.boardSelect?.contractStatus?.id;
    this.contractStatusName = this.util.isNullOrEmpty(this.boardSelect?.contractStatus) ? 'Сформировать' : this.boardSelect?.contractStatus?.name?.nameRu;
    this.depositStatusName = this.boardSelect?.hasDepositContract ? 'Сформирован' : 'Сформировать';
    console.log(this.boardSelect)
    if (this.util.isNullOrEmpty(this.boardSelect)) {
      this.cancel()
    }
    if (this.util.isNumeric(this.actRoute.snapshot.params.operationId)) {
      this.operationId = Number(this.actRoute.snapshot.params.operationId);
    }
  }

  generateOu() {
    this.util.dnHrefParam('create-claim/' + this.boardSelect.id, 'ou');
    return;
  }

  openModal() {
    this.modalRef2 = this.modalService.show(this._modalContentAdvance, {class: '-modal-sm'});
  }

  showToAdvance(param) {
    this.util.dnHrefParam('create-claim/' + this.boardSelect.id, param);
  }

  cancel() {
    // this.board.displayBoardContent = true;
    this.location.replaceState('board');
    this.util.refresh()
    // this.board.sortStatusesDic(this.board.activeTab);
  }

  ngOnInit(): void {
  }

  onFileChange(event, id: number) {
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.selectedFile = event.target.files[i];
        this.subscriptions.add(this.uploader.uploadData(this.selectedFile)
          .subscribe(data => {
            if (data && data.uuid) {
              if (id == 1) {
                this.contract = data
              }
              if (id == 2) {
                this.deposit = data
              }
            }
          }));
      }
    }
  }

  completeDeal() {
    let obj = {};
    obj["applicationId"] = this.boardSelect.id;
    if (this.util.isNullOrEmpty(this.contract.uuid)) {
      this.notificationService.showWarning('Прикрепите скан Договора ОУ', 'Информация')
      return;
    }
    obj["contractGuid"] = this.contract.uuid
    if (this.operationId == 1) {
      if (this.boardSelect.hasDepositContract) {
        if (this.util.isNullOrEmpty(this.deposit?.uuid)) {
          this.notificationService.showWarning('Прикрепите скан Договора о авансе/задатке', 'Информация')
          return;
        }
      }
      obj["depositGuid"] = this.deposit?.uuid
    }
    this.subscriptions.add(
      this.boardService.completeDeal(obj).subscribe(res => {
        this.notificationService.showInfo('Сделка закрыта', 'Информация');
        this.cancel();
      })
    )
  }

}
