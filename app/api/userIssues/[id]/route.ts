import authOption from "@/app/auth/authOption";
import prisma from "@/prisma/client";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
interface Props {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOption);
  if (!session)
    return NextResponse.json({ error: "unAuthorized User" }, { status: 401 });
  const body = await req.json();
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue)
    return NextResponse.json(
      { error: "Issue With The Given Id Was not Found" },
      { status: 404 }
    );
  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      staus: body.status,
    },
  });
  return NextResponse.json(updatedIssue, { status: 201 });
}
