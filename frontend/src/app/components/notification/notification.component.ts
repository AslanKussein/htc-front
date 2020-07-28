import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {NotificationService} from "../../services/notification.service";
import {Util} from "../../services/util";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {ApplicationNotificationService} from "../../services/application.notification.service";
import {NotificationAddresses} from "../../models/notification/notification.addresses";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  pageable = {
    direction: 'DESC',
    sortBy: 'id',
    pageNumber: 0,
    pageSize: 10
  };

  content: NotificationAddresses[]

  constructor(
      private notifyService: NotificationService,
      public util: Util,
      public router: Router,
      private authenticationService: AuthenticationService,
      private sanitizer: DomSanitizer,
      private applicationNotificationService: ApplicationNotificationService) {
    localStorage.setItem('url', this.router.url);
  }

  ngOnInit(): void {
    if (!this.authenticationService.currentUserValue) {
      //this.util.openAuthDialog();
      return;
    }
    this.getAllPageable();
  }

  getAllPageable() {
    this.applicationNotificationService.getAllPageable(this.pageable)
        .subscribe(res => {
          console.log(res)
          this.content = res.content;
        }, err => {
          this.notifyService.showError(err,'');
        });

  }

  sanitize(val): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(val);
  }
}
