import { IProperty } from "./property.interface";
import { IUser } from "./user.interface";

export interface IReview {
  _id: string;
  comment: string;
  rating: number;
  property: IProperty;
  reviewer: IUser;
}
