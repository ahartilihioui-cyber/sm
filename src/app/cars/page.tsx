"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  price: number;
  horsepower: number;
  status: string;
}

export default function CarsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterStatus) params.set("status", filterStatus);

    try {
      const res = await fetch(`/api/cars?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCars(data);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    if (session) {
      fetchCars();
    }
  }, [session, fetchCars]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCars((prev) => prev.filter((c) => c.id !== id));
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "disponible": return "bg-green-900/50 text-green-400 border border-green-800";
      case "vendu": return "bg-blue-900/50 text-blue-400 border border-blue-800";
      case "reserve": return "bg-yellow-900/50 text-yellow-400 border border-yellow-800";
      case "maintenance": return "bg-red-900/50 text-red-400 border border-red-800";
      default: return "bg-gray-800 text-gray-400 border border-gray-700";
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "disponible": return "Disponible";
      case "vendu": return "Vendu";
      case "reserve": return "Réservé";
      case "maintenance": return "Maintenance";
      default: return s;
    }
  };

  const fuelLabel = (f: string) => {
    switch (f) {
      case "essence": return "⛽ Essence";
      case "diesel": return "⛽ Diesel";
      case "hybride": return "🔋 Hybride";
      case "electrique": return "⚡ Électrique";
      case "gpl": return "🔥 GPL";
      default: return f;
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-lg">🚗 Chargement...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">🚗 Voitures</h1>
          <p className="text-gray-400 mt-1">
            {cars.length} voiture{cars.length !== 1 ? "s" : ""} enregistrée{cars.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/cars/new"
          className="px-4 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition shadow-lg shadow-orange-600/20"
        >
          + Ajouter une voiture
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Rechercher par marque, modèle ou plaque..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white placeholder-gray-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="vendu">Vendu</option>
            <option value="reserve">Réservé</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Car Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">🚗 Chargement...</div>
      ) : cars.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <div className="text-6xl mb-4">🏎️</div>
          <h3 className="text-lg font-medium text-white mb-2">
            Aucune voiture trouvée
          </h3>
          <p className="text-gray-400 mb-4">
            Commencez par ajouter votre première voiture.
          </p>
          <Link
            href="/cars/new"
            className="inline-block px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
          >
            Ajouter une voiture
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-orange-600/50 transition-all group"
            >
              {/* Car header with brand color */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-gray-400">{car.year} • {car.license_plate || "—"}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColor(car.status)}`}>
                    {statusLabel(car.status)}
                  </span>
                </div>
              </div>

              {/* Car details */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Carburant</span>
                  <span className="text-gray-300">{fuelLabel(car.fuel_type)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kilométrage</span>
                  <span className="text-gray-300">{car.mileage?.toLocaleString() || 0} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transmission</span>
                  <span className="text-gray-300 capitalize">{car.transmission}</span>
                </div>
                {car.horsepower && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Puissance</span>
                    <span className="text-gray-300">{car.horsepower} CV</span>
                  </div>
                )}
                {car.price && (
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-800">
                    <span className="text-gray-500">Prix</span>
                    <span className="text-orange-400 font-bold">{Number(car.price).toLocaleString()} €</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-gray-950/50 border-t border-gray-800 flex justify-between">
                <div className="flex space-x-3">
                  <Link
                    href={`/cars/${car.id}`}
                    className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/cars/${car.id}/edit`}
                    className="text-amber-500 hover:text-amber-400 text-sm font-medium"
                  >
                    Modifier
                  </Link>
                </div>
                <button
                  onClick={() => setDeleteId(car.id)}
                  className="text-red-500 hover:text-red-400 text-sm font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-2">
              ⚠️ Confirmer la suppression
            </h3>
            <p className="text-gray-400 mb-6">
              Êtes-vous sûr de vouloir supprimer cette voiture ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
