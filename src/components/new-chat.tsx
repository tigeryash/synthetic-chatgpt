"use client";

import { PencilSquareIcon, PlusIcon } from "@heroicons/react/16/solid";
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
    <PencilSquareIcon onClick={createNewChat} className="h-6 w-6 text-white" />
  );
};

export default NewChat;
