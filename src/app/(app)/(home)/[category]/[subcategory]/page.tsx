interface PageProps {
  params: Promise<{
    category: string,
    subcategory: string
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { category, subcategory } = await params;

  return (
    <div>Category Page: {category} - {subcategory}</div>
  );
};

export default Page;
