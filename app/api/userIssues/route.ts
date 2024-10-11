import authOption from "@/app/auth/authOption";
import prisma from "@/prisma/client";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOption);
  if (!session)
    return NextResponse.json({ error: "unauthorized User" }, { status: 401 });
  const userId = session.user.id;
  const issues = await prisma.issue.findMany({
    where: { assignedToUserId: userId },
  });
  if (!issues)
    return NextResponse.json(
      { message: "no issue assigned to this user" },
      { status: 200 }
    );
  return NextResponse.json(issues, { status: 200 });
}
