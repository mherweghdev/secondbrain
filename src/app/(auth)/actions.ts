"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = authSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    const message =
      validatedFields.error.issues[0]?.message || "Données invalides";
    return redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/app");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = authSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    const message =
      validatedFields.error.issues[0]?.message || "Données invalides";
    return redirect(`/signup?error=${encodeURIComponent(message)}`);
  }

  const { data, error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Si on a un utilisateur mais qu'il n'est pas encore confirmé (session est nulle)
  if (data.user && !data.session) {
    return redirect(
      "/login?error=Vérifiez votre boîte mail pour confirmer votre inscription",
    );
  }

  revalidatePath("/", "layout");
  redirect("/app");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
