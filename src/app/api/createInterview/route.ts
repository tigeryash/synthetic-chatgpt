import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../firebaseAdmin";
import admin from "firebase-admin";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const {
      onSubmitData: { audience, problem },
      chatId,
      session,
    } = await req.json();

    console.log(
      `Received data: audience=${audience}, problem=${problem}, chatId=${chatId}, session=${session}`
    );

    if (!audience || !problem || !chatId || !session?.user?.email) {
      return new Response("Audience and problem are required", { status: 400 });
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

    // Save audience and problem to Firestore at the same level as messages
    const chatRef = userDocRef.collection("chats").doc(chatId);
    await chatRef.set(
      {
        audience,
        problem,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Generate initial interview question with OpenAI
    const prompt = `You are an interviewer. The audience is ${audience}. The problem to discuss is ${problem}. You are talking to Synthetic Users who are taking surveys. Start the interview with a suitable question and make the question complex.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const messageContent = response.choices[0].message.content;

    const message = {
      text: messageContent,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      user: {
        _id: "ChatGPT",
        name: "ChatGPT",
        avatar: "https://ui-avatars.com/api/?name=ChatGPT",
      },
    };

    await chatRef.collection("messages").add(message);

    return new Response(JSON.stringify({ id: userDocRef.id }), { status: 200 });
  } catch (error) {
    console.error("Error creating interview: ", error);
    return new Response("Error creating interview", { status: 500 });
  }
}
