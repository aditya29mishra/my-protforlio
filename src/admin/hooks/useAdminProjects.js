import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
} from "../../services/admin/projectsAdminService";

const ADMIN_PROJECTS_KEY = ["admin", "projects"];

/**
 * React Query hook to fetch all projects over isolated admin service
 */
export function useAdminProjects() {
  return useQuery({
    queryKey: ADMIN_PROJECTS_KEY,
    queryFn: fetchAdminProjects,
  });
}

/**
 * Mutation hook to create a new project.
 * Invalidates the project list query on success.
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectData) => createAdminProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY });
    },
  });
}

/**
 * Mutation hook to update an existing project.
 * Invalidates the project list query on success.
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectData }) => updateAdminProject(id, projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY });
    },
  });
}

/**
 * Mutation hook to delete a project.
 * Invalidates the project list query on success.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAdminProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY });
    },
  });
}
