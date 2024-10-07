"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button, List, Input, Pagination, Tag } from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import NavBar from "@/components/Navbar";
import LoadingPage from "@/components/Loading";
import { Subcategory } from "@/types/types";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import { useAuth } from "@/contexts/AuthContext";
import CreateSubcategoryModal from "./CreateSubcategoryModal";
import CategoryManageModal from "./CategoryManageModal";
import SubcategoryDetailModal from "./SubcategoryDetailModal";
import FilterModal from "@/app/categories/FilterSubcategoryModal";

const CategoryPage: React.FC = () => {
  const { subcategories, loading, error } = useSubcategories();
  const { user, userRole } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);
  const [isCategoryManageModalVisible, setIsCategoryManageModalVisible] =
    useState<boolean>(false);
  const [isSubcategoryDetailModalVisible, setIsSubcategoryDetailModalVisible] =
    useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const pageSize = 7;

  const isAdmin = userRole === "admin";

  // Trims the subcategory name if it exceeds the specified length
  const trimSubcategoryName = (
    name: string,
    maxLength: number = 22,
  ): string => {
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  };

  // searching for categories
  const filteredSubcategories = useMemo(() => {
    return subcategories.filter(
      (item) =>
        (item.subcategory_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!activeFilter || item.category_name === activeFilter),
    );
  }, [subcategories, searchTerm, activeFilter]);

  // Items grouped by category name
  const groupedItems = useMemo(() => {
    return filteredSubcategories.reduce(
      (acc, item) => {
        if (!acc[item.category_name]) {
          acc[item.category_name] = [];
        }
        // @ts-ignore
        acc[item.category_name].push(item);
        return acc;
      },
      {} as Record<string, Subcategory[]>,
    );
  }, [filteredSubcategories]);

  // Handle pagination of the items
  const paginatedItems = useMemo(() => {
    let items: Subcategory[] = [];
    let categoryCount: Record<string, number> = {};
    let totalCount = 0;

    // Iterate through categories and items of each category
    for (const category of Object.keys(groupedItems)) {
      for (const item of groupedItems[category]) {
        if (totalCount >= pageSize * currentPage) break;
        if (totalCount >= pageSize * (currentPage - 1)) {
          items.push(item);
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
        totalCount++;
      }
      if (totalCount >= pageSize * currentPage) break;
    }

    return { items, categoryCount };
  }, [groupedItems, currentPage, pageSize]);

  // Render each subcategory item in the list
  const renderCategoryItem = (item: Subcategory) => (
    <List.Item
      key={item.id}
      className="rounded-lg transition-colors duration-200 hover:underline cursor-pointer"
      onClick={() => {
        setSelectedSubcategory(item);
        setIsSubcategoryDetailModalVisible(true);
      }}
    >
      <div className="flex items-center space-x-4">
        <Image
          src={item.image_url}
          alt={item.subcategory_name}
          width={50}
          height={50}
          className="rounded-md ml-3"
        />
        <div className={"flex flex-col"}>
          <p className={"font-semibold text-black"}>
            {trimSubcategoryName(item.subcategory_name)}
          </p>
          <p>Located at {item.location}</p>
        </div>
      </div>
      <div className={"mr-3"}>N/A</div>
    </List.Item>
  );

  // Render loading page
  if (loading) {
    return <LoadingPage />;
  }
  
  // Render errors
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render main category page
  return (
    <div>
      <NavBar />
      <div className="flex flex-row justify-center px-8">
        <div className="items-center flex-grow max-w-xl">
          <div className="items-start mb-8">
            <p className="text-3xl font-bold mb-4">Categories</p>

            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <Input
                className="mr-4 mb-4 sm:mb-0"
                prefix={<SearchOutlined />}
                placeholder="Search by name or location..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className={"flex"}>
                {isAdmin && (
                  <Button
                    icon={<PlusOutlined />}
                    type={"primary"}
                    className={"text-base h-full mr-4"}
                    onClick={() => setIsCreateModalVisible(true)}
                  >
                    New
                  </Button>
                )}
                <Button
                  icon={<FilterOutlined />}
                  className="w-300px text-base h-full border-dashed border-[#BF0018] text-[#BF0018]"
                  onClick={() => setIsFilterModalVisible(true)}
                >
                  Filter
                </Button>
              </div>
            </div>

            {activeFilter && (
              <Tag closable onClose={clearFilter} className="mb-4">
                Filter: {activeFilter}
              </Tag>
            )}

            {Object.entries(paginatedItems.categoryCount).map(
              ([category, count]) => (
                <div key={category} className="mb-8">
                  <div className="flex flex-row justify-between text-sm font-semibold mb-2">
                    <p
                      className={` ${isAdmin ? "underline cursor-pointer" : ""}`}
                      onClick={() => {
                        if (isAdmin) {
                          setSelectedCategory(category);
                          setIsCategoryManageModalVisible(true);
                        }
                      }}
                    >
                      {category} {">"}
                    </p>
                    <div className={"opacity-70"}>Quantity</div>
                  </div>
                  <List
                    className={"border-2 rounded-md"}
                    dataSource={paginatedItems.items.filter(
                      (item) => item.category_name === category,
                    )}
                    renderItem={renderCategoryItem}
                  />
                </div>
              ),
            )}

            <Pagination
              current={currentPage}
              total={filteredSubcategories.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              className="mt-8 text-center"
            />
          </div>
        </div>
      </div>

      <CreateSubcategoryModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
      />

      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
      />

      {isAdmin && (
        <CategoryManageModal
          isVisible={isCategoryManageModalVisible}
          onClose={() => setIsCategoryManageModalVisible(false)}
          categoryName={selectedCategory}
        />
      )}

      {selectedSubcategory && (
        <SubcategoryDetailModal
          isVisible={isSubcategoryDetailModalVisible}
          onClose={() => setIsSubcategoryDetailModalVisible(false)}
          subcategory={selectedSubcategory}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default CategoryPage;

