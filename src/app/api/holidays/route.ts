import { NextRequest, NextResponse } from "next/server";
import {
  getHolidaysForYear,
  getPtoCountsForYear,
  createHolidays,
} from "@/lib/holidays";
import { CreateHolidayRequest } from "@/lib/types";

export async function GET(request: NextRequest) {
  const year = parseInt(
    request.nextUrl.searchParams.get("year") || String(new Date().getFullYear())
  );

  if (isNaN(year) || year < 1900 || year > 2100) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  const holidays = getHolidaysForYear(year);
  const ptoCounts = getPtoCountsForYear(year);

  return NextResponse.json({ holidays, ptoCounts });
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
