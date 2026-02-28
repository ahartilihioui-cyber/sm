"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  doors: number;
  horsepower: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function CarDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetch(`/api/cars/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setCar(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [session, params.id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/cars/${params.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/cars");
      }
    } catch (error) {
      console.error("Error deleting:", error);
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
      case "maintenance": return "En maintenance";
      default: return s;
    }
  };

  const fuelLabel = (f: string) => {
    switch (f) {
      case "essence": return "Essence";
      case "diesel": return "Diesel";
      case "hybride": return "Hybride";
      case "electrique": return "Électrique";
      case "gpl": return "GPL";
      default: return f;
    }
  };

  const colorLabel = (c: string) => {
    const map: Record<string, string> = {
      noir: "Noir", blanc: "Blanc", gris: "Gris", rouge: "Rouge",
      bleu: "Bleu", vert: "Vert", jaune: "Jaune", orange: "Orange",
      marron: "Marron", argent: "Argent",
    };
    return map[c] || c || "Non spécifié";
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-lg">🚗 Chargement...</div>
      </div>
    );
  }

  if (!session) return null;

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-bold text-white mb-2">Voiture non trouvée</h2>
        <Link href="/cars" className="text-orange-500 hover:text-orange-400">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Link
            href="/cars"
            className="text-sm text-orange-500 hover:text-orange-400 mb-2 inline-block"
          >
            ← Retour à la liste
          </Link>
          <h1 className="text-3xl font-bold text-white">
            🚗 {car.brand} {car.model}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusColor(car.status)}`}>
              {statusLabel(car.status)}
            </span>
            <span className="text-gray-400">{car.year}</span>
            {car.license_plate && (
              <span className="bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded-lg text-sm font-mono">
                {car.license_plate}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/cars/${car.id}/edit`}
            className="px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition"
          >
            ✏️ Modifier
          </Link>
          <button
            onClick={() => setShowDelete(true)}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>

      {/* Price banner */}
      {car.price && (
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 mb-6 shadow-lg shadow-orange-600/10">
          <div className="text-white/80 text-sm">Prix</div>
          <div className="text-3xl font-bold text-white">{Number(car.price).toLocaleString()} €</div>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Marque" value={car.brand} />
          <InfoField label="Modèle" value={car.model} />
          <InfoField label="Année" value={String(car.year)} />
          <InfoField label="Couleur" value={colorLabel(car.color)} />
          <InfoField label="Plaque" value={car.license_plate || "Non renseigné"} />
          <InfoField label="Kilométrage" value={`${(car.mileage || 0).toLocaleString()} km`} />
          <InfoField label="Carburant" value={fuelLabel(car.fuel_type)} />
          <InfoField label="Transmission" value={car.transmission === "manuelle" ? "Manuelle" : "Automatique"} />
          <InfoField label="Portes" value={String(car.doors || 4)} />
          <InfoField label="Puissance" value={car.horsepower ? `${car.horsepower} CV` : "Non renseigné"} />
          <InfoField
            label="Date d'ajout"
            value={car.created_at ? new Date(car.created_at).toLocaleDateString("fr-FR") : "—"}
          />
          <InfoField
            label="Dernière mise à jour"
            value={car.updated_at ? new Date(car.updated_at).toLocaleDateString("fr-FR") : "—"}
          />
        </div>
        {car.description && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <InfoField label="Description" value={car.description} />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-2">
              ⚠️ Confirmer la suppression
            </h3>
            <p className="text-gray-400 mb-6">
              Êtes-vous sûr de vouloir supprimer {car.brand} {car.model} ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
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

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-white">{value}</dd>
    </div>
  );
}
