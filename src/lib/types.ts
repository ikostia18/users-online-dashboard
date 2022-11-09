export interface IUserDocumentData {
  name: string;
  email: string;
  password: string;
  userAgent: string;
  visitCounts?: number;
  entranceTime?: Date;
  [x: string]: any;
}
