import { NextRequest, NextResponse } from "next/server";
import getDb, { dbGet, dbRun } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET a single car
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
    const car = dbGet("SELECT * FROM cars WHERE id = ?", id);

    if (!car) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la voiture" },
      { status: 500 }
    );
  }
}

// PUT update a car
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

    const existing = dbGet("SELECT * FROM cars WHERE id = ?", id);
    if (!existing) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    const {
      brand,
      model,
      year,
      color,
      license_plate,
      mileage,
      fuel_type,
      transmission,
      price,
      doors,
      horsepower,
      description,
      status,
    } = body;

    // Check for license plate uniqueness (excluding current car)
    if (license_plate) {
      const plateExists = dbGet(
        "SELECT id FROM cars WHERE license_plate = ? AND id != ?",
        license_plate,
        id
      );
      if (plateExists) {
        return NextResponse.json(
          { error: "Une autre voiture avec cette plaque existe déjà" },
          { status: 409 }
        );
      }
    }

    dbRun(
      `UPDATE cars SET
        brand = COALESCE(?, brand),
        model = COALESCE(?, model),
        year = COALESCE(?, year),
        color = COALESCE(?, color),
        license_plate = COALESCE(?, license_plate),
        mileage = COALESCE(?, mileage),
        fuel_type = COALESCE(?, fuel_type),
        transmission = COALESCE(?, transmission),
        price = COALESCE(?, price),
        doors = COALESCE(?, doors),
        horsepower = COALESCE(?, horsepower),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      brand || null,
      model || null,
      year || null,
      color || null,
      license_plate || null,
      mileage || null,
      fuel_type || null,
      transmission || null,
      price || null,
      doors || null,
      horsepower || null,
      description || null,
      status || null,
      id
    );

    const updated = dbGet("SELECT * FROM cars WHERE id = ?", id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la voiture" },
      { status: 500 }
    );
  }
}

// DELETE a car
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

    const existing = dbGet("SELECT * FROM cars WHERE id = ?", id);
    if (!existing) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    dbRun("DELETE FROM cars WHERE id = ?", id);
    return NextResponse.json({ message: "Voiture supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la voiture" },
      { status: 500 }
    );
  }
}
