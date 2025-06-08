// Re-export from sonner for consistency with existing code
export { toast } from "sonner";

// Keep the useToast hook for backward compatibility with existing components
import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  return {
    toast: (props: { title?: string; description?: string; variant?: "destructive" | "default" }) => {
      if (props.variant === "destructive") {
        return sonnerToast.error(props.title || props.description || "Error");
      }
      return sonnerToast.success(props.title || props.description || "Success");
    },
    dismiss: () => sonnerToast.dismiss(),
    toasts: [] // Empty array to maintain compatibility with old Toaster component
  };
};
