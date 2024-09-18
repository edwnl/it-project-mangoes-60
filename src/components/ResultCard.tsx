"use client";

import React from "react";
import Image from "next/image";
import { Tag } from "antd";
import { SearchResult } from "@/types/SearchTypes";

interface ResultCardProps {
  result: SearchResult;
  isCorrect: boolean;
  isIncorrect: boolean;
  onClick: (result: SearchResult) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  isCorrect,
  isIncorrect,
  onClick,
}) => {
  return (
    <div
      className="border rounded-lg p-4 cursor-pointer w-full max-w-[300px]"
      onClick={() => onClick(result)}
    >
      <Image
        src={result.image_url}
        alt={result.subcategory_name}
        width={150}
        height={150}
        className="mb-2 object-contain mx-auto"
      />
      <p className="text-sm text-gray-500">{result.id}</p>
      <p className="font-semibold">{result.subcategory_name}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        <Tag>{result.category_name}</Tag>
        {isCorrect && <Tag color="green">Correct</Tag>}
        {isIncorrect && <Tag color="red">Incorrect</Tag>}
      </div>
    </div>
  );
};

export default ResultCard;
