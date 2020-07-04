import {Component, OnInit} from '@angular/core';
import {Util} from "../../../../services/util";
import {CreateClaimComponent} from "../create-claim.component";
import {filter, pairwise} from "rxjs/operators";
import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit {
  title: string;
  fromBoard: boolean = false;

  constructor(public util: Util,
              private actRoute: ActivatedRoute,
              private router: Router,
              public createClaimComponent: CreateClaimComponent) {
    if (!this.util.isNullOrEmpty(this.actRoute.snapshot.queryParamMap.get('fromBoard'))) {
      this.fromBoard = this.actRoute.snapshot.queryParamMap.get('fromBoard') == 'true';
    }
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        console.log('previous url', events[0].urlAfterRedirects);
        console.log('current url', events[1].urlAfterRedirects);
        localStorage.setItem('previousUrl', events[0].urlAfterRedirects)
      })

  }

  ngOnInit(): void {

  }

  backToPrev() {
    this.util.navigateByUrl(localStorage.getItem('previousUrl'));
  }

}
