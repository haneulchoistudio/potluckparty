import type { ObjectId } from "mongodb";

export interface UserProps {
  name: string;
  bio: string;
  email: string;
  image: string;
  events: string[];
  addresses: string[];
  phone?: string;
  phoneVerified: boolean;
  subscription: "free" | "paid";
}

export type User = {
  _id: string | ObjectId;
  provider: string;
  data: UserProps;
};

export interface EventProps {
  name: string;
  host: string;
  description: string;
  theme: string;
  date: string;
  time: string;
  address: string;
  emails: string[];
  ids: string[];
  menu: string;
}

export type Event = {
  _id: string | ObjectId;
  data: EventProps;
};

export interface MenuItemProps {
  madeById: string;
  madeByName: string;
  madeByImage: string;
  note: string;
}

export interface MenuProps {
  event: string;
  appetizers: MenuItemProps[];
  mains: MenuItemProps[];
  desserts: MenuItemProps[];
}

export type Menu = {
  _id: string | ObjectId;
  data: MenuProps;
};
