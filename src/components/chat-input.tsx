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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
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
    <div className=" text-gray-400  text-sm w-full flex justify-center">
      <form
        ref={formRef}
        onSubmit={sendMessage}
        className="relative stretch mx-2 flex flex-row gap-3 lg:mx-auto lg:max-w-2xl xl:max-w-3xl overflow-hidden w-full flex-grow
         border dark:text-white rounded-2xl [&:has(textarea:focus)]:border-token-border-xheavy
          [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)]"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          style={{ overflowY: "hidden" }}
          className=" m-0 w-full resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 
          dark:bg-transparent  pr-10 md:py-3.5 md:pr-12 max-h-[44px] 
           placeholder-black/50 dark:placeholder-white/50 pl-4 md:pl-6v
          py-[10px] md:max-h-[52px] md:pl-6 text-lg"
        />

        <button
          disabled={!prompt || !session}
          className="absolute bottom-1.5 right-2 rounded-lg border border-black bg-black p-0.5
           text-black transition-colors enabled:bg-white disabled:text-gray-400 disabled:opacity-10
            dark:border-white dark:bg-white dark:hover:bg-white md:bottom-3 md:right-3"
        >
          <ArrowUpIcon className="h-6 w-6 " />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
