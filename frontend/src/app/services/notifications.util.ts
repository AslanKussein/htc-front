import {Injectable} from '@angular/core';
import * as Stomp from "@stomp/stompjs";
import * as SockJS from 'sockjs-client';
import {ApplicationNotificationService} from "./application.notification.service";
import {NotificationService} from "./notification.service";
import {ConfigService} from "./config.service";
import {User} from "../models/users";

declare var $: any;   // not required


@Injectable({
    providedIn: 'root'
})
export class NotificationsUtil {

    private stompClient = null;
    private webSocketConnection: boolean = false;
    private tryToConnectSec :number = 15;

    constructor(
        private configService: ConfigService,
        private applicationNotificationService: ApplicationNotificationService,
        private notifyService: NotificationService) {
    }


    private setWebSocketConnected(connected: boolean) {
        this.webSocketConnection = connected;
    }

    public webSocketConnect(currentUser: User) {

        if (this.webSocketConnection) {
            return;
        }
        if (currentUser) {
            this.getNotifCount();
            const socket = new SockJS(this.configService.apiNotifManagerUrl + '/open-api/stomp-endpoint');
            this.stompClient = Stomp.over(socket);

            const _this = this;
            this.stompClient.connect({}, function (frame) {
                _this.setWebSocketConnected(true);
                _this.stompClient.subscribe('/user/' + currentUser.login.toLocaleLowerCase() + '/topic/notification', function (hello) {
                    _this.showNotification(JSON.parse(hello.body).greeting);
                    _this.getNotifCount();
                }, function () {
                    _this.tryToConnectWebSocketAfter(currentUser, this.tryToConnectSec);
                });

            }, function () {
                _this.tryToConnectWebSocketAfter(currentUser, this.tryToConnectSec);
            });
        }
    }

    public webSocketDisconnect() {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }

        this.setWebSocketConnected(false);
        console.log('Disconnected!');
    }

    public getNotifCount() {
        this.applicationNotificationService.getAllNotOpenedNotificationCount()
            .subscribe(res => {
                if (res > 0) {
                    $("#menu-notification-count").show();
                } else {
                    $("#menu-notification-count").hide();
                }
                $("#menu-notification-count").html(res);
            }, err => {
                this.notifyService.showError(err, 'Ошибка');
            });
    }

    private tryToConnectWebSocketAfter(currentUser: User, sec: number) {
        this.setWebSocketConnected(false)
        let _this = this;
        console.log('WebSocket disconnected try connect after ' + sec + ' sec')
        setTimeout(function () {
            _this.webSocketConnect(currentUser);
        }, sec * 1000)
    }

    private showNotification(data) {
        this.notifyService.showSuccess(data?.messagePushup, "У вас новое уведомление");
    }
}
