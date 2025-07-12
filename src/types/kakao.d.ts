// 카카오맵 API 타입 정의
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: MapOptions) => KakaoMap;
        LatLng: new (lat: number, lng: number) => LatLng;
        Marker: new (options: MarkerOptions) => KakaoMarker;
        event: {
          addListener: (
            target: any,
            type: string,
            handler: (event: any) => void
          ) => void;
        };
      };
    };
  }
}

interface MapOptions {
  center: LatLng;
  level: number;
}

interface MarkerOptions {
  position: LatLng;
  title?: string;
}

interface LatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMap {
  getLevel: () => number;
  setLevel: (level: number) => void;
}

interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
}

export {};
