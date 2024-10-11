import authOption from "@/app/auth/authOption";
import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import AsigneeSelect from "./AssigneeSelctor";
import IssueDeleteButton from "./IssueDeleteButton";
import IssueDetail from "./IssueDetail";
import IssueEditButton from "./IssueEditButton";
import { cache } from "react";

interface Props {
  params: { id: string };
}
const fetchUser = cache((IssueId: number) =>
  prisma.issue.findUnique({ where: { id: IssueId } })
);
const page = async ({ params }: Props) => {
  const session = await getServerSession(authOption);
  const id = parseInt(params.id);
  if (isNaN(id)) {
    notFound();
  }
  const issue = await fetchUser(parseInt(params.id));
  if (!issue) notFound();
  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetail issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="5">
            <AsigneeSelect issue={issue} />
            <IssueEditButton issueId={issue.id} />
            <IssueDeleteButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};
export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt(params.id));

  return {
    title: issue?.title,
    description: "Detail of Issue" + issue?.id,
  };
}
export default page;
