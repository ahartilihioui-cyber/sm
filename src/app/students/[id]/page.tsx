"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string;
  program: string;
  year_level: number;
  status: string;
  enrollment_date: string;
  created_at: string;
  updated_at: string;
}

export default function StudentDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetch(`/api/students/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setStudent(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [session, params.id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/students/${params.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/students");
      }
    } catch (error) {
      console.error("Error deleting:", error);
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

  const genderLabel = (g: string) => {
    switch (g) {
      case "male":
        return "Masculin";
      case "female":
        return "Féminin";
      default:
        return g || "Non spécifié";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-lg">Chargement...</div>
      </div>
    );
  }

  if (!session) return null;

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Étudiant non trouvé
        </h2>
        <Link href="/students" className="text-blue-600 hover:text-blue-800">
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
            href="/students"
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Retour à la liste
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {student.first_name} {student.last_name}
          </h1>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${statusColor(
              student.status
            )}`}
          >
            {statusLabel(student.status)}
          </span>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/students/${student.id}/edit`}
            className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition"
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Prénom" value={student.first_name} />
          <InfoField label="Nom" value={student.last_name} />
          <InfoField label="Email" value={student.email} />
          <InfoField
            label="Date de naissance"
            value={student.date_of_birth || "Non renseigné"}
          />
          <InfoField label="Genre" value={genderLabel(student.gender)} />
          <InfoField
            label="Téléphone"
            value={student.phone || "Non renseigné"}
          />
          <InfoField
            label="Programme"
            value={student.program || "Non assigné"}
          />
          <InfoField
            label="Année d'étude"
            value={student.year_level ? `Année ${student.year_level}` : "—"}
          />
          <InfoField
            label="Date d'inscription"
            value={student.enrollment_date || "—"}
          />
          <InfoField
            label="Dernière mise à jour"
            value={
              student.updated_at
                ? new Date(student.updated_at).toLocaleDateString("fr-FR")
                : "—"
            }
          />
        </div>
        {student.address && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <InfoField label="Adresse" value={student.address} />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer {student.first_name}{" "}
              {student.last_name} ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
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
      <dd className="mt-1 text-gray-900">{value}</dd>
    </div>
  );
}
