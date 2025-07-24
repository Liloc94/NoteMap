"use client";

import Image from "next/image";
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
    <div className="min-h-screen w-screen bg-gray-800 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏠 부동산 마커 미리보기
          </h1>
          <p className="text-white">다양한 부동산 마커들을 확인해보세요</p>
        </div>

        {/* 마커 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-16">
          {markerTypes.map((marker) => (
            <div
              key={`${marker.roomType}-${marker.hasTerrace}`}
              className="bg-gray-700 border border-gray-600 rounded-xl p-6 text-center hover:bg-gray-600 hover:border-gray-500 transition-all duration-200 shadow-lg"
            >
              <h3 className="text-sm font-semibold text-gray-100 mb-4 leading-tight">
                {marker.name}
              </h3>
              <div className="flex justify-center mb-3">
                <Image
                  src={getMarkerPath(marker.roomType, marker.hasTerrace)}
                  alt={marker.name}
                  width={48}
                  height={48}
                  className="drop-shadow-lg"
                />
              </div>
              <div className="text-xs text-gray-400 font-mono">
                {marker.roomType}
                {marker.hasTerrace ? "-terrace" : ""}-pin.svg
              </div>
            </div>
          ))}
        </div>

        {/* 색상 가이드 */}
        <div className="bg-gray-700 border border-gray-600 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            📋 마커 색상 가이드
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                1룸~1.5룸 - 흰색
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                2룸~2.5룸 - 초록색
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                3룸 - 노란색
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                4룸 - 보라색
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                복층 - 핑크색
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                타운하우스 - 회색
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                구옥 - 파란색
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                답사예정 - 흰색 (검정 테두리)
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-200">
                입주완료 - 녹색
              </span>
            </div>
          </div>
          <p className="mt-6 text-center text-gray-300 text-xl font-bold">
            💡 모든 마커는 검은색 테두리를 가지며, 테라스가 있는 경우 중앙에
            흰색 점이 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
