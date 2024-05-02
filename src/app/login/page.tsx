"use client";
import { FormEvent, useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      return setError(res.error as string);
    }
    if (res?.ok) {
      return router.push("/dashboard");
    }

    console.log("response", res);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div className="bg-red-500 text-white p-2 mb-2">{error}</div>}
        <h1>Signin</h1>

        <input
          type="email"
          placeholder="some@email.com"
          name="email"
          className="bg-zinc-800 px-4 py-2 block mb-2"
        />
        <input
          type="password"
          placeholder="******"
          name="password"
          className="bg-zinc-800 px-4 py-2 block mb-2"
        />
        <button className="bg-yellow-500 px-4 py-2">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
