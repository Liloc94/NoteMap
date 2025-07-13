"use client";

import { RoomType } from "../../types/marker";
import { getRoomTypeLabel } from "../../utils/markerUtils";

const markerTypes: {
  roomType: RoomType;
  hasTerrace: boolean;
  name: string;
}[] = [
  { roomType: "1room", hasTerrace: false, name: "1룸~1.5룸" },
  { roomType: "1room", hasTerrace: true, name: "1룸~1.5룸 (테라스)" },
  { roomType: "2room", hasTerrace: false, name: "2룸~2.5룸" },
  { roomType: "2room", hasTerrace: true, name: "2룸~2.5룸 (테라스)" },
  { roomType: "3room", hasTerrace: false, name: "3룸" },
  { roomType: "3room", hasTerrace: true, name: "3룸 (테라스)" },
  { roomType: "4room", hasTerrace: false, name: "4룸" },
  { roomType: "4room", hasTerrace: true, name: "4룸 (테라스)" },
  { roomType: "duplex", hasTerrace: false, name: "복층" },
  { roomType: "townhouse", hasTerrace: false, name: "타운하우스" },
  { roomType: "oldhouse", hasTerrace: false, name: "구옥" },
  { roomType: "question", hasTerrace: false, name: "답사예정" },
  { roomType: "completed", hasTerrace: false, name: "입주완료" },
];

export default function MarkerPreview() {
  const getMarkerPath = (roomType: RoomType, hasTerrace: boolean) => {
    const key = hasTerrace ? `${roomType}-terrace` : roomType;
    return `/markers/${key}-pin.svg`;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "30px", color: "#333" }}>
        🏠 부동산 마커 미리보기
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {markerTypes.map((marker, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#555" }}>
              {marker.name}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={getMarkerPath(marker.roomType, marker.hasTerrace)}
                alt={marker.name}
                style={{ width: "64px", height: "64px" }}
              />
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              파일: {marker.roomType}
              {marker.hasTerrace ? "-terrace" : ""}-pin.svg
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f0f8ff",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#333" }}>
          📋 마커 색상 가이드
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #333",
                borderRadius: "50%",
              }}
            ></div>
            <span>1룸~1.5룸 - 흰색</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#4CAF50",
                borderRadius: "50%",
              }}
            ></div>
            <span>2룸~2.5룸 - 초록색</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FFD700",
                borderRadius: "50%",
              }}
            ></div>
            <span>3룸 - 노란색</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#9C27B0",
                borderRadius: "50%",
              }}
            ></div>
            <span>4룸 - 보라색</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FF69B4",
                borderRadius: "50%",
              }}
            ></div>
            <span>복층 - 핑크색</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#808080",
                borderRadius: "50%",
              }}
            ></div>
            <span>타운하우스 - 회색</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#2196F3",
                borderRadius: "50%",
              }}
            ></div>
            <span>구옥 - 파란색</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FFFFFF",
                border: "2px solid #000000",
                borderRadius: "50%",
              }}
            ></div>
            <span>답사예정 - 흰색 (검정 테두리)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#4CAF50",
                borderRadius: "50%",
              }}
            ></div>
            <span>입주완료 - 녹색</span>
          </div>
        </div>
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
          💡 모든 마커는 검은색 테두리를 가지며, 테라스가 있는 경우 중앙에 흰색
          점이 표시됩니다.
        </p>
      </div>
    </div>
  );
}
