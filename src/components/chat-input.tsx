"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import useSWR from "swr";
import { ArrowUpIcon } from "@heroicons/react/20/solid";

const ChatInput = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo",
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!e.shiftKey) {
        formRef.current?.requestSubmit();
      }
    }
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    const input = prompt.trim();
    setPrompt("");

    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };

    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );

    const notification = toast.loading("ChatGPT is thinking...");

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
      }),
    }).then(() => {
      toast.success("ChatGPT has responded!", { id: notification });
    });
  };

  return (
    <div className="text-gray-400 text-sm w-full flex justify-center">
      <form
        ref={formRef}
        onSubmit={sendMessage}
        className="relative bg-[#2f2f2f] mx-2 flex flex-row gap-3 lg:mx-auto lg:max-w-2xl xl:max-w-3xl overflow-hidden  flex-grow
          rounded-full "
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          style={{ overflowY: "hidden" }}
          className="m-0 w-full flex justify-center items-center outline-none resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 
         pr-10 md:py-3.5 md:pr-12 max-h-[44px] 
           placeholder-black/50  pl-4 dark:placeholder-white/50 dark:placeholder-opacity-50
          py-[10px] md:max-h-[52px] md:pl-6  md:text-lg"
        />

        <button
          type="submit"
          disabled={!prompt || !session}
          className="absolute bottom-[20.2%] right-[2%] sm:right-[1%]  rounded-full border border-black bg-black p-1
           text-black transition-colors enabled:bg-white disabled:text-gray-400 disabled:bg-[#676767]
             md:bottom-[18%] md:right-3"
        >
          <ArrowUpIcon className="w-4 h-4 md:h-6 md:w-6 " />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
