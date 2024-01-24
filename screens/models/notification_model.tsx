export interface NotificationItem {
  id: string;
  message: string;
  timestamp: IFirestoreTimestamp;
  title: string;
}

export interface IFirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}
