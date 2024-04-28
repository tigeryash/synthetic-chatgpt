import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const query = async (prompt: string, chatId: string, model: string) => {
  const res = await openai.chat.completions
    .create({
      model: model,
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
    })
    .then((res) => {
      return res.choices[0].message.content;
    })
    .catch((err) => {
      `ChatGPT was unable to find an answer for that! Error: ${err.message}`;
    });
  console.log(res);
  return res;
};

export default query;
