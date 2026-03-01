import { NextRequest, NextResponse } from "next/server";
import {
  getHolidaysForYear,
  getPtoCountsForYear,
  createHolidays,
  updateHolidayGroup,
  deleteHolidayGroup,
} from "@/lib/holidays";
import { CreateHolidayRequest, UpdateHolidayGroupRequest } from "@/lib/types";

export async function GET(request: NextRequest) {
  const year = parseInt(
    request.nextUrl.searchParams.get("year") || String(new Date().getFullYear())
  );

  if (isNaN(year) || year < 1900 || year > 2100) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  const holidays = getHolidaysForYear(year);
  const ptoCounts = getPtoCountsForYear(year);

  return NextResponse.json({ holidays, ptoCounts }, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  const body: CreateHolidayRequest = await request.json();

  const userNames = body.user_names?.map((n: string) => n.trim()).filter(Boolean);

  if (!body.dates?.length || !body.name?.trim() || !body.type || !userNames?.length) {
    return NextResponse.json(
      { error: "Missing required fields: dates, name, type, user_names" },
      { status: 400 }
    );
  }

  if (!["national", "company", "pto", "event"].includes(body.type)) {
    return NextResponse.json(
      { error: "Invalid type. Must be national, company, pto, or event" },
      { status: 400 }
    );
  }

  const holidays = createHolidays(
    body.dates,
    body.name.trim(),
    body.type,
    userNames
  );

  return NextResponse.json({ holidays }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body: UpdateHolidayGroupRequest = await request.json();

  if (!body.oldName?.trim() || !body.oldType || !body.newName?.trim() || !body.newType || !body.year) {
    return NextResponse.json(
      { error: "Missing required fields: year, oldName, oldType, newName, newType" },
      { status: 400 }
    );
  }

  if (
    !["national", "company", "pto", "event"].includes(body.oldType) ||
    !["national", "company", "pto", "event"].includes(body.newType)
  ) {
    return NextResponse.json(
      { error: "Invalid type. Must be national, company, pto, or event" },
      { status: 400 }
    );
  }

  const changes = updateHolidayGroup(
    body.year,
    body.oldName.trim(),
    body.oldType,
    body.userName ?? null,
    body.newName.trim(),
    body.newType
  );

  return NextResponse.json({ changes });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const year = parseInt(searchParams.get("year") || "");
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const userName = searchParams.get("user_name");

  if (isNaN(year) || !name || !type) {
    return NextResponse.json(
      { error: "Missing required params: year, name, type" },
      { status: 400 }
    );
  }

  const changes = deleteHolidayGroup(year, name, type, userName || null);
  return NextResponse.json({ changes });
}
