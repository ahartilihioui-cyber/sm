"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  // Redirect authenticated users to dashboard using hard navigation
  useEffect(() => {
    if (status === "authenticated") {
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      window.location.href = callbackUrl;
    }
  }, [status, searchParams]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-lg text-gray-400">🚗 Redirection...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 px-4 relative overflow-hidden">
      {/* Background car decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-8xl animate-pulse">🚗</div>
        <div className="absolute top-40 right-20 text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🏎️</div>
        <div className="absolute bottom-20 left-1/4 text-7xl animate-pulse" style={{ animationDuration: '4s' }}>🚙</div>
        <div className="absolute bottom-40 right-10 text-5xl animate-bounce" style={{ animationDuration: '5s' }}>🏁</div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-6xl mb-4">🏎️</h1>
          <h2 className="text-2xl font-bold text-white">Car Manager</h2>
          <p className="text-gray-400 mt-1">
            Connectez-vous pour gérer les voitures
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl shadow-black/50 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white placeholder-gray-500"
                placeholder="admin@school.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:ring-4 focus:ring-orange-500/30 transition disabled:opacity-50"
            >
              {isLoading ? "🚗 Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-400">
            <p className="font-medium mb-1 text-gray-300">Identifiants par défaut :</p>
            <p>
              Email : <code className="text-orange-400">admin@school.com</code>
            </p>
            <p>
              Mot de passe : <code className="text-orange-400">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-lg text-gray-400">🚗 Chargement...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
