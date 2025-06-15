import * as React from "react"

type ToastType = "success" | "error" | "info" | "warning"

export interface ToastProps {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

type ToastOptions = Omit<ToastProps, "id">

interface ToastContextType {
  toasts: ToastProps[]
  toast: (props: ToastOptions) => void
  dismissToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback(({ duration = 5000, ...props }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    
    // Add the toast
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        ...props,
      },
    ])

    // Auto-dismiss if duration is provided
    if (duration) {
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }
  }, [])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  )
}

function ToastViewport({ toasts, dismissToast }: { toasts: ToastProps[]; dismissToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ id, title, description, type = "info", action, onDismiss }: ToastProps & { onDismiss: () => void }) {
  const typeStyles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  }

  return (
    <div
      className={`mb-2 flex w-full flex-col gap-2 rounded-lg border p-4 shadow-lg transition-all ${typeStyles[type]}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={onDismiss}
          className="text-current opacity-50 hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
      {description && <p className="text-sm">{description}</p>}
      {action && (
        <button
          onClick={() => {
            action.onClick()
            onDismiss()
          }}
          className="mt-2 self-start text-sm font-medium text-current underline"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
