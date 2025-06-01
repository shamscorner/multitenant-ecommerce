"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}
