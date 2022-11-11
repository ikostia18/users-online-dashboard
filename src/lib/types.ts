export interface IUserEditableDocumentData {
  email?: string;
  entranceTime?: Date;
  ip?: string;
  isLoggedIn?: boolean;
  name?: string;
  userAgent?: string;
  visitCounts?: number;
  [x: string]: any;
}
