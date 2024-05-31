"use client";
import NewChat from "./new-chat";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { signOut, useSession } from "next-auth/react";
import ChatRow from "./chat-row";
import { useMediaQuery } from "react-responsive";
import { useMenuStore } from "@/stores/menustore";
import MenuToggle from "./menu-toggle";

const SideBar = () => {
  const { data: session, status } = useSession();
  const isMediumScreen = useMediaQuery({ query: "(max-width: 768px)" }); // adjust the value as needed
  const click = useMenuStore((state) => state.click);
  const toggleClick = useMenuStore((state) => state.toggleClick);

  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );

  return (
    <aside className="relative p-2 flex flex-col min-h-screen">
      <div className="flex-1">
        <div>
          <div className="flex justify-between w-full px-4 py-2">
            <MenuToggle />
            <NewChat session={session} />
          </div>

          <div className="flex flex-col space-y-2 my-2">
            {loading && (
              <div className="animate-pulse text-center text-white">
                <p>Loading chats...</p>
              </div>
            )}
            {chats?.docs.map((chat) => (
              <ChatRow key={chat.id} id={chat.id} />
            ))}
          </div>
        </div>
      </div>
      {session && (
        <div className="sticky w-[260px] bottom-0 flex justify-center items-center">
          <img
            onClick={() => signOut()}
            src={session.user?.image!}
            alt="Profile pic"
            className=" h-12 w-12 rounded-full cursor-pointer mb-2 hover:opacity-50"
          />
        </div>
      )}
    </aside>
  );
};

export default SideBar;
