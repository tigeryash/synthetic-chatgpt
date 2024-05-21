import query from "@/lib/queryApi";
import { adminDb } from "../../../../firebaseAdmin";
import admin from "firebase-admin";

export async function POST(req: Request) {
  const { prompt, chatId, model, session } = await req.json();

  if (!prompt || !chatId || !session?.user?.email) {
    return new Response("Bad request", { status: 400 });
  }

  const userEmail = session?.user?.email;
  const useDocRef = adminDb.collection("users").doc(userEmail);
  const userDoc = await useDocRef.get();

  if (!userDoc.exists) {
    await useDocRef.set({
      email: userEmail,
      createdAt: admin.firestore.Timestamp.now(),
    });
  }

  const response = await query(prompt, chatId, model);

  const message: Message = {
    text: response?.toString() || "Unable to find answer",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
      avatar: "https://ui-avatars.com/api/?name=ChatGPT",
    },
  };

  await adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  return new Response(JSON.stringify({ message }), { status: 200 });
}
