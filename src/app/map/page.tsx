"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PropertyData } from "../../types/marker";

// 카카오맵 API 타입
type KakaoMap = any;
type KakaoMarker = any;

export default function KakaoMapPins() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [pins, setPins] = useState<PropertyData[]>([]);
  const [selectedPin, setSelectedPin] = useState<PropertyData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [markers, setMarkers] = useState<KakaoMarker[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 폼 상태
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // 카카오맵 API 로드
  useEffect(() => {
    // 이미 로드된 경우 스킵
    if (window.kakao) {
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=1d942b3f6295cca93ee7c47e9942e78b&autoload=false`;
    script.async = true;
    script.type = "text/javascript";
    // CORS 우회를 위해 crossOrigin 제거

    script.onload = () => {
      if (window.kakao) {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      }
    };

    script.onerror = (error) => {
      console.error("카카오맵 SDK 로드 실패:", error);
      alert(
        "카카오맵을 로드할 수 없습니다. API 키와 도메인 설정을 확인해주세요."
      );
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.kakao) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3,
    };

    const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
    setMap(kakaoMap);
    setIsMapLoaded(true);

    // 지도 클릭 이벤트
    window.kakao.maps.event.addListener(
      kakaoMap,
      "click",
      (mouseEvent: any) => {
        const latLng = mouseEvent.latLng;
        handleMapClick(latLng.getLat(), latLng.getLng());
      }
    );
  };

  // 마커 업데이트 함수를 useCallback으로 메모이제이션
  const updateMarkers = useCallback(() => {
    if (!map || !window.kakao) return;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    // 새 마커 생성
    const newMarkers = pins.map((pin) => {
      const markerPosition = new window.kakao.maps.LatLng(pin.lat, pin.lng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: pin.title,
      });

      marker.setMap(map);

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedPin(pin);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, pins]); // markers 의존성 제거

  // 마커 업데이트
  useEffect(() => {
    if (map && pins.length >= 0) {
      updateMarkers();
    }
  }, [map, pins, updateMarkers]);

  const handleMapClick = (lat: number, lng: number) => {
    setFormData({ title: "", description: "" });
    setSelectedPin({
      id: Date.now().toString(),
      lat,
      lng,
      title: "",
      description: "",
      roomType: "1room",
      hasTerrace: false,
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSavePin = () => {
    if (!selectedPin) return;

    const newPin: PropertyData = {
      ...selectedPin,
      ...formData,
      createdAt: selectedPin.createdAt || new Date().toISOString(),
    };

    if (pins.find((p) => p.id === newPin.id)) {
      setPins(pins.map((p) => (p.id === newPin.id ? newPin : p)));
    } else {
      setPins([...pins, newPin]);
    }

    setIsModalOpen(false);
    setSelectedPin(null);
    setFormData({ title: "", description: "" });
  };

  const handleDeletePin = (pinId: string) => {
    setPins(pins.filter((p) => p.id !== pinId));
    if (selectedPin?.id === pinId) {
      setSelectedPin(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* 모바일 메뉴 버튼 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="mobile-menu-btn"
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 1001,
          padding: "8px 12px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          display: "none",
        }}
      >
        ☰
      </button>

      {/* 사이드바 */}
      <div
        className="sidebar"
        style={{
          width: "300px",
          borderRight: "1px solid #ddd",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          height: "100vh",
          overflowY: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ fontSize: "20px", margin: 0 }}>📍 지도 핀 관리</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="sidebar-close-btn"
            style={{
              display: "none",
              padding: "4px 8px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          지도를 클릭하여 핀을 추가하세요
        </p>

        <div style={{ marginBottom: "20px" }}>
          <h3>핀 목록 ({pins.length}개)</h3>
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {pins.map((pin) => (
            <div
              key={pin.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "8px",
                backgroundColor:
                  selectedPin?.id === pin.id ? "#e3f2fd" : "white",
                cursor: "pointer",
              }}
              onClick={() => setSelectedPin(pin)}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {pin.title || "제목 없음"}
              </div>
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}
              >
                {new Date(pin.createdAt).toLocaleDateString()}
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                {pin.description || "설명 없음"}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePin(pin.id);
                }}
                style={{
                  marginTop: "8px",
                  padding: "4px 8px",
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div
        className="main-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: "300px",
        }}
      >
        {/* 상단 툴바 */}
        <div
          className="toolbar"
          style={{
            padding: "16px",
            borderBottom: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() =>
                  map && map.setLevel(Math.max(map.getLevel() - 1, 1))
                }
                disabled={!map}
                className="toolbar-buttons"
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                확대
              </button>
              <button
                onClick={() =>
                  map && map.setLevel(Math.min(map.getLevel() + 1, 14))
                }
                disabled={!map}
                className="toolbar-buttons"
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                축소
              </button>
              <span
                className="toolbar-level"
                style={{
                  marginLeft: "16px",
                  fontSize: "14px",
                }}
              >
                레벨: {map ? map.getLevel() : 3}
              </span>
            </div>
          </div>
        </div>

        {/* 지도 */}
        <div style={{ flex: 1, position: "relative" }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
          {!isMapLoaded && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📍</div>
                <p>카카오 지도를 로딩중입니다...</p>
              </div>
            </div>
          )}
        </div>

        {/* 선택된 핀 정보 */}
        {selectedPin && !isModalOpen && (
          <div
            className="pin-info"
            style={{
              padding: "20px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              {selectedPin.title || "제목 없음"}
            </h3>
            <p style={{ color: "#666", marginBottom: "8px" }}>
              {selectedPin.description || "설명 없음"}
            </p>
            <p
              style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}
            >
              위치: {selectedPin.lat.toFixed(6)}, {selectedPin.lng.toFixed(6)} |
              생성일: {new Date(selectedPin.createdAt).toLocaleString()}
            </p>
            <button
              onClick={() => {
                setFormData({
                  title: selectedPin.title,
                  description: selectedPin.description,
                });
                setIsModalOpen(true);
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              편집
            </button>
          </div>
        )}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2
              className="modal-title"
              style={{
                marginBottom: "20px",
                fontSize: "18px",
              }}
            >
              핀 정보 입력
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                제목
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="핀의 제목을 입력하세요"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="핀에 대한 설명을 입력하세요"
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {selectedPin && (
              <div
                style={{
                  marginBottom: "20px",
                  fontSize: "12px",
                  backgroundColor: "#f8f9fa",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                위치: {selectedPin.lat.toFixed(6)}, {selectedPin.lng.toFixed(6)}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPin(null);
                }}
                className="modal-buttons"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                취소
              </button>
              <button
                onClick={handleSavePin}
                className="modal-buttons"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모바일에서 사이드바가 열려있을 때 배경 오버레이 */}
      {isSidebarOpen && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: "none",
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
