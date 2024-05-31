"use client";

import { useMenuStore } from "@/stores/menustore";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { BsLayoutSidebar } from "react-icons/bs";

const MenuToggle = () => {
  const toggle = useMenuStore((state) => state.toggleClick);
  const isMediumScreen = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <button
      onClick={() => toggle()}
      className=" flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white active:opacity-50 "
    >
      {isMediumScreen ? (
        <Image
          src="/menu.svg"
          className="w-6 h-6"
          alt="sidebar toggle"
          width={5}
          height={5}
        />
      ) : (
        <BsLayoutSidebar className="w-5 h-5 text-white" />
      )}
    </button>
  );
};

export default MenuToggle;
