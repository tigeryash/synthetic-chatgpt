"use client";

import SideBar from "@/components/sidebar";
import { useMenuStore } from "@/stores/menustore";
import { useMediaQuery } from "react-responsive";
import { AnimatePresence, motion } from "framer-motion";

const DisplaySidebar = () => {
  const click = useMenuStore((state) => state.click);
  const isMediumScreen = useMediaQuery({ query: "(max-width: 768px)" }); // adjust the value as needed
  const isBigScreen = useMediaQuery({ query: "(min-width: 769px)" }); // adjust the value as needed
  console.log(click);
  return (
    <>
      {isMediumScreen && (
        <AnimatePresence>
          {click && (
            <motion.div
              initial={{ x: "0%" }}
              animate={{ x: "100%" }}
              exit={{ x: "0%" }}
              transition={{ duration: 0.3, type: "tween" }}
              className="bg-[#171717] max-w-xs h-full overflow-y-auto fixed top-0 
            right-full w-full z-50"
            >
              <SideBar />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {isBigScreen && (
        <motion.div
          className={`bg-[#171717] max-w-xs h-full overflow-y-auto md:min-w-[260px] transition-all duration-300 ease-in-out ${
            click ? "visible" : "hidden"
          }`}
        >
          <SideBar />
        </motion.div>
      )}
    </>
  );
};

export default DisplaySidebar;
