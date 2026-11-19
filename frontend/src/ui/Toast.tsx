import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

type ToastTone = "info" | "success" | "error";

interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

const icons: Record<ToastTone, ReactNode> = {
  info: <Info size={16} />,
  success: <CheckCircle2 size={16} />,
  error: <XCircle size={16} />,
};

const ToastContext = createContext<((message: string, tone?: ToastTone) => void) | null>(null);

/**
 * Wrap the application once; every component below can then confirm an action
 * with `toast("Saved", "success")`. Mutations that report nothing feel broken.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, tone, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3600);
  }, []);

  const region = useMemo(
    () => (
      <div className="toast-region" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.tone}`}>
            {icons[toast.tone]}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    ),
    [toasts],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      {region}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const push = useContext(ToastContext);
  if (!push) throw new Error("useToast must be used inside a ToastProvider");
  return push;
}
