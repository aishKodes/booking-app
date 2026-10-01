"use client";
import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Info, LoaderCircle, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { DemoProvider, useDemo } from "@/lib/store";
const ToastContext = createContext<(message: string, error?: boolean) => void>(() => {});
type ToastMessage = { message: string; error: boolean; id: number };
const FeedbackContext = createContext<{ toast: ToastMessage | null; dismiss: () => void }>({
  toast: null,
  dismiss: () => {},
});
export function Providers({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4200);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  return (
    <MotionConfig reducedMotion="user">
      <DemoProvider>
        <FeedbackContext.Provider value={{ toast, dismiss: () => setToast(null) }}>
          <ToastContext.Provider
            value={(message, error = false) => setToast({ message, error, id: Date.now() })}
          >
            {children}
            <StorageNotice />
            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast.id}
                  className={`toast ${toast.error ? "toast-error" : ""}`}
                  role="status"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {toast.error ? <Info size={19} /> : <Check size={19} />}
                  <span>{toast.message}</span>
                  <button aria-label="Dismiss notification" onClick={() => setToast(null)}>
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </ToastContext.Provider>
        </FeedbackContext.Provider>
      </DemoProvider>
    </MotionConfig>
  );
}
function StorageNotice() {
  const { persistenceError } = useDemo();
  return persistenceError ? (
    <div className="storage-notice" role="alert">
      {persistenceError}
    </div>
  ) : null;
}
export const useToast = () => useContext(ToastContext);
export function Modal({
  children,
  title,
  onClose,
  drawer = false,
  wide = false,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  drawer?: boolean;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const feedback = useContext(FeedbackContext);
  const [initialFeedbackId] = useState(feedback.toast?.id);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${drawer ? "drawer" : ""} ${wide ? "wide" : ""}`}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">ARDO {drawer ? "OPERATIONS" : ""}</span>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
            <X size={21} />
          </button>
        </div>
        {children}
        {feedback.toast && feedback.toast.id !== initialFeedbackId && (
          <div
            className={`dialog-feedback ${feedback.toast.error ? "feedback-error" : ""}`}
            role="status"
          >
            {feedback.toast.error ? <Info size={17} /> : <Check size={17} />}
            <span>{feedback.toast.message}</span>
            <button aria-label="Dismiss dialog feedback" onClick={feedback.dismiss}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
export function ConfirmDialog({
  title,
  description,
  confirm = "Confirm",
  onConfirm,
  onClose,
  danger = false,
}: {
  title: string;
  description: string;
  confirm?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="muted dialog-description">{description}</p>
      <div className="dialog-actions">
        <button className="button button-secondary" onClick={onClose}>
          Keep as is
        </button>
        <button
          className={`button ${danger ? "button-danger" : "button-primary"}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirm}
        </button>
      </div>
    </Modal>
  );
}
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`status status-${status.toLowerCase().replaceAll(" ", "-")}`}>
      <i />
      {status.replace("no-show", "No-show")}
    </span>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-mark">a.</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function LoadingState() {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle className="spin" size={25} />
      <span>Getting everything ready…</span>
    </div>
  );
}
