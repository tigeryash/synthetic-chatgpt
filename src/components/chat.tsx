"use client";

import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import Message from "./message";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const formSchema = z.object({
  audience: z.string(),
  problem: z.string(),
});

type TformSchema = z.infer<typeof formSchema>;

const Chat = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();

  const [messages] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );

  const form = useForm<TformSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audience: "",
      problem: "",
    },
  });

  const onSubmit: SubmitHandler<TformSchema> = async (onSubmitData) => {
    const notification = toast.loading("ChatGPT is thinking...");
    const response = await fetch("/api/createInterview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session, chatId, onSubmitData }),
    });

    toast.success("ChatGPT has responded!", { id: notification });

    form.reset();
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  return (
    <div className="flex-1 overflow-y-auto py-2 px-3 md:px-5 lg:px-1 xl:px-5 ">
      {messages?.empty && (
        <>
          <p className="mt-10 text-center text-white">Set Up interviewer</p>
          <ArrowDownCircleIcon className="mx-auto w-10 h-10 text-white animate-bounce mt-5" />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="text-white flex flex-col space-y-4 mt-5 justify-center items-center md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto"
            >
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-2xl">{`Who's your audience?`}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your audience"
                        className="text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-white">
                      This will let ChatGPT know who your Synthetic Interviewees
                      are.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-2xl">{`What are the problems you want to ask questions on?`}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your audience"
                        className="text-black"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-white">
                      This will let ChatGPT know what problems you want to ask
                      the Synthetic Interviewees.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button
                disabled={form.formState.isSubmitting}
                className=""
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </>
      )}
      <div
        className="relative w-full flex-col space-y-2 md:space-y-8 lg:space-y-10 text-white 
      md:mx-auto flex md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"
      >
        {messages?.docs.map((message) => (
          <Message key={message.id} message={message.data()} />
        ))}
      </div>

      <div className="pb-5 md:pb-10 " ref={messagesEndRef} />
    </div>
  );
};

export default Chat;
