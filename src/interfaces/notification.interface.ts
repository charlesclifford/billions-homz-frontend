/* eslint-disable @typescript-eslint/no-explicit-any */
export interface INotification {
  _id: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  recipient: string;
  recipientType: RecipientType;
  type: NotificationType;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | "SALE_CREATED"
  | "COMMISSION_REQUESTED"
  | "COMMISSION_APPROVED"
  | "COMMISSION_PAID"
  | "NEW_ESTATE"
  | "PAYMENT_PROOF_REQUIRED"
  | "SYSTEM_ALERT";

export type RecipientType = "User" | "Realtor" | "Admin";

export interface INotificationCount {
  unread: number;
}
