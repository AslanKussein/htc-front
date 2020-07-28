import {Component, OnDestroy, OnInit} from '@angular/core';
import {NewDicService} from "./services/new.dic.service";
import {DicService} from "./services/dic.service";
import {BsLocaleService} from "ngx-bootstrap/datepicker";
import {NgSelectConfig} from "@ng-select/ng-select";
import {TranslateService} from "@ngx-translate/core";
import {language} from "../environments/language";
import {AuthenticationService} from "./services/authentication.service";
import {Util} from "./services/util";
import {User} from "./models/users";
import {Router} from "@angular/router";
import {UploaderService} from "./services/uploader.service";
import {ProfileService} from "./services/profile.service";
import {Subscription} from "rxjs";
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {ConfigService} from "./services/config.service";
import {NotificationService} from "./services/notification.service";
import {ApplicationNotificationService} from "./services/application.notification.service";


declare var jquery: any;   // not required
declare var $: any;   // not required

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'htc';
  _language = language;
  currentUser: User;
  logo: string = '../../../assets/images/home/Лого.png';
  subscriptions: Subscription = new Subscription();
    private stompClient = null;
    webSocketConnection: boolean = false;
    notifCount: number = 0;

    constructor(private newDicService: NewDicService,
                private dicService: DicService,
                private localeService: BsLocaleService,
                public translate: TranslateService,
                public util: Util,
                private router: Router,
                private profileService: ProfileService,
                private uploader: UploaderService,
                private configService: ConfigService,
                private authenticationService: AuthenticationService,
                private config: NgSelectConfig,
                private applicationNotificationService: ApplicationNotificationService,
                private notifyService: NotificationService) {
        translate.setDefaultLang(this._language.language)
        translate.use(this._language.language);
        this.localeService.use('ru');
        this.config.notFoundText = 'Данные не найдены';
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
        $("#menu-toggle").click(function (e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });
        this.webSocketConnect();
        this.getNotifCount();

        this.webSocketConnect()
        $(document).scroll(function () {
            let y = $(this).scrollTop();
            if (y > 600) {
                $('.bottomMenu').fadeIn();
            } else {
                $('.bottomMenu').fadeOut();
            }
        });
    }

    isActive() {
        return '/' + localStorage.getItem('url') == this.router.url;
    }

    logout() {
        this.authenticationService.logout();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.disconnect();
    }

    showWebSocketConnected(connected: boolean) {
        this.webSocketConnection = connected;
    }

    webSocketConnect() {
        let currentUser = this.authenticationService.currentUserValue;

        if (this.webSocketConnection) {
            return;
        }
        if (currentUser) {
            const socket = new SockJS(this.configService.apiNotifManagerUrl + '/open-api/stomp-endpoint');
            this.stompClient = Stomp.over(socket);

            const _this = this;
            this.stompClient.connect({}, function (frame) {
                _this.showWebSocketConnected(true);
                _this.stompClient.subscribe('/user/' + currentUser.login + '/topic/notification', function (hello) {
                    _this.showNotification(JSON.parse(hello.body).greeting);
                    _this.getNotifCount();
                }, function () {
                    _this.tryToConnectWebSocketAfter(20);
                });

            }, function () {
                _this.tryToConnectWebSocketAfter(20);
            });
        } else {
            this.tryToConnectWebSocketAfter(20);
        }
    }

    tryToConnectWebSocketAfter(sec: number) {
        this.showWebSocketConnected(false)
        let _this = this;
        console.log('WebSocket disconnected try connect after ' + sec + ' sec')
        setTimeout(function () {
            _this.webSocketConnect();
        }, sec * 1000)
    }

    showNotification(data) {
        this.notifyService.showSuccess(data?.messagePushup, "У вас новое уведомление");
    }

    disconnect() {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }

        this.showWebSocketConnected(false);
        console.log('Disconnected!');
    }

    getNotifCount() {
        this.applicationNotificationService.getAllNotOpenedNotificationCount()
            .subscribe(res => {
                this.notifCount = res;
            }, err => {
                this.notifyService.showError(err, 'Ошибка');
            });
    }

    navigateTop() {
        window.scrollTo(0, 0);
    }
}
