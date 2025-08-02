import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext<{
  addToast: (message: string, type: "success" | "error") => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "error" }[]
  >([]);
  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow-lg text-white ${
              toast.type === "error" ? "bg-alert-error" : "bg-green-500"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>{" "}
    </ToastContext.Provider>
  );
}

export const useToast: () => {
  addToast: (message: string, type: "success" | "error") => void;
} = () =>
  useContext(ToastContext) as {
    addToast: (message: string, type: "success" | "error") => void;
  };
