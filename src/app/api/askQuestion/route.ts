import query from "@/lib/queryApi";
import { adminDb } from "../../../../firebaseAdmin";
import admin from "firebase-admin";

export async function POST(req: Request) {
  const { prompt, chatId, model, session } = await req.json();
  console.log(prompt, chatId, model, session);

  if (!prompt) {
    return Response.json(null, { status: 400 });
  }

  if (!chatId) {
    return Response.json(null, { status: 400 });
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

  return Response.json({ message });
}
