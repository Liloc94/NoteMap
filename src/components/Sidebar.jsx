import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  pins,
  selectedPin,
  setSelectedPin,
  map,
  handleDeletePin,
  // 지도 이동 함수들
  setCenter,
  panTo,
  zoomIn,
  zoomOut,
  resetToSeoul,
  smoothMoveToSeoul,
  jumpToBusan,
  smoothMoveToBusan,
  getCurrentCenter,
  getCurrentLevel,
  setBounds,
  randomLocation,
  // 지역별 이동 함수들
  moveToSeoul,
  moveToBusan,
  moveToIncheon,
  moveToDaegu,
  moveToDaejeon,
  moveToGwangju,
  moveToSuwon,
  moveToUlsan,
  moveToGoyang,
  moveToChangwon,
  moveToSeongnam,
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: sidebarOpen ? "20%" : "0%",
        height: "100vh",
        borderRight: sidebarOpen ? "1px solid #ddd" : "none",
        backgroundColor: "#f9f9f9",
        transition: "all 0.3s ease-in-out",
        overflow: "hidden",
        zIndex: 999,
      }}
    >
      {/* 작은 화살표 토글 버튼 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: "50%",
          left: sidebarOpen ? "calc(20% - 10px)" : "0px",
          transform: "translateY(-50%)",
          width: "20px",
          height: "40px",
          backgroundColor: "white",
          color: "red",
          border: "none",
          borderRadius: sidebarOpen ? "0 8px 8px 0" : "0 8px 8px 0",
          marginLeft: sidebarOpen ? "10px" : "0px",
          cursor: "pointer",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "4px 4px 4px rgba(0,0,0,0.7)",
          zIndex: 1000,
          transition: "all 0.3s ease-in-out",
        }}
        title={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>

      {/* 사이드바 내용 - 열려있을 때만 표시 */}
      {sidebarOpen && (
        <div style={{ padding: "15px" }}>
          <h1 style={{ fontSize: "20px", marginBottom: "20px" }}>
            <FontAwesomeIcon
              icon={faLocationDot}
              size="sm"
              style={{ color: "#FFD43B !important", marginRight: "10px" }}
            />
            지도 핀 관리
          </h1>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
            지도를 클릭하여 핀을 추가하세요
          </p>

          <div
            style={{
              fontSize: "12px",
              color: "#999",
              marginBottom: "20px",
              padding: "8px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
            }}
          >
            <div>
              💡 <strong>단축키:</strong>
            </div>
            <div>• Ctrl + B: 사이드바 토글</div>
            <div>• ESC: 사이드바 닫기</div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3>핀 목록 ({pins.length}개)</h3>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              📍 지도 이동 테스트
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              <button
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
                onClick={() => resetToSeoul()}
              >
                서울 (즉시)
              </button>
              <button
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
                onClick={() => smoothMoveToSeoul()}
              >
                서울 (부드럽게)
              </button>
              <button
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
                onClick={() => jumpToBusan()}
              >
                부산 (즉시)
              </button>
              <button
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#fd7e14",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
                onClick={() => smoothMoveToBusan()}
              >
                부산 (부드럽게)
              </button>
            </div>

            <h4
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              🔍 줌 컨트롤
            </h4>
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              <button
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#6f42c1",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                  flex: 1,
                }}
                onClick={() => zoomIn()}
              >
                확대 (+)
              </button>
              <button
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                  flex: 1,
                }}
                onClick={() => zoomOut()}
              >
                축소 (-)
              </button>
            </div>

            <h4
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              🎛️ 고급 기능
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <button
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
                onClick={() => setBounds()}
              >
                전체 보기
              </button>
              <button
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#e83e8c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
                onClick={() => randomLocation()}
              >
                랜덤 위치
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              <button
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#20c997",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
                onClick={() => getCurrentCenter()}
              >
                현재 중심
              </button>
              <button
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#ffc107",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
                onClick={() => getCurrentLevel()}
              >
                현재 레벨
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              🏙️ 지역별 이동
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "4px",
                marginBottom: "8px",
              }}
            >
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToSeoul()}
              >
                서울
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToBusan()}
              >
                부산
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#FF9800",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToIncheon()}
              >
                인천
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#E91E63",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToDaegu()}
              >
                대구
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#9C27B0",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToDaejeon()}
              >
                대전
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#795548",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToGwangju()}
              >
                광주
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#607D8B",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToSuwon()}
              >
                수원
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#3F51B5",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToUlsan()}
              >
                울산
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#009688",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToGoyang()}
              >
                고양
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#FF5722",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToChangwon()}
              >
                창원
              </button>
              <button
                style={{
                  padding: "4px 6px",
                  backgroundColor: "#8BC34A",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                onClick={() => moveToSeongnam()}
              >
                성남
              </button>
            </div>
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
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "8px",
                  }}
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
      )}
    </div>
  );
}
