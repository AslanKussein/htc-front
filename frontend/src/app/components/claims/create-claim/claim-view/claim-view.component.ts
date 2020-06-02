import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-claim-view',
  templateUrl: './claim-view.component.html',
  styleUrls: ['./claim-view.component.scss']
})
export class ClaimViewComponent implements OnInit {
  applicationId: number;

  constructor(private actRoute: ActivatedRoute) {
    this.applicationId = Number(this.actRoute.snapshot.params.id);
  }


  ngOnInit(): void {
  }

}
