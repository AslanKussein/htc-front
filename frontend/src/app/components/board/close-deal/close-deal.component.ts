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

  constructor(private board: BoardComponent,
              private util: Util,
              private actRoute: ActivatedRoute) {
    this.board.displayBoardContent = false;
    this.boardSelect = this.board.boardSelect;
    if (this.util.isNullOrEmpty(this.boardSelect)) {
      this.cancel()
    }
    if (this.util.isNumeric(this.actRoute.snapshot.params.id)) {
      this.operationId = Number(this.actRoute.snapshot.params.id);
    }
  }

  cancel() {
    this.board.displayBoardContent = true;
    this.util.dnHref('board');
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
