import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  fetchAdminSkills,
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
} from "../../services/admin/skillsAdminService";

const ADMIN_SKILLS_KEY = ["admin", "skills"];

export function useAdminSkills() {
  return useQuery({
    queryKey: ADMIN_SKILLS_KEY,
    queryFn: fetchAdminSkills,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillData) => createAdminSkill(skillData),
    onMutate: async (newSkill) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_SKILLS_KEY });
      const previousSkills = queryClient.getQueryData(ADMIN_SKILLS_KEY);
      queryClient.setQueryData(ADMIN_SKILLS_KEY, (old) => {
        if (!old) return [{ ...newSkill, id: `temp-${Date.now()}` }];
        return [...old, { ...newSkill, id: `temp-${Date.now()}` }];
      });
      return { previousSkills };
    },
    onError: (error, newSkill, context) => {
      queryClient.setQueryData(ADMIN_SKILLS_KEY, context.previousSkills);
      toast.error("Failed to add skill");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SKILLS_KEY });
    },
    onSuccess: () => {
      toast.success("Skill added successfully");
    }
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, skillData }) => updateAdminSkill(id, skillData),
    onMutate: async ({ id, skillData }) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_SKILLS_KEY });
      const previousSkills = queryClient.getQueryData(ADMIN_SKILLS_KEY);
      queryClient.setQueryData(ADMIN_SKILLS_KEY, (old) => {
        if (!old) return old;
        return old.map(s => s.id === id ? { ...s, ...skillData } : s);
      });
      return { previousSkills };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(ADMIN_SKILLS_KEY, context.previousSkills);
      toast.error("Failed to update skill");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SKILLS_KEY });
    },
    onSuccess: () => {
      toast.success("Skill updated successfully");
    }
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAdminSkill(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_SKILLS_KEY });
      const previousSkills = queryClient.getQueryData(ADMIN_SKILLS_KEY);
      queryClient.setQueryData(ADMIN_SKILLS_KEY, (old) => {
        if (!old) return old;
        return old.filter(s => s.id !== id);
      });
      return { previousSkills };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(ADMIN_SKILLS_KEY, context.previousSkills);
      toast.error("Failed to delete skill");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SKILLS_KEY });
    },
    onSuccess: () => {
      toast.success("Skill deleted successfully");
    }
  });
}
