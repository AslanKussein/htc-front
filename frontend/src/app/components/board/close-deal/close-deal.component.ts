import {Component, OnInit} from '@angular/core';
import {Util} from "../../../services/util";
import {BoardComponent} from "../board.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-close-deal',
  templateUrl: './close-deal.component.html',
  styleUrls: ['./close-deal.component.scss']
})
export class CloseDealComponent implements OnInit {

  boardSelect: any;
  operationId: number;
  contractStatus: number;
  contractStatusName: string;
  //contractStatus: | GENERATED = 1| MISSING = 2

  constructor(private board: BoardComponent,
              private util: Util,
              private actRoute: ActivatedRoute) {
    this.board.displayBoardContent = false;
    this.boardSelect = this.board.boardSelect;
    if (this.util.isNullOrEmpty(this.boardSelect.contractStatus)) {
      this.contractStatus = 2;
      this.contractStatusName = 'Сформировать';
    } else {
      this.contractStatus = this.boardSelect.contractStatus?.id;
      this.contractStatusName = this.boardSelect?.name?.nameRu;
    }
    console.log(this.boardSelect)
    if (this.util.isNullOrEmpty(this.boardSelect)) {
      this.cancel()
    }
    if (this.util.isNumeric(this.actRoute.snapshot.params.id)) {
      this.operationId = Number(this.actRoute.snapshot.params.id);
    }
  }

  generateOu() {
    this.util.dnHrefParam('create-claim/' + this.boardSelect.id, 'ou');
    return;
  }

  cancel() {
    this.board.displayBoardContent = true;
    this.util.navigateByUrl('/board');
    this.board.sortStatusesDic(this.board.activeTab);
  }

  ngOnInit(): void {
  }

  onFileChange(event, id: number) {
    // this.isUpload = true;
    // if (event.target.files && event.target.files[0]) {
    //   let filesAmount = event.target.files.length;
    //   for (let i = 0; i < filesAmount; i++) {
    //     this.selectedFile = event.target.files[i];
    //     this.subscriptions.add(this.uploader.uploadData(this.selectedFile)
    //       .subscribe(data => {
    //         if (data && data.message) {
    //           this.percent = data.message;
    //         }
    //         if (data && data.uuid) {
    //           this.filesEdited = true;
    //           this.fillPicture(data, id);
    //           this.isUpload = false;
    //         }
    //       }));
    //   }
    // }
  }

}
