import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
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
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_PROJECTS_KEY });
      const previousProjects = queryClient.getQueryData(ADMIN_PROJECTS_KEY);
      queryClient.setQueryData(ADMIN_PROJECTS_KEY, (old) => {
        if (!old) return [{ ...newProject, id: `temp-${Date.now()}` }];
        return [...old, { ...newProject, id: `temp-${Date.now()}` }];
      });
      return { previousProjects };
    },
    onError: (error, newProject, context) => {
      queryClient.setQueryData(ADMIN_PROJECTS_KEY, context.previousProjects);
      toast.error("Failed to create project");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY });
    },
    onSuccess: () => {
      toast.success("Project created successfully");
    }
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
    onMutate: async ({ id, projectData }) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_PROJECTS_KEY });
      const previousProjects = queryClient.getQueryData(ADMIN_PROJECTS_KEY);
      queryClient.setQueryData(ADMIN_PROJECTS_KEY, (old) => {
        if (!old) return old;
        return old.map(p => p.id === id ? { ...p, ...projectData } : p);
      });
      return { previousProjects };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(ADMIN_PROJECTS_KEY, context.previousProjects);
      toast.error("Failed to update project");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY });
    },
    onSuccess: () => {
      toast.success("Project updated successfully");
    }
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_PROJECTS_KEY });
      const previousProjects = queryClient.getQueryData(ADMIN_PROJECTS_KEY);
      queryClient.setQueryData(ADMIN_PROJECTS_KEY, (old) => {
        if (!old) return old;
        return old.filter(p => p.id !== id);
      });
      return { previousProjects };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(ADMIN_PROJECTS_KEY, context.previousProjects);
      toast.error("Failed to delete project");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY });
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
    }
  });
}
