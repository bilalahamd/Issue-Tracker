// "use client";
// import React from "react";
// import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
// import toast, { Toaster } from "react-hot-toast";
// import axios from "axios";
// import { Issue } from "@prisma/client";
// import { Button, Card, Flex, Heading, Table } from "@radix-ui/themes";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import StatusBadge from "../components/StatusBadge";

// const UserIssues = () => {
//   const { data: session } = useSession();

//   const {
//     data: issues,
//     error,
//     isLoading,
//   } = useQuery<Issue[]>({
//     queryKey: ["userIssues"],
//     queryFn: () => axios.get("/api/userIssues").then((res) => res.data),
//   });

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error.message}</p>;
//   }

//   // Handle button click to close issue
//   // const handleCloseIssue = (userId: number) => {
//   //   axios
//   //     .patch("/api/userIssues/" + userId, { status: "CLOSED" })
//   //     .catch((error) => {
//   //       toast.error("issue not updated");
//   //     });
//   // };
//   const issueData = useMutation({
//     mutationFn: (userId: number) =>
//       axios
//         .patch("/api/userIssues/" + userId, { status: "CLOSED" })
//         .then((res) => res.data),
//     onSuccess: () => {
//       toast.success("Issue closed successfully!");
//     },
//     onError: () => {
//       toast.error("Failed to close the issue. Please try again.");
//     },
//   });

//   return (
//     <Card>
//       <Heading size="2" mb="2">
//         {`Issues Assigned To ${session?.user.name}`}
//       </Heading>
//       <Table.Root>
//         <Table.Body>
//           {issues?.map((issue) => (
//             <Table.Row key={issue.id}>
//               <Table.Cell>
//                 <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
//               </Table.Cell>
//               <Table.Cell>
//                 <StatusBadge status={issue.staus} />
//               </Table.Cell>
//               <Table.Cell>
//                 <Flex justify="between">
//                   <Button
//                     color="red"
//                     disabled={issue.staus === "CLOSED"}
//                     // onClick={() => handleCloseIssue(issue.id)}
//                     onClick={() => issueData.mutate(issue.id)}
//                   >
//                     Close
//                   </Button>
//                 </Flex>
//               </Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table.Root>
//       <Toaster />
//     </Card>
//   );
// };

// export default UserIssues;
"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Issue } from "@prisma/client";
import { Button, Card, Flex, Heading, Table, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StatusBadge from "../components/StatusBadge";

const UserIssues = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetching user issues
  const {
    data: issues,
    error,
    isLoading,
  } = useQuery<Issue[]>({
    queryKey: ["userIssues"],
    queryFn: () => axios.get("/api/userIssues").then((res) => res.data),
  });

  // Mutation for closing an issue
  const issueData = useMutation({
    mutationFn: (userId: number) =>
      axios.patch("/api/userIssues/" + userId, { status: "CLOSED" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userIssues"] });
      toast.success("Issue closed successfully!");
    },
    onError: () => {
      toast.error("Failed to close the issue. Please try again.");
    },
  });

  // Handle loading and error states
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <Card>
      {issues?.length === 0 ? (
        <Text>{`No Issue Assign To ${session?.user.name}`}</Text>
      ) : (
        <>
          <Heading size="2" mb="2">
            {`Issues Assigned To ${session?.user.name}`}
          </Heading>
          <Table.Root>
            <Table.Body>
              {issues?.map((issue) => (
                <Table.Row key={issue.id}>
                  <Table.Cell>
                    <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={issue.staus} />
                  </Table.Cell>
                  <Table.Cell>
                    <Flex justify="between">
                      <Button
                        color="red"
                        disabled={issue.staus === "CLOSED"}
                        onClick={() => issueData.mutate(issue.id)}
                      >
                        Close
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Toaster />
        </>
      )}
    </Card>
  );
};

export default UserIssues;
