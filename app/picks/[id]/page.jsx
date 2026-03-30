import { PickArticlePage } from "@/components/PickArticlePage";

export const metadata = {
  title: "Article — Campus Nest",
};

export default async function PickArticleRoute({ params }) {
  const { id } = await params;
  return <PickArticlePage articleId={Number(id)} />;
}
