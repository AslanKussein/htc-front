import {NotificationType} from "./notification.type";

export class Notification {
    id: number;
    message: string;
    notificationType: NotificationType;
    messageDate: Date;
}