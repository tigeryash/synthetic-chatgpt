import query from "@/lib/queryApi";
import { adminDb } from "../../../../firebaseAdmin";
import admin from "firebase-admin";

export async function POST(req: Request) {
  const { prompt, chatId, model, session } = await req.json();

  if (!prompt || !chatId || !session?.user?.email) {
    return new Response("Bad request", { status: 400 });
  }

  const userEmail = session?.user?.email;
  const userDocRef = adminDb.collection("users").doc(userEmail);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    await userDocRef.set({
      email: userEmail,
      createdAt: admin.firestore.Timestamp.now(),
    });
  }

  // Fetch the audience and problem from Firestore
  const chatDocRef = userDocRef.collection("chats").doc(chatId);
  const chatDoc = await chatDocRef.get();

  if (!chatDoc.exists) {
    return new Response("Chat not found", { status: 404 });
  }

  const { audience, problem } = chatDoc.data() as {
    audience: string;
    problem: string;
  };

  if (!audience || !problem) {
    return new Response("Audience and problem context missing", {
      status: 400,
    });
  }

  // Include audience and problem in the prompt
  const contextPrompt = `You are an interviewer. The audience is ${audience}. The problem to discuss is ${problem}. Continue the conversation considering this context. ${prompt} and keep the conversation going by asking more complex questions but limit to only 1 per response.`;

  const response = await query(contextPrompt, chatId, model);

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
    .doc(userEmail)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  return new Response(JSON.stringify({ message }), { status: 200 });
}
