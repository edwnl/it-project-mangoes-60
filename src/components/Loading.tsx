import { Spin } from "antd";

const LoadingPage = () => {
  return (
    <div className="flex justify-center mt-16 md:mt-0 md:items-center md:h-screen w-screen">
      <Spin size="large" />
    </div>
  );
};

export default LoadingPage;
