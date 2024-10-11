import Image from "next/image";
import Pagination from "./components/Pagination";
import LatestIssueList from "./LatestIssueList";
import IssuesSummary from "./IssuesSummary";
import prisma from "@/prisma/client";
import IssueBarChart from "./IssueBarChart";
import { Flex, Grid } from "@radix-ui/themes";
import { title } from "process";
import { Metadata } from "next";

export default async function Home() {
  const open = await prisma.issue.count({
    where: {
      staus: "OPEN",
    },
  });
  const inProgress = await prisma.issue.count({
    where: {
      staus: "IN_PROGRESS",
    },
  });
  const closed = await prisma.issue.count({
    where: {
      staus: "CLOSED",
    },
  });
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <IssuesSummary open={open} inProgress={inProgress} closed={closed} />
        <IssueBarChart open={open} inProgress={inProgress} closed={closed} />
      </Flex>
      <LatestIssueList />
    </Grid>
  );
}
export const metadata: Metadata = {
  title: "Issue Tracker-Dashboard",
  description: "View a summary of Project issues",
};
