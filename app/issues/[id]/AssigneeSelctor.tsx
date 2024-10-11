"use client";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import toast, { Toaster } from "react-hot-toast";

interface Props {
  issue: Issue;
}

const AsigneeSelect = ({ issue }: Props) => {
  const [selectedUser, setSelectedUser] = useState(
    issue.assignedToUserId || ""
  );

  const { data: users, error, isLoading } = Users();
  if (isLoading) return <p>loading</p>;
  if (error) return null;

  const HandleAsigneeSelector = async (userId: string) => {
    setSelectedUser(userId);
    axios
      .patch("/api/issues/" + issue.id, {
        assignedToUserId: userId || null,
      })
      .catch(() => {
        toast.error("changes could not saved");
        setSelectedUser("");
      });
  };

  return (
    <>
      <Select.Root value={selectedUser} onValueChange={HandleAsigneeSelector}>
        <Select.Trigger aria-placeholder="Asignee" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestion</Select.Label>
            <Select.Item value="">UnAssigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};
const Users = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users/").then((res) => res.data),

    staleTime: 60 * 1000,
    retry: 3,
  });

export default AsigneeSelect;
