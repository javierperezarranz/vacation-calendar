import { NextRequest, NextResponse } from "next/server";
import { deleteHoliday } from "@/lib/holidays";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const deleted = deleteHoliday(numericId);

  if (!deleted) {
    return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
