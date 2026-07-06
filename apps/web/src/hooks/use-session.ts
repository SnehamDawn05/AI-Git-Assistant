import { authClient } from "@/lib/auth-client";

export function useSession() {
  const session = authClient.useSession();

  return {
    session: session.data?.session,
    user: session.data?.user,
    isPending: session.isPending,
    error: session.error,
    refetch: session.refetch,
  };
}
