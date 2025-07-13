import { RoomType, MarkerConfig } from "../types/marker";

const markerConfigs: Record<string, MarkerConfig> = {
  "1room": {
    roomType: "1room",
    hasTerrace: false,
    iconUrl: "/markers/1room-pin.svg",
    color: "#FFFFFF",
  },
  "1room-terrace": {
    roomType: "1room",
    hasTerrace: true,
    iconUrl: "/markers/1room-terrace-pin.svg",
    color: "#FFFFFF",
  },
  "2room": {
    roomType: "2room",
    hasTerrace: false,
    iconUrl: "/markers/2room-pin.svg",
    color: "#4CAF50",
  },
  "2room-terrace": {
    roomType: "2room",
    hasTerrace: true,
    iconUrl: "/markers/2room-terrace-pin.svg",
    color: "#4CAF50",
  },
  "3room": {
    roomType: "3room",
    hasTerrace: false,
    iconUrl: "/markers/3room-pin.svg",
    color: "#FFD700",
  },
  "3room-terrace": {
    roomType: "3room",
    hasTerrace: true,
    iconUrl: "/markers/3room-terrace-pin.svg",
    color: "#FFD700",
  },
  "4room": {
    roomType: "4room",
    hasTerrace: false,
    iconUrl: "/markers/4room-pin.svg",
    color: "#9C27B0",
  },
  "4room-terrace": {
    roomType: "4room",
    hasTerrace: true,
    iconUrl: "/markers/4room-terrace-pin.svg",
    color: "#9C27B0",
  },
  duplex: {
    roomType: "duplex",
    hasTerrace: false,
    iconUrl: "/markers/duplex-pin.svg",
    color: "#FF69B4",
  },
  townhouse: {
    roomType: "townhouse",
    hasTerrace: false,
    iconUrl: "/markers/townhouse-pin.svg",
    color: "#808080",
  },
  oldhouse: {
    roomType: "oldhouse",
    hasTerrace: false,
    iconUrl: "/markers/oldhouse-pin.svg",
    color: "#2196F3",
  },
  question: {
    roomType: "question",
    hasTerrace: false,
    iconUrl: "/markers/question-pin.svg",
    color: "#FFFFFF",
  },
  completed: {
    roomType: "completed",
    hasTerrace: false,
    iconUrl: "/markers/completed-pin.svg",
    color: "#4CAF50",
  },
};

export const getMarkerConfig = (
  roomType: RoomType,
  hasTerrace: boolean
): MarkerConfig => {
  const key = hasTerrace ? `${roomType}-terrace` : roomType;
  return markerConfigs[key] || markerConfigs["1room"];
};

export const getMarkerIconUrl = (
  roomType: RoomType,
  hasTerrace: boolean
): string => {
  return getMarkerConfig(roomType, hasTerrace).iconUrl;
};

export const getMarkerColor = (
  roomType: RoomType,
  hasTerrace: boolean
): string => {
  return getMarkerConfig(roomType, hasTerrace).color;
};

export const getRoomTypeLabel = (roomType: RoomType): string => {
  const labels: Record<RoomType, string> = {
    "1room": "1룸~1.5룸",
    "2room": "2룸~2.5룸",
    "3room": "3룸",
    "4room": "4룸",
    duplex: "복층",
    townhouse: "타운하우스",
    oldhouse: "구옥",
    question: "답사예정",
    completed: "입주완료",
  };
  return labels[roomType] || "기타";
};
