import { supabase } from "../supabaseClient";

/**
 * Signs an admin user in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ user: object, session: object }}
 * @throws {Error} if credentials are invalid or request fails
 */
export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Signs the current admin user out and invalidates the session.
 * @returns {void}
 * @throws {Error} if sign-out fails
 */
export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Retrieves the current active session, if any.
 * @returns {import("@supabase/supabase-js").Session | null}
 * @throws {Error} if the session check itself fails
 */
export async function getAdminSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session ?? null;
}
