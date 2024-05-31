"use client";
import { useSession } from "next-auth/react";
import Chat from "@/components/chat";
import ChatInput from "@/components/chat-input";
import { db } from "../../../../../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

type Props = {
  params: {
    id: string;
  };
};

const ChatPage = ({ params: { id } }: Props) => {
  const { data: session } = useSession();

  const [messages] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats", id, "messages"),
        orderBy("createdAt", "asc")
      )
  );
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Chat chatId={id} />

      {!messages?.empty && <ChatInput chatId={id} />}
    </div>
  );
};

export default ChatPage;
