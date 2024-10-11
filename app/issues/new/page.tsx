import React from "react";
import IssueFormSkeleton from "../_components/IssueFormSkeleton";

import dynamic from "next/dynamic";
const IssueForm = dynamic(() => import("../_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});
const page = () => {
  return <IssueForm />;
};

export default page;
