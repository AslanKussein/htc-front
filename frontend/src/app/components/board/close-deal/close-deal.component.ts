import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
    this.operationId = this.actRoute.snapshot.params.operationId;

    this.boardSelect = this.board.boardSelect;
    if (this.util.isNullOrEmpty(this.boardSelect)) {
      this.cancel()
    }
  }

  cancel() {
    this.board.displayBoardContent = true;
    this.util.dnHref('board');
  }

  ngOnInit(): void {
  }

}
