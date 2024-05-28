"use client";
import NewChat from "./new-chat";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { signOut, useSession } from "next-auth/react";
import ChatRow from "./chat-row";
import { useMediaQuery } from "react-responsive";
import { useMenuStore } from "@/stores/menustore";

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
    <aside className="p-2 flex flex-col h-screen">
      <div className="flex-1">
        <div>
          <div className="flex w-full gap-2">
            <NewChat session={session} />
            {isMediumScreen && click && (
              <button
                className="border-gray-700 border chatRow flex-1"
                onClick={() => toggleClick()}
              >
                Hide
              </button>
            )}
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
        <img
          onClick={() => signOut()}
          src={session.user?.image!}
          alt="Profile pic"
          className="h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50"
        />
      )}
    </aside>
  );
};

export default SideBar;
