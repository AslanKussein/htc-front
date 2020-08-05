import {NotificationType} from "./notification.type";

export class Notification {
    id: number;
    notesId: number;
    applicationId: number;
    message: string;
    notificationType: NotificationType;
    messageDate: Date;
}