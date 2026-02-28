"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalCars: number;
  disponibleCars: number;
  venduCars: number;
  maintenanceCars: number;
  reserveCars: number;
  brandStats: { brand: string; count: number }[];
  fuelStats: { fuel_type: string; count: number }[];
  recentCars: {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    status: string;
    fuel_type: string;
  }[];
}

const carNotifications = [
  "🚗 Nouvelle voiture ajoutée au parc !",
  "🔧 Rappel : vérifier les véhicules en maintenance",
  "🏎️ Offre spéciale sur les véhicules disponibles",
  "📋 Pensez à mettre à jour les kilométrages",
  "⛽ Vérifiez les niveaux de carburant",
  "🔑 Nouvelle réservation en attente",
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [visibleNotif, setVisibleNotif] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/stats")
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
          // Generate dynamic notifications
          const notifs: string[] = [];
          if (data.maintenanceCars > 0) notifs.push(`🔧 ${data.maintenanceCars} voiture(s) en maintenance`);
          if (data.reserveCars > 0) notifs.push(`🔑 ${data.reserveCars} voiture(s) réservée(s)`);
          if (data.disponibleCars > 0) notifs.push(`✅ ${data.disponibleCars} voiture(s) disponible(s)`);
          notifs.push(carNotifications[Math.floor(Math.random() * carNotifications.length)]);
          setNotifications(notifs);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  // Rotating notifications
  useEffect(() => {
    if (notifications.length === 0) return;
    let idx = 0;
    setVisibleNotif(notifications[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % notifications.length;
      setVisibleNotif(notifications[idx]);
    }, 5000);
    return () => clearInterval(interval);
  }, [notifications]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-lg">🚗 Chargement...</div>
      </div>
    );
  }

  if (!session) return null;

  const statusColor = (s: string) => {
    switch (s) {
      case "disponible": return "bg-green-900/50 text-green-400";
      case "vendu": return "bg-blue-900/50 text-blue-400";
      case "reserve": return "bg-yellow-900/50 text-yellow-400";
      case "maintenance": return "bg-red-900/50 text-red-400";
      default: return "bg-gray-800 text-gray-400";
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Notification banner */}
      {visibleNotif && (
        <div className="mb-6 bg-gradient-to-r from-orange-600/20 to-orange-900/20 border border-orange-600/30 rounded-xl px-4 py-3 flex items-center car-notification">
          <span className="text-orange-400 text-sm font-medium">{visibleNotif}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">🏎️ Tableau de bord</h1>
        <p className="text-gray-400 mt-1">
          Bienvenue, {session.user?.name || "Admin"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-orange-600/40 transition">
          <div className="text-3xl mb-2">🚗</div>
          <div className="text-2xl font-bold text-white">
            {stats?.totalCars || 0}
          </div>
          <div className="text-sm text-gray-400">Total voitures</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-green-600/40 transition">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-400">
            {stats?.disponibleCars || 0}
          </div>
          <div className="text-sm text-gray-400">Disponibles</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-blue-600/40 transition">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-blue-400">
            {stats?.venduCars || 0}
          </div>
          <div className="text-sm text-gray-400">Vendues</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-red-600/40 transition">
          <div className="text-3xl mb-2">🔧</div>
          <div className="text-2xl font-bold text-red-400">
            {stats?.maintenanceCars || 0}
          </div>
          <div className="text-sm text-gray-400">En maintenance</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand distribution */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            🏷️ Répartition par marque
          </h2>
          {stats?.brandStats && stats.brandStats.length > 0 ? (
            <div className="space-y-3">
              {stats.brandStats.map((b) => (
                <div key={b.brand} className="flex items-center">
                  <div className="flex-1 text-sm text-gray-300">
                    {b.brand}
                  </div>
                  <div className="w-32 bg-gray-800 rounded-full h-2 mx-3">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{
                        width: `${(b.count / (stats?.totalCars || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-white w-8 text-right">
                    {b.count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune donnée disponible</p>
          )}

          {/* Fuel stats */}
          {stats?.fuelStats && stats.fuelStats.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">⛽ Par carburant</h3>
              <div className="flex flex-wrap gap-2">
                {stats.fuelStats.map((f) => (
                  <span key={f.fuel_type} className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-xs text-gray-300">
                    {fuelLabel(f.fuel_type)} ({f.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Cars */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">
              🕐 Voitures récentes
            </h2>
            <Link
              href="/cars"
              className="text-sm text-orange-500 hover:text-orange-400"
            >
              Voir tout →
            </Link>
          </div>
          {stats?.recentCars && stats.recentCars.length > 0 ? (
            <div className="space-y-3">
              {stats.recentCars.map((c) => (
                <Link
                  key={c.id}
                  href={`/cars/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition"
                >
                  <div>
                    <div className="font-medium text-white">
                      {c.brand} {c.model}
                    </div>
                    <div className="text-sm text-gray-500">
                      {c.year} • {c.price ? `${Number(c.price).toLocaleString()} €` : "Prix non défini"}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor(c.status)}`}
                  >
                    {statusLabel(c.status)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🏎️</div>
              <p className="text-gray-500 text-sm mb-3">
                Aucune voiture enregistrée
              </p>
              <Link
                href="/cars/new"
                className="text-orange-500 hover:text-orange-400 text-sm font-medium"
              >
                Ajouter une voiture →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Notifications panel */}
      <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🔔 Notifications</h2>
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">{notif}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-gray-500 text-sm">Aucune notification</p>
          )}
        </div>
      </div>
    </div>
  );
}
