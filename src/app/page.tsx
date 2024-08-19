import { Button } from "antd";

export default function Home() {
  return (
    <div className={"text-blue-800 text-3xl"}>
      If you see a large centered blue text, tailwind is working.
      <Button className={"mx-8"}>This button is from AntD</Button>
    </div>
  );
}
