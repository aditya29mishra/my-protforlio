import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SKILLS_KEY });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, skillData }) => updateAdminSkill(id, skillData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SKILLS_KEY });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAdminSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SKILLS_KEY });
    },
  });
}
