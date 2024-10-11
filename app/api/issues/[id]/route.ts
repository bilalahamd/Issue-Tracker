import authOption from "@/app/auth/authOption";
import { patchIssueSchema } from "@/app/validation";
import prisma from "@/prisma/client";
import { error } from "console";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOption);
  if (!session) return NextResponse.json({}, { status: 401 });
  const body = await request.json();
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
  const { assignedToUserId, title, description } = body;
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });
    if (!user)
      return NextResponse.json({ error: "invalid user" }, { status: 400 });
  }
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue)
    return NextResponse.json(
      { error: "Issue With The Given Id Was Not Found" },
      { status: 404 }
    );
  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title,
      description,
      assignedToUserId,
      staus: assignedToUserId ? "IN_PROGRESS" : issue.staus,
    },
  });
  return NextResponse.json(updatedIssue, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOption);
  if (!session) return NextResponse.json({}, { status: 401 });
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue)
    return NextResponse.json(
      { error: "Issue with the Given Id Was Not Found" },
      { status: 404 }
    );
  try {
    await prisma.issue.delete({
      where: { id: issue.id },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "faild to delete issue" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "issue deleted successfully" });
}
