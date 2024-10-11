import prisma from "@/prisma/client";
import IssueFormSkeleton from "../../_components/IssueFormSkeleton";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
interface Props {
  params: { id: string };
}
const IssueForm = dynamic(() => import("../../_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

const EditIssuePage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue) notFound();

  return <IssueForm issue={issue} />;
};

export default EditIssuePage;
