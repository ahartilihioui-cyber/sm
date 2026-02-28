import { NextRequest, NextResponse } from "next/server";
import getDb, { dbAll, dbGet, dbRun } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all cars
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
    const brand = searchParams.get("brand") || "";
    const fuel_type = searchParams.get("fuel_type") || "";

    let query = "SELECT * FROM cars WHERE 1=1";
    const params: string[] = [];

    if (search) {
      query += " AND (brand LIKE ? OR model LIKE ? OR license_plate LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    if (brand) {
      query += " AND brand = ?";
      params.push(brand);
    }

    if (fuel_type) {
      query += " AND fuel_type = ?";
      params.push(fuel_type);
    }

    query += " ORDER BY created_at DESC";

    const cars = dbAll(query, ...params);
    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des voitures" },
      { status: 500 }
    );
  }
}

// POST create a new car
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    await getDb();
    const body = await request.json();

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

    if (!brand || !model || !year) {
      return NextResponse.json(
        { error: "Marque, modèle et année sont requis" },
        { status: 400 }
      );
    }

    if (license_plate) {
      const existing = dbGet("SELECT id FROM cars WHERE license_plate = ?", license_plate);
      if (existing) {
        return NextResponse.json(
          { error: "Une voiture avec cette plaque d'immatriculation existe déjà" },
          { status: 409 }
        );
      }
    }

    const result = dbRun(
      `INSERT INTO cars (brand, model, year, color, license_plate, mileage, fuel_type, transmission, price, doors, horsepower, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      brand,
      model,
      year,
      color || null,
      license_plate || null,
      mileage || 0,
      fuel_type || "essence",
      transmission || "manuelle",
      price || null,
      doors || 4,
      horsepower || null,
      description || null,
      status || "disponible"
    );

    const car = dbGet("SELECT * FROM cars WHERE id = ?", result.lastInsertRowid);
    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la voiture" },
      { status: 500 }
    );
  }
}
