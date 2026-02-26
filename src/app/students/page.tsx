"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  program: string;
  year_level: number;
  status: string;
  enrollment_date: string;
}

export default function StudentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterStatus) params.set("status", filterStatus);

    try {
      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    if (session) {
      fetchStudents();
    }
  }, [session, fetchStudents]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-lg">Chargement...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Étudiants</h1>
          <p className="text-gray-600 mt-1">
            {students.length} étudiant{students.length !== 1 ? "s" : ""}{" "}
            enregistré{students.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/students/new"
          className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Ajouter un étudiant
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="graduated">Diplômé</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🎓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun étudiant trouvé
          </h3>
          <p className="text-gray-500 mb-4">
            Commencez par ajouter votre premier étudiant.
          </p>
          <Link
            href="/students/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Ajouter un étudiant
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Programme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Année
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.program || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.year_level
                        ? `Année ${student.year_level}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColor(
                          student.status
                        )}`}
                      >
                        {statusLabel(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      <Link
                        href={`/students/${student.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/students/${student.id}/edit`}
                        className="text-amber-600 hover:text-amber-800 font-medium"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => setDeleteId(student.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
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
