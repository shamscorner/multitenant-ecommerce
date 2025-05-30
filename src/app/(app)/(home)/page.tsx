import { getQueryClient, trpc } from "@/trpc/server";

export default async function Home() {
  const queryClient = getQueryClient();
  const categories = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <h2>Categories</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{JSON.stringify(category)}</li>
        ))}
      </ul>
    </div>
  );
}
