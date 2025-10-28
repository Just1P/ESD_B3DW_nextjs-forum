import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("DELETE message called", params);
  const { id } = await params;

  const deletedMessage = await prisma.message.delete({
    where: { id },
  });

  return NextResponse.json(deletedMessage);
}
