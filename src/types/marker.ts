export type RoomType =
  | "1room"
  | "2room"
  | "3room"
  | "4room"
  | "duplex"
  | "townhouse"
  | "oldhouse"
  | "question"
  | "completed";

export interface MarkerConfig {
  roomType: RoomType;
  hasTerrace: boolean;
  iconUrl: string;
  color: string;
}

export interface PropertyData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  roomType: RoomType;
  hasTerrace: boolean;
  price?: string;
  area?: string;
  createdAt: string;
}
