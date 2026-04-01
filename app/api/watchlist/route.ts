import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { z } from 'zod';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: 'file:./dev.db' }),
});

// สร้าง Schema ด้วย Zod สำหรับ Backend Verification
const watchlistSchema = z.object({
  title: z.string().min(1, { message: "กรุณาใส่ชื่อหนัง" }),
  rating: z.number().min(1).max(10, { message: "คะแนนต้องอยู่ระหว่าง 1-10" }),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ตรวจสอบข้อมูลด้วย Zod
    const validatedData = watchlistSchema.parse(body);

    // บันทึกลง Database
    const newEntry = await prisma.watchlist.create({
      data: validatedData,
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const list = await prisma.watchlist.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, rating, comment } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // ตรวจสอบข้อมูลด้วย Zod
    const validatedData = watchlistSchema.parse({ title, rating, comment });

    // อัปเดตข้อมูลใน Database
    const updatedEntry = await prisma.watchlist.update({
      where: { id: Number(id) },
      data: validatedData,
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // ลบข้อมูลจาก Database
    await prisma.watchlist.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}