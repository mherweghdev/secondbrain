import { signup } from "../actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-white">
          Créer un compte
        </h2>
        <p className="text-zinc-400 text-sm">
          Commencez à organiser vos idées dès maintenant
        </p>
      </div>

      <form action={signup} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <label className="text-xs font-medium text-zinc-500 mb-1 block ml-1 transition-colors group-focus-within:text-indigo-400">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="votre@email.com"
            />
          </div>
          <div className="relative group">
            <label className="text-xs font-medium text-zinc-500 mb-1 block ml-1 transition-colors group-focus-within:text-indigo-400">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] hover:translate-y-[-1px]"
        >
          S&apos;inscrire
        </button>
      </form>

      <div className="text-center">
        <a
          href="/login"
          className="text-zinc-400 hover:text-white text-sm transition-colors"
        >
          Déjà un compte ?{" "}
          <span className="text-indigo-400 font-medium">Se connecter</span>
        </a>
      </div>
    </div>
  );
}
