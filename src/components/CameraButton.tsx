import Image from "next/image";
import CameraButtonImg from "@/assets/CameraButton.svg";
import { MouseEventHandler } from "react";

interface CameraButtonProps {
  onClick?: () => void;
}

const CameraButton = (props:CameraButtonProps) => {
  return (
    <a onClick={props.onClick}>
      <Image src={CameraButtonImg} alt={"Camera Button"} width={112} height={112} />
    </a>
  );
};

export default CameraButton;