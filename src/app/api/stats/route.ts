import { NextResponse } from "next/server";
import getDb, { dbAll, dbGet } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    await getDb();

    const totalStudents = dbGet("SELECT COUNT(*) as count FROM students") as { count: number };
    const activeStudents = dbGet("SELECT COUNT(*) as count FROM students WHERE status = 'active'") as { count: number };
    const inactiveStudents = dbGet("SELECT COUNT(*) as count FROM students WHERE status = 'inactive'") as { count: number };
    const graduatedStudents = dbGet("SELECT COUNT(*) as count FROM students WHERE status = 'graduated'") as { count: number };

    const programStats = dbAll(
      "SELECT program, COUNT(*) as count FROM students WHERE program IS NOT NULL GROUP BY program ORDER BY count DESC"
    );

    const genderStats = dbAll(
      "SELECT gender, COUNT(*) as count FROM students WHERE gender IS NOT NULL GROUP BY gender"
    );

    const recentStudents = dbAll(
      "SELECT * FROM students ORDER BY created_at DESC LIMIT 5"
    );

    return NextResponse.json({
      totalStudents: totalStudents?.count || 0,
      activeStudents: activeStudents?.count || 0,
      inactiveStudents: inactiveStudents?.count || 0,
      graduatedStudents: graduatedStudents?.count || 0,
      programStats,
      genderStats,
      recentStudents,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
