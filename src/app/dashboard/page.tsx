"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  graduatedStudents: number;
  programStats: { program: string; count: number }[];
  genderStats: { gender: string; count: number }[];
  recentStudents: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    program: string;
    status: string;
  }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

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
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-lg">Chargement...</div>
      </div>
    );
  }

  if (!session) return null;

  const statusColor = (s: string) => {
    switch (s) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "graduated":
        return "bg-blue-100 text-blue-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "active":
        return "Actif";
      case "inactive":
        return "Inactif";
      case "graduated":
        return "Diplômé";
      case "suspended":
        return "Suspendu";
      default:
        return s;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">
          Bienvenue, {session.user?.name || "Admin"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.totalStudents || 0}
          </div>
          <div className="text-sm text-gray-500">Total étudiants</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">
            {stats?.activeStudents || 0}
          </div>
          <div className="text-sm text-gray-500">Étudiants actifs</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl mb-2">🎓</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats?.graduatedStudents || 0}
          </div>
          <div className="text-sm text-gray-500">Diplômés</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-3xl mb-2">⏸️</div>
          <div className="text-2xl font-bold text-gray-600">
            {stats?.inactiveStudents || 0}
          </div>
          <div className="text-sm text-gray-500">Inactifs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Programs distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📚 Répartition par programme
          </h2>
          {stats?.programStats && stats.programStats.length > 0 ? (
            <div className="space-y-3">
              {stats.programStats.map((p) => (
                <div key={p.program} className="flex items-center">
                  <div className="flex-1 text-sm text-gray-700">
                    {p.program}
                  </div>
                  <div className="w-32 bg-gray-100 rounded-full h-2 mx-3">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (p.count / (stats?.totalStudents || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 w-8 text-right">
                    {p.count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune donnée disponible</p>
          )}
        </div>

        {/* Recent Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              🕐 Étudiants récents
            </h2>
            <Link
              href="/students"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Voir tout →
            </Link>
          </div>
          {stats?.recentStudents && stats.recentStudents.length > 0 ? (
            <div className="space-y-3">
              {stats.recentStudents.map((s) => (
                <Link
                  key={s.id}
                  href={`/students/${s.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {s.first_name} {s.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {s.program || "Non assigné"}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor(
                      s.status
                    )}`}
                  >
                    {statusLabel(s.status)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-3">
                Aucun étudiant enregistré
              </p>
              <Link
                href="/students/new"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ajouter un étudiant →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
