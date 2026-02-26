import { NextRequest, NextResponse } from "next/server";
import getDb, { dbAll, dbGet, dbRun } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all students
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    await getDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const program = searchParams.get("program") || "";

    let query = "SELECT * FROM students WHERE 1=1";
    const params: string[] = [];

    if (search) {
      query +=
        " AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    if (program) {
      query += " AND program = ?";
      params.push(program);
    }

    query += " ORDER BY created_at DESC";

    const students = dbAll(query, ...params);
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des étudiants" },
      { status: 500 }
    );
  }
}

// POST create a new student
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    await getDb();
    const body = await request.json();

    const {
      first_name,
      last_name,
      email,
      date_of_birth,
      gender,
      phone,
      address,
      program,
      year_level,
      status,
    } = body;

    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: "Prénom, nom et email sont requis" },
        { status: 400 }
      );
    }

    const existing = dbGet("SELECT id FROM students WHERE email = ?", email);
    if (existing) {
      return NextResponse.json(
        { error: "Un étudiant avec cet email existe déjà" },
        { status: 409 }
      );
    }

    const result = dbRun(
      `INSERT INTO students (first_name, last_name, email, date_of_birth, gender, phone, address, program, year_level, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      first_name,
      last_name,
      email,
      date_of_birth || null,
      gender || null,
      phone || null,
      address || null,
      program || null,
      year_level || 1,
      status || "active"
    );

    const student = dbGet("SELECT * FROM students WHERE id = ?", result.lastInsertRowid);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'étudiant" },
      { status: 500 }
    );
  }
}
