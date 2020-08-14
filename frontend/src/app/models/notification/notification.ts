import {NotificationType} from "./notification.type";

export class Notification {
    id: number;
    notesId: number;
    realPropertyId: number;
    applicationId: number;
    message: string;
    notificationType: NotificationType;
    messageDate: Date;
    answer: Notification;
    questionId: number;
}
