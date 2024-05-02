"use client";
import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const [error, setError] = useState();
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const signupResponse = await axios.post("api/auth/signup", {
        email: formData.get("email"),
        password: formData.get("password"),
        fullname: formData.get("fullname"),
      });
      console.log("signupResponse", signupResponse);
      const res = await signIn("credentials", {
        email: signupResponse.data.email,
        password: formData.get("password"),
        redirect: false,
      });
      console.log("response", res);
      if (res?.ok) {
        return router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div className="bg-red-500 text-white p-2 mb-2">{error}</div>}
        <h1>Signup</h1>
        <input
          type="text"
          placeholder="Ciro Martin"
          name="fullname"
          className="bg-zinc-800 px-4 py-2 block mb-2"
        />
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
        <button className="bg-yellow-500 px-4 py-2">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
