"use client";

import { useEffect, useRef } from "react";

export default function KakaoMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    // 이미 로드된 경우 스킵
    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=1d942b3f6295cca93ee7c47e9942e78b&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        initMap();
      });
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

  const initMap = () => {
    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
