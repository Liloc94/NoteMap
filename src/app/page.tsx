import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
      <Image src="/logo.png" alt="logo" width={100} height={100} />
      <div id="home-buttons" className="flex flex-row items-center gap-4 p-4">
        <Button asChild variant="secondary" className="bg-white text-black">
          <Link href="/">Home</Link>
        </Button>
        <div className="flex flex-col items-center gap-4">
          <Button asChild variant="secondary" className="bg-white text-black">
            <Link href="/map">지도 보기</Link>
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button asChild variant="secondary" className="bg-white text-black">
            <Link href="/markers">마커 아이콘 샘플</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
