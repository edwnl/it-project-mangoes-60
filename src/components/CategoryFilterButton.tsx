import React, { useState } from "react";
import { Button } from "antd";
import { FilterIcon } from "lucide-react";


interface CategoryFilterButtonProps {
  "name": string | null;
}
const CategoryFilterButton = (props: CategoryFilterButtonProps) => {
  const [categoryName, setCategoryName] = useState<string | null>(null);
  return (
    <div className={"mb-2 mt-2 md:mb-4 md:mt-4 md:pl-8"}>
    <Button className={"flex flex-row content-start w-fit border-dashed border-amber-900 border-2"}>
    <FilterIcon/>
      Category Filter:
      <div className={"text-bold"}>{categoryName ? categoryName : "Not set"}</div>
    </Button>
    </div>
  )
}

export default CategoryFilterButton;