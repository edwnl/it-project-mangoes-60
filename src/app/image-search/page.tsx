import Image from "next/image";
import DragDropImageUpload from "@/components/DragDropImageUpload";

export default function Home() {
  return (
    <main className='absolute inset-0 flex justify-center items-center'>
      <DragDropImageUpload />
    </main>
  );
}
