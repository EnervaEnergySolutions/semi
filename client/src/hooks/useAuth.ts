import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest, getQueryFn } from "../lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | undefined, Error>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    select: (data) => {
      if (!data) return null;
      
      // Ensure permissionLevel has a default value for team members
      if (data.role === 'team_member' && !data.permissionLevel) {
        return {
          ...data,
          permissionLevel: 'viewer'
        };
      }
      
      return data;
    }
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };
}