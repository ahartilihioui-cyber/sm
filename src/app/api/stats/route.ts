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

    const totalCars = dbGet("SELECT COUNT(*) as count FROM cars") as { count: number };
    const disponibleCars = dbGet("SELECT COUNT(*) as count FROM cars WHERE status = 'disponible'") as { count: number };
    const venduCars = dbGet("SELECT COUNT(*) as count FROM cars WHERE status = 'vendu'") as { count: number };
    const maintenanceCars = dbGet("SELECT COUNT(*) as count FROM cars WHERE status = 'maintenance'") as { count: number };
    const reserveCars = dbGet("SELECT COUNT(*) as count FROM cars WHERE status = 'reserve'") as { count: number };

    const brandStats = dbAll(
      "SELECT brand, COUNT(*) as count FROM cars WHERE brand IS NOT NULL GROUP BY brand ORDER BY count DESC"
    );

    const fuelStats = dbAll(
      "SELECT fuel_type, COUNT(*) as count FROM cars WHERE fuel_type IS NOT NULL GROUP BY fuel_type"
    );

    const recentCars = dbAll(
      "SELECT * FROM cars ORDER BY created_at DESC LIMIT 5"
    );

    return NextResponse.json({
      totalCars: totalCars?.count || 0,
      disponibleCars: disponibleCars?.count || 0,
      venduCars: venduCars?.count || 0,
      maintenanceCars: maintenanceCars?.count || 0,
      reserveCars: reserveCars?.count || 0,
      brandStats,
      fuelStats,
      recentCars,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
