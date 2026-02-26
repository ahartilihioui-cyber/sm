"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import StudentForm from "@/components/StudentForm";

export default function EditStudentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/students/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(`/students/${params.id}`);
      } else {
        const err = await res.json();
        setError(err.error || "Erreur lors de la mise à jour");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setIsSubmitting(false);
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
      <div className="mb-6">
        <Link
          href={`/students/${params.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
        >
          ← Retour au profil
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Modifier : {student.first_name} {student.last_name}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <StudentForm
          student={student}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
