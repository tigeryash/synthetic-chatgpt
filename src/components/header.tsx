"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import MenuToggle from "./menu-toggle";
import { useMediaQuery } from "react-responsive";
import { useMenuStore } from "@/stores/menustore";

const Header = () => {
  const isMediumScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const click = useMenuStore((state) => state.click);

  return (
    <header className="w-full  ">
      <div className="p-2 top-0 z-10 flex min-h-[40px] md:h-14 items-center justify-between border-b border-[#444444] bg-[#212121] pl-1 ">
        {isMediumScreen && <MenuToggle />}

        <div
          className="group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-medium 
        hover:bg-[#2f2f2f] text-white md:ml-0 "
        >
          {!isMediumScreen && !click && <MenuToggle />}
          <p className="md:pl-4 text-xl">
            ChatGPT <span className="hidden md:visible">3.5</span>
          </p>
          <ChevronDownIcon className="h-5 w-5" />
        </div>

        <button className=" relative hover:bg-[#2f2f2f] p-1 flex md:h-9 md:w-9 items-center justify-center rounded-lg">
          <Image
            src="/share.svg"
            className="w-5 h-5"
            alt="share button"
            width={5}
            height={5}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
