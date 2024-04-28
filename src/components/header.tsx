"use client";
import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useMenuStore } from "@/stores/menustore";

const Header = () => {
  const toggle = useMenuStore((state) => state.toggleClick);
  return (
    <header className="w-full ">
      <div className="sticky p-2 top-0 z-10 flex w-full min-h-[40px] md:h-14 items-center justify-between border-b border-[#444444] bg-[#212121] pl-1 md:justify-start">
        <button
          onClick={() => toggle()}
          type="button"
          className="absolute bottom-0 left-0 top-0 inline-flex items-center justify-center rounded-md px-3 hover:text-token-text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white active:opacity-50 md:hidden"
        >
          <img src="/menu.svg" alt="sidebar toggle" />
        </button>
        <div
          className="group flex cursor-pointer items-center gap-1 rounded-xl py-2 px-3 text-lg font-medium 
        hover:bg-[#2f2f2f] text-white ml-auto md:ml-0 mr-auto"
        >
          <p className=" text-xl">
            ChatGPT <span>3.5</span>
          </p>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
        <button className=" relative border border-neutral-400  flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg">
          <div className="flex w-full gap-2 items-center justify-center">
            <img src="/share.svg" className="text-white" alt="share button" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
