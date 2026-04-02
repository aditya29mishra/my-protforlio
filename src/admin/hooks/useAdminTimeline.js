import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminTimeline,
  createAdminTimeline,
  updateAdminTimeline,
  deleteAdminTimeline,
} from "../../services/admin/timelineAdminService";

const ADMIN_TIMELINE_KEY = ["admin", "timeline"];

export function useAdminTimeline() {
  return useQuery({
    queryKey: ADMIN_TIMELINE_KEY,
    queryFn: fetchAdminTimeline,
  });
}

export function useCreateTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timelineData) => createAdminTimeline(timelineData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIMELINE_KEY });
    },
  });
}

export function useUpdateTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, timelineData }) => updateAdminTimeline(id, timelineData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIMELINE_KEY });
    },
  });
}

export function useDeleteTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAdminTimeline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIMELINE_KEY });
    },
  });
}
