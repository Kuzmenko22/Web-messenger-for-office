/*import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Navbar } from "./_components/navbar";
import { SigninLink } from "./_components/signlink";

export default async function Home() {
  return <h1>Main page</h1>
}*/


import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/tasks");
}


