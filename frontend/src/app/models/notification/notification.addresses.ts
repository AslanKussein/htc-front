import {Notification} from "./notification";

export class NotificationAddresses {
    id: number;
    notification: Notification;
    login: string;
    isOpened: boolean;
    isReadBody: boolean = false;
    isWriteAnswer: boolean = false;
}
