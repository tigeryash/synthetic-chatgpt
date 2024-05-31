import { DocumentData } from "firebase/firestore";

import React from "react";
import chagptImg from "../../public/chatgpt-6.svg";
import Image from "next/image";

const Message = ({ message }: { message: DocumentData }) => {
  const isChatGPT = message.user.name === "ChatGPT";
  return (
    <>
      {isChatGPT ? (
        <div className="flex w-full items-start">
          <div className="border-[1px] border-white/50 p-1 flex justify-center items-center rounded-full text-white">
            <Image
              src={chagptImg}
              alt={""}
              className=" h-3 w-3 md:h-6 md:w-6 text-white "
            />
          </div>

          <div className="flex items-center justify-left w-full relative min-h-[20px] break-words ">
            <p className="pt-1 pl-3 text-pretty whitespace-pre-wrap overflow-x-auto text-sm md:text-base">
              {message.text}
            </p>
          </div>
        </div>
      ) : (
        <div className="ml-auto text-pretty max-w-[212px] sm:max-w-[350px] md:max-w-[70%] min-h-[20px] rounded-3xl text-sm md:text-base bg-[#2f2f2f] py-2.5 px-5 break-words">
          {message.text}
        </div>
      )}
    </>
  );
};

export default Message;
