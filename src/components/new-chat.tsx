"use client";

import { PlusIcon } from "@heroicons/react/16/solid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";

const NewChat = ({ session }: { session: any }) => {
  const router = useRouter();
  const createNewChat = async () => {
    const doc = await addDoc(
      collection(db, "users", session.user.email, "chats"),
      {
        userId: session.user.email,
        createdAt: serverTimestamp(),
      }
    );
    router.push(`/chat/${doc.id}`);
  };
  return (
    <div
      onClick={createNewChat}
      className="border-gray-700 border flex-1 chatRow"
    >
      <PlusIcon className="h-4 w-4" />
      <p>New Chat</p>
    </div>
  );
};

export default NewChat;
