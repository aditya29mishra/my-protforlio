import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
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
    onMutate: async (newEntry) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_TIMELINE_KEY });
      const previousTimeline = queryClient.getQueryData(ADMIN_TIMELINE_KEY);
      queryClient.setQueryData(ADMIN_TIMELINE_KEY, (old) => {
        if (!old) return [{ ...newEntry, id: `temp-${Date.now()}` }];
        return [...old, { ...newEntry, id: `temp-${Date.now()}` }];
      });
      return { previousTimeline };
    },
    onError: (error, newEntry, context) => {
      queryClient.setQueryData(ADMIN_TIMELINE_KEY, context.previousTimeline);
      toast.error("Failed to add timeline entry");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIMELINE_KEY });
    },
    onSuccess: () => {
      toast.success("Entry added successfully");
    }
  });
}

export function useUpdateTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, timelineData }) => updateAdminTimeline(id, timelineData),
    onMutate: async ({ id, timelineData }) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_TIMELINE_KEY });
      const previousTimeline = queryClient.getQueryData(ADMIN_TIMELINE_KEY);
      queryClient.setQueryData(ADMIN_TIMELINE_KEY, (old) => {
        if (!old) return old;
        return old.map(t => t.id === id ? { ...t, ...timelineData } : t);
      });
      return { previousTimeline };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(ADMIN_TIMELINE_KEY, context.previousTimeline);
      toast.error("Failed to update entry");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIMELINE_KEY });
    },
    onSuccess: () => {
      toast.success("Entry updated successfully");
    }
  });
}

export function useDeleteTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAdminTimeline(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_TIMELINE_KEY });
      const previousTimeline = queryClient.getQueryData(ADMIN_TIMELINE_KEY);
      queryClient.setQueryData(ADMIN_TIMELINE_KEY, (old) => {
        if (!old) return old;
        return old.filter(t => t.id !== id);
      });
      return { previousTimeline };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(ADMIN_TIMELINE_KEY, context.previousTimeline);
      toast.error("Failed to delete entry");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIMELINE_KEY });
    },
    onSuccess: () => {
      toast.success("Entry deleted successfully");
    }
  });
}
