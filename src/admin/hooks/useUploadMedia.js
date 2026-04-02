import { useMutation } from "@tanstack/react-query";
import { uploadMedia } from "../../services/admin/mediaAdminService";

/**
 * React Query mutation wrapper for uploading media.
 * 
 * Usage:
 *   const { mutate, isPending, isError, data } = useUploadMedia();
 * 
 *   mutate({
 *     file,
 *     prefix: "projects/my-project",
 *     meta: { label: "Project Image", alt_text: "Preview" }
 *   });
 * 
 * Note: No query invalidation occurs because media records are not cached
 * centrally. The mutation response is handled directly via onSuccess by caller.
 */
export function useUploadMedia() {
  return useMutation({
    mutationFn: ({ file, prefix, meta }) => uploadMedia(file, prefix, meta),
  });
}
