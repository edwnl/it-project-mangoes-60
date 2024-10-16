import Image from "next/image";
import CameraButtonImg from "@/assets/CameraButton.svg";

interface CameraButtonProps {
  onClick?: () => void;
}

// simple camera button component with an image
const CameraButton = (props: CameraButtonProps) => {
  return (
    <a onClick={props.onClick}>
      <Image
        src={CameraButtonImg}
        alt={"Camera Button"}
        width={80}
        height={80}
      />
    </a>
  );
};

export default CameraButton;
