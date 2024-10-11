"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogRoot,
  AlertDialogTitle,
  Button,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const IssueDeleteButton = ({ issueId }: { issueId: number }) => {
  console.log(issueId);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  return (
    <div>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isDeleting}>
            Delete
          </Button>
        </AlertDialog.Trigger>
        <AlertDialogContent>
          <AlertDialogTitle>Danger!</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure to Delete this Issue! This action will be undone
          </AlertDialogDescription>
          <AlertDialog.Cancel>
            <Button color="gray" variant="soft">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              color="red"
              onClick={async () => {
                try {
                  setDeleting(true);
                  await axios.delete("/api/issues/" + issueId);
                  router.push("/issues");
                  router.refresh();
                } catch (error) {
                  setDeleting(false);
                  setError(true);
                }
              }}
            >
              Delete
            </Button>
          </AlertDialog.Action>
        </AlertDialogContent>
      </AlertDialog.Root>
      <AlertDialogRoot open={error}>
        <AlertDialogContent>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>
            this issue Could not be deleted
          </AlertDialogDescription>
          <Button color="gray" variant="soft" onClick={() => setError(false)}>
            OK
          </Button>
        </AlertDialogContent>
      </AlertDialogRoot>
    </div>
  );
};

export default IssueDeleteButton;
