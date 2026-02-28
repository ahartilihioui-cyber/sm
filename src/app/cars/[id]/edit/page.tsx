"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import CarForm from "@/components/CarForm";

export default function EditCarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [car, setCar] = useState<any>(null);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/cars/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(`/cars/${params.id}`);
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
      <div className="mb-6">
        <Link
          href={`/cars/${params.id}`}
          className="text-sm text-orange-500 hover:text-orange-400 mb-2 inline-block"
        >
          ← Retour au détail
        </Link>
        <h1 className="text-3xl font-bold text-white">
          ✏️ Modifier {car.brand} {car.model}
        </h1>
        <p className="text-gray-400 mt-1">
          Modifiez les informations du véhicule
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <CarForm car={car} onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}
