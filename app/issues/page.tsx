import { Flex, Select, Table } from "@radix-ui/themes";
import NextLink from "next/link";
import Link from "../components/Link";

import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import ActionButton from "./ActionButton";
import IssueStatusFilter from "./issueStatusFilter";
import SelectPageSize from "./_components/Select";

interface Props {
  searchParams: {
    status?: Status;
    orderBy?: keyof Issue;
    orderDirection?: "asc" | "desc";
    page: string;
  };
}

const page = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "staus", className: "hidden md:table-cell" },
    {
      label: "Created At",
      value: "createdAt",
      className: "hidden md:table-cell",
    },
  ];

  const statuses = Object.values(Status);
  const status =
    searchParams.status && statuses.includes(searchParams.status)
      ? searchParams.status
      : undefined;

  // Default sorting
  const defaultOrderBy = "title";
  const defaultOrderDirection = "asc";

  // Determine orderBy and orderDirection
  const orderBy = {
    [searchParams.orderBy || defaultOrderBy]:
      searchParams.orderDirection || defaultOrderDirection,
  };
  const page = parseInt(searchParams.page) || 1;
  const pageSize = 5;

  const issues = await prisma.issue.findMany({
    where: { staus: status },
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const issueCount = await prisma.issue.count({
    where: { staus: status },
  });

  return (
    <div>
      <Flex justify="between">
        <IssueStatusFilter />
        <ActionButton />
      </Flex>

      <Table.Root variant="surface" className="mb-6">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell key={column.value}>
                <NextLink
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: column.value,
                      orderDirection:
                        column.value === searchParams.orderBy &&
                        searchParams.orderDirection === "asc"
                          ? "desc"
                          : "asc",
                    },
                  }}
                >
                  {column.label}
                </NextLink>
                {column.value === searchParams.orderBy &&
                  (searchParams.orderDirection === "asc" ? (
                    <ArrowUpIcon className="inline" />
                  ) : (
                    <ArrowDownIcon className="inline" />
                  ))}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="md:hidden">
                  <StatusBadge status={issue.staus} />
                </div>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                <StatusBadge status={issue.staus} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex>
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={issueCount}
        />
      </Flex>
    </div>
  );
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Issue Tracker-Issue-List",
  description: "View All Project Issues",
};

export default page;
