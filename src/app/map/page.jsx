"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faStreetView,
} from "@fortawesome/free-solid-svg-icons";

export default function KakaoMap() {
  const mapRef = useRef(null);
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [roadViewEnabled, setRoadViewEnabled] = useState(false);
  const [mapClickListener, setMapClickListener] = useState(null);
  const [roadview, setRoadview] = useState(null);
  const [rvContainer, setRvContainer] = useState(null);
  const [rvClient, setRvClient] = useState(null);
  const [rvMarker, setRvMarker] = useState(null);
  const [miniMap, setMiniMap] = useState(null);
  const [miniMapMarkers, setMiniMapMarkers] = useState([]);
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

    script.onerror = () => {
      console.error("카카오맵 SDK 로드 실패");
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

    // 로드뷰 관련 설정
    const rvContainer = document.getElementById("roadview");
    const rvClient = new window.kakao.maps.RoadviewClient();
    const roadview = new window.kakao.maps.Roadview(rvContainer);

    // 로드뷰 마커 생성 (초기에는 숨김)
    const markerPosition = new window.kakao.maps.LatLng(37.566826, 126.9786567);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      draggable: true,
      map: null, // 초기에는 지도에 표시하지 않음
    });
    // 마커 이미지를 생성합니다.
    const markerImage = new window.kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png",
      new window.kakao.maps.Size(26, 46),
      {
        // 스프라이트 이미지를 사용합니다.
        // 스프라이트 이미지 전체의 크기를 지정하고
        spriteSize: new kakao.maps.Size(1666, 168),
        // 사용하고 싶은 영역의 좌상단 좌표를 입력합니다.
        // background-position으로 지정하는 값이며 부호는 반대입니다.
        spriteOrigin: new kakao.maps.Point(705, 114),
        offset: new kakao.maps.Point(13, 46),
      }
    );

    setRvContainer(rvContainer);
    setRvClient(rvClient);
    setRoadview(roadview);
    setRvMarker(marker);

    // 초기에는 마커 생성 클릭 이벤트 활성화
    addMapClickListener(kakaoMap);
  };

  // 지도 클릭 이벤트 리스너 추가
  const addMapClickListener = (mapInstance) => {
    if (!mapInstance || !window.kakao) return;

    const listener = window.kakao.maps.event.addListener(
      mapInstance,
      "click",
      (mouseEvent) => {
        const latLng = mouseEvent.latLng;
        handleMapClick(latLng.getLat(), latLng.getLng());
      }
    );

    setMapClickListener(listener);
  };

  // 지도 클릭 이벤트 리스너 제거
  const removeMapClickListener = () => {
    if (mapClickListener && window.kakao) {
      window.kakao.maps.event.removeListener(mapClickListener);
      setMapClickListener(null);
    }
  };

  // 로드뷰 클릭 이벤트 리스너 추가
  const addRoadviewClickListener = (mapInstance) => {
    if (!mapInstance || !window.kakao) return;

    const listener = window.kakao.maps.event.addListener(
      mapInstance,
      "click",
      (mouseEvent) => {
        const position = mouseEvent.latLng;
        if (rvMarker) {
          rvMarker.setPosition(position);
        }
        toggleRoadview(position);
      }
    );

    setMapClickListener(listener);
  };

  // 카카오맵 공식문서 기반 이동 함수들
  const setCenter = (lat, lng) => {
    if (!map || !window.kakao) return;

    // 이동할 위도 경도 위치를 생성합니다
    const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

    // 지도 중심을 이동 시킵니다 (즉시 이동)
    map.setCenter(moveLatLon);
  };

  const panTo = (lat, lng) => {
    if (!map || !window.kakao) return;

    // 이동할 위도 경도 위치를 생성합니다
    const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
  };

  // 추가 이벤트 함수들
  const zoomIn = () => {
    if (!map) return;
    const currentLevel = map.getLevel();
    map.setLevel(Math.max(currentLevel - 1, 1)); // 최대 확대 레벨 1
  };

  const zoomOut = () => {
    if (!map) return;
    const currentLevel = map.getLevel();
    map.setLevel(Math.min(currentLevel + 1, 14)); // 최대 축소 레벨 14
  };

  const resetToSeoul = () => {
    setCenter(37.566826, 126.9786567);
  };

  const smoothMoveToSeoul = () => {
    panTo(37.566826, 126.9786567);
  };

  const jumpToBusan = () => {
    setCenter(35.1796, 129.0756);
  };

  const smoothMoveToBusan = () => {
    panTo(35.1796, 129.0756);
  };

  // 추가 이벤트 함수들
  const getCurrentCenter = () => {
    if (!map) return;
    const center = map.getCenter();
    alert(
      `현재 지도 중심: ${center.getLat().toFixed(6)}, ${center
        .getLng()
        .toFixed(6)}`
    );
  };

  const getCurrentLevel = () => {
    if (!map) return;
    alert(`현재 지도 레벨: ${map.getLevel()}`);
  };

  const setBounds = () => {
    if (!map || !window.kakao) return;

    // 서울과 부산을 모두 포함하는 범위로 설정
    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(37.566826, 126.9786567)); // 서울
    bounds.extend(new window.kakao.maps.LatLng(35.1796, 129.0756)); // 부산

    map.setBounds(bounds);
  };

  const randomLocation = () => {
    // 한국 내 랜덤 위치로 이동
    const randomLat = 33 + Math.random() * (38 - 33);
    const randomLng = 126 + Math.random() * (129 - 126);
    panTo(randomLat, randomLng);
  };

  // 지역별 이동 함수들
  const moveToSeoul = () => {
    panTo(37.566, 126.978);
    zoomIn(37.566, 126.978);
  };
  const moveToBusan = () => {
    panTo(35.102, 129.03);
  };
  const moveToIncheon = () => {
    panTo(37.456, 126.705);
  };
  const moveToDaegu = () => {
    panTo(35.87, 128.591);
  };
  const moveToDaejeon = () => {
    panTo(36.349, 127.385);
  };
  const moveToGwangju = () => {
    panTo(35.155, 126.916);
  };
  const moveToSuwon = () => {
    panTo(37.291, 127.009);
  };
  const moveToUlsan = () => {
    panTo(35.537, 129.317);
  };
  const moveToGoyang = () => {
    panTo(37.658112, 126.83216);
  };
  const moveToChangwon = () => {
    panTo(35.228, 128.681);
  };
  const moveToSeongnam = () => {
    panTo(37.419944, 127.126294);
  };

  // 로드뷰 토글 함수
  const toggleRoadView = () => {
    if (!map || !window.kakao) return;

    if (roadViewEnabled) {
      // 로드뷰 제거 및 마커 생성 클릭 이벤트 활성화
      map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
      setRoadViewEnabled(false);
      addMapClickListener(map);
      // 로드뷰 마커 숨기기
      if (rvMarker) {
        rvMarker.setMap(null);
      }
      // 로드뷰 컨테이너와 미니맵 모달 숨기기
      const rvContainer = document.getElementById("roadview");
      const mapModal = document.getElementById("map-modal");

      if (rvContainer) {
        rvContainer.style.display = "none";
      }
      if (mapModal) {
        mapModal.style.display = "none";
      }

      // 미니맵 정리
      if (miniMap) {
        miniMapMarkers.forEach((marker) => marker.setMap(null));
        setMiniMapMarkers([]);
        setMiniMap(null);
      }
    } else {
      // 로드뷰 추가 및 로드뷰 클릭 이벤트 활성화
      map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
      setRoadViewEnabled(true);
      removeMapClickListener();
      addRoadviewClickListener(map);

      // 로드뷰 마커 표시
      if (rvMarker) {
        rvMarker.setMap(map);
      }
    }
  };

  // 로드뷰 위치 토글 함수
  const toggleRoadview = (position) => {
    if (!rvClient || !roadview || !window.kakao || !map) {
      return;
    }

    rvClient.getNearestPanoId(position, 50, (panoId) => {
      const rvContainer = document.getElementById("roadview");
      const mapModal = document.getElementById("map-modal");
      const miniMapDiv = document.getElementById("mini-map");

      if (panoId === null) {
        // 로드뷰가 없는 경우
        alert("해당 위치에 로드뷰가 없습니다. 다른 위치를 선택해주세요.");
        return;
      }

      // DOM 요소 검증
      if (!rvContainer || !mapModal || !miniMapDiv) {
        console.warn("필요한 DOM 요소를 찾을 수 없습니다:", {
          rvContainer: !!rvContainer,
          mapModal: !!mapModal,
          miniMapDiv: !!miniMapDiv,
        });
        return;
      }

      // 로드뷰가 있는 경우 - 로드뷰 컨테이너와 미니맵 모달 표시
      rvContainer.style.display = "block";
      mapModal.style.display = "block";

      // 로드뷰 컨테이너 강제 크기 설정 (브라우저 호환성)
      rvContainer.style.width = "100vw";
      rvContainer.style.height = "100vh";

      // 미니맵 초기화 또는 업데이트 - 항상 새로 생성하여 안정성 확보
      // 기존 미니맵 정리
      if (miniMap) {
        miniMapMarkers.forEach((marker) => marker.setMap(null));
        setMiniMapMarkers([]);
        setMiniMap(null);
      }

      // 약간의 지연을 두고 미니맵 생성 (DOM 업데이트 대기)
      setTimeout(() => {
        const currentMiniMapDiv = document.getElementById("mini-map");
        if (currentMiniMapDiv) {
          // 새로운 미니맵 생성
          const miniMapOptions = {
            center: position,
            level: map.getLevel() + 1,
          };
          const newMiniMap = new window.kakao.maps.Map(
            currentMiniMapDiv,
            miniMapOptions
          );

          // 미니맵에도 로드뷰 오버레이 적용
          newMiniMap.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);

          setMiniMap(newMiniMap);

          // 미니맵 클릭 이벤트 추가
          window.kakao.maps.event.addListener(
            newMiniMap,
            "click",
            (mouseEvent) => {
              const clickPosition = mouseEvent.latLng;

              // 메인 지도와 미니맵의 마커 위치 동기화
              if (rvMarker) {
                rvMarker.setPosition(clickPosition);
              }

              // 메인 지도 중심도 이동
              map.setCenter(clickPosition);

              toggleRoadview(clickPosition);
            }
          );

          // 메인 지도 이동 시 미니맵도 동기화
          window.kakao.maps.event.addListener(map, "center_changed", () => {
            if (newMiniMap && roadViewEnabled) {
              newMiniMap.setCenter(map.getCenter());
            }
          });

          // 초기 마커 추가
          const initialMarker = new window.kakao.maps.Marker({
            position: position,
            map: newMiniMap,
          });
          setMiniMapMarkers([initialMarker]);
        } else {
          console.error("미니맵 DOM 요소를 찾을 수 없습니다");
        }
      }, 100); // 100ms 지연

      // 로드뷰 설정 - DOM 업데이트 완료 후 실행
      setTimeout(() => {
        roadview.setPanoId(panoId, position);
        // 로드뷰 컨테이너 크기 재계산을 위한 추가 지연
        setTimeout(() => {
          roadview.relayout();
        }, 50);
      }, 50);
    });
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

  // 로드뷰 마커 dragend 이벤트 추가
  useEffect(() => {
    if (rvMarker && window.kakao) {
      window.kakao.maps.event.addListener(
        rvMarker,
        "dragend",
        function (mouseEvent) {
          var position = rvMarker.getPosition();
          toggleRoadview(position);
        }
      );
    }
  }, [rvMarker]);

  // 키보드 단축키 이벤트
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ctrl + B로 사이드바 토글
      if (event.ctrlKey && event.key === "b") {
        event.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }

      // ESC 키로 로드뷰 모드 종료 또는 사이드바 닫기
      if (event.key === "Escape") {
        if (roadViewEnabled) {
          toggleRoadView(); // 로드뷰 모드 종료
        } else if (sidebarOpen) {
          setSidebarOpen(false); // 사이드바 닫기
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [sidebarOpen, roadViewEnabled]);

  const handleMapClick = (lat, lng) => {
    setFormData({ title: "", description: "" });
    setSelectedPin({
      id: Date.now().toString(),
      lat,
      lng,
      title: "",
      description: "",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSavePin = () => {
    if (!selectedPin) return;

    const newPin = {
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

  const handleDeletePin = (pinId) => {
    setPins(pins.filter((p) => p.id !== pinId));
    if (selectedPin?.id === pinId) {
      setSelectedPin(null);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* 사이드바 */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pins={pins}
        selectedPin={selectedPin}
        setSelectedPin={setSelectedPin}
        map={map}
        handleDeletePin={handleDeletePin}
        setCenter={setCenter}
        panTo={panTo}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetToSeoul={resetToSeoul}
        smoothMoveToSeoul={smoothMoveToSeoul}
        jumpToBusan={jumpToBusan}
        smoothMoveToBusan={smoothMoveToBusan}
        getCurrentCenter={getCurrentCenter}
        getCurrentLevel={getCurrentLevel}
        setBounds={setBounds}
        randomLocation={randomLocation}
        moveToSeoul={moveToSeoul}
        moveToBusan={moveToBusan}
        moveToIncheon={moveToIncheon}
        moveToDaegu={moveToDaegu}
        moveToDaejeon={moveToDaejeon}
        moveToGwangju={moveToGwangju}
        moveToSuwon={moveToSuwon}
        moveToUlsan={moveToUlsan}
        moveToGoyang={moveToGoyang}
        moveToChangwon={moveToChangwon}
        moveToSeongnam={moveToSeongnam}
      />

      {/* 메인 컨텐츠 - 전체 화면 고정 */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* 지도와 로드뷰 컨테이너 */}
        <div style={{ flex: 1, display: "flex", position: "relative" }}>
          {/* 지도 래퍼 */}
          <div
            className="map-wrapper"
            style={{ width: "100%", position: "relative" }}
          >
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

            {/* 우측 상단 로드뷰 버튼 */}
            <button
              onClick={toggleRoadView}
              disabled={!map}
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                width: "50px",
                height: "50px",
                backgroundColor: roadViewEnabled ? "#4CAF50" : "white",
                color: roadViewEnabled ? "white" : "#333",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                transition: "all 0.2s ease",
                zIndex: 1500,
                transform: "scale(1.1)",
              }}
              onMouseEnter={(e) => {
                if (!roadViewEnabled) {
                  e.target.style.backgroundColor = "#f0f0f0";
                  e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!roadViewEnabled) {
                  e.target.style.backgroundColor = "white";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
                }
              }}
              title={roadViewEnabled ? "로드뷰 끄기" : "로드뷰 켜기"}
            >
              <FontAwesomeIcon
                icon={faStreetView}
                style={{
                  color: roadViewEnabled ? "white" : "#74C0FC",
                }}
              />
            </button>

            {/* 로드뷰 상태 안내 메시지 */}
            {roadViewEnabled && (
              <div
                style={{
                  position: "fixed",
                  top: "20px",
                  right: "90px",
                  backgroundColor: "rgba(76, 175, 80, 0.95)",
                  color: "white",
                  padding: "12px 18px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                  zIndex: 1400,
                  maxWidth: "280px",
                  lineHeight: "1.4",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  🛣️ 로드뷰 모드 활성화
                </div>
                <div style={{ fontSize: "12px", opacity: "0.9" }}>
                  좌측 하단 지도를 클릭하여 로드뷰를 시작하세요
                </div>
              </div>
            )}

            {/* 우측 하단 확대/축소 버튼 */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => zoomIn()}
                disabled={!map}
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                  e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
                }}
                title="확대"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlassPlus}
                  style={{ color: "#74C0FC" }}
                  size="2xl"
                />
              </button>
              <button
                onClick={() => zoomOut()}
                disabled={!map}
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                  e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
                }}
                title="축소"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlassMinus}
                  style={{ color: "#74C0FC" }}
                  size="2xl"
                />
              </button>
            </div>

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
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    📍
                  </div>
                  <p>카카오 지도를 로딩중입니다...</p>
                </div>
              </div>
            )}
          </div>

          {/* 로드뷰 컨테이너 - 전체 화면 */}
          <div
            id="roadview"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "#f5f5f5",
              display: "none",
              zIndex: 2000,
              overflow: "hidden",
            }}
          >
            {/* 로드뷰 닫기 버튼 */}
            <button
              onClick={() => toggleRoadView()}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "50px",
                height: "50px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                zIndex: 2001,
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
              title="로드뷰 닫기"
            >
              ×
            </button>

            {/* 로드뷰 로딩 중 안내 메시지 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                fontSize: "18px",
                color: "#666",
                zIndex: 2001,
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🛣️</div>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                로드뷰를 준비 중입니다...
              </div>
              <div style={{ fontSize: "14px", color: "#999" }}>
                좌측 하단 지도를 클릭하여 로드뷰를 시작하세요
              </div>
            </div>
          </div>

          {/* 로드뷰 모드 시 좌측 하단 지도 모달 */}
          <div
            id="map-modal"
            style={{
              position: "fixed",
              bottom: "50px",
              left: "50px",
              width: "550px",
              height: "380px",
              backgroundColor: "white",
              border: "3px solid #4CAF50",
              borderRadius: "12px",
              display: "none",
              zIndex: 2100,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            {/* 미니맵 헤더 */}
            <div
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 15px",
                fontSize: "14px",
                fontWeight: "bold",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>🗺️ 로드뷰 지도 (클릭하여 위치 선택)</span>
              <button
                onClick={() => toggleRoadView()}
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
                title="로드뷰 닫기"
              >
                ×
              </button>
            </div>
            <div
              id="mini-map"
              style={{
                width: "100%",
                height: "calc(100% - 44px)",
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>

        {/* 선택된 핀 정보 */}
        {selectedPin && !isModalOpen && (
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <h3>{selectedPin.title || "제목 없음"}</h3>
            <p style={{ color: "#666", marginBottom: "8px" }}>
              {selectedPin.description || "설명 없음"}
            </p>
            <p style={{ fontSize: "12px", color: "black" }}>
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
                marginTop: "12px",
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
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
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90vw",
            }}
          >
            <h2 style={{ marginBottom: "20px", fontSize: "18px" }}>
              핀 정보 입력
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
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
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "bold",
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
              }}
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPin(null);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                onClick={handleSavePin}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
