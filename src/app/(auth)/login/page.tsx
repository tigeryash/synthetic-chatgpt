"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    <div className="bg-[#11A37F] h-screen flex flex-col items-center justify-center text-center text-white">
      <Image src="chatgpt-6.svg" height={300} width={300} alt="logo" />
      <button
        onClick={() => signIn("google", { callbackUrl: "/chat" })}
        className="font-bold text-3xl animate-pulse"
      >
        Sign in to use ChatGPT
      </button>
    </div>
  );
};

export default Login;
