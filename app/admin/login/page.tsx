import { isAuthed } from "@/lib/auth";
import { redirect } from "next/navigation";
import { loginAction } from "../actions";
import { Frame } from "@/components/motion/frame";

type SP = Promise<{ error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  if (await isAuthed()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="min-h-screen grid place-items-center page-gutter py-20">
      <div className="w-full max-w-[420px]">
        <Frame>
          <div className="p-8 md:p-10">
            <div className="t-micro text-body">/ RESTRICTED</div>
            <h1 className="t-title text-ink mt-4">Sign in</h1>
            <p className="mt-4 t-body text-body">
              Use the password set in <code className="text-ink">ADMIN_PASSWORD</code>.
              Defaults to <code className="text-ink">admin</code> if unset.
            </p>

            <form action={loginAction} className="mt-8 flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="t-micro text-body">PASSWORD</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  autoFocus
                  className="w-full bg-transparent border border-[var(--rule)] px-4 py-3 t-nav text-ink focus:outline-none focus:border-ink transition-colors"
                />
              </label>
              {error && (
                <p className="t-micro text-ink">Incorrect password. Try again.</p>
              )}
              <button
                type="submit"
                className="mt-2 bg-ink text-paper px-5 py-3 t-nav hover:opacity-90 transition-opacity"
              >
                SIGN IN →
              </button>
            </form>
          </div>
        </Frame>
      </div>
    </div>
  );
}
