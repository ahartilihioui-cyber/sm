import { NextRequest, NextResponse } from "next/server";
import getDb, { dbGet, dbRun } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET a single student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await getDb();
    const student = dbGet("SELECT * FROM students WHERE id = ?", id);

    if (!student) {
      return NextResponse.json(
        { error: "Étudiant non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'étudiant" },
      { status: 500 }
    );
  }
}

// PUT update a student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await getDb();
    const body = await request.json();

    const existing = dbGet("SELECT * FROM students WHERE id = ?", id);
    if (!existing) {
      return NextResponse.json(
        { error: "Étudiant non trouvé" },
        { status: 404 }
      );
    }

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

    // Check for email uniqueness (excluding current student)
    if (email) {
      const emailExists = dbGet(
        "SELECT id FROM students WHERE email = ? AND id != ?",
        email,
        id
      );
      if (emailExists) {
        return NextResponse.json(
          { error: "Un autre étudiant avec cet email existe déjà" },
          { status: 409 }
        );
      }
    }

    dbRun(
      `UPDATE students SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        date_of_birth = COALESCE(?, date_of_birth),
        gender = COALESCE(?, gender),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        program = COALESCE(?, program),
        year_level = COALESCE(?, year_level),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      first_name || null,
      last_name || null,
      email || null,
      date_of_birth || null,
      gender || null,
      phone || null,
      address || null,
      program || null,
      year_level || null,
      status || null,
      id
    );

    const updated = dbGet("SELECT * FROM students WHERE id = ?", id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'étudiant" },
      { status: 500 }
    );
  }
}

// DELETE a student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await getDb();

    const existing = dbGet("SELECT * FROM students WHERE id = ?", id);
    if (!existing) {
      return NextResponse.json(
        { error: "Étudiant non trouvé" },
        { status: 404 }
      );
    }

    dbRun("DELETE FROM students WHERE id = ?", id);
    return NextResponse.json({ message: "Étudiant supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'étudiant" },
      { status: 500 }
    );
  }
}
