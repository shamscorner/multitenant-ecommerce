interface PageProps {
  params: Promise<{ category: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { category } = await params;

  return (
    <div>Category Page: {category}</div>
  );
};

export default Page;
