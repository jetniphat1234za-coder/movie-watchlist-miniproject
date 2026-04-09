"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AlertDialogProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: number; // auto close after ms
}

export default function AlertDialog({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoClose = 3000,
}: AlertDialogProps) {
  // Auto close after autoClose ms
  React.useEffect(() => {
    if (!isOpen || !autoClose) return;
    const timer = setTimeout(() => onClose(), autoClose);
    return () => clearTimeout(timer);
  }, [isOpen, autoClose, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`rounded-2xl border p-6 shadow-2xl max-w-sm ${
              type === "success"
                ? "border-emerald-400/20 bg-emerald-400/10"
                : "border-red-400/20 bg-red-400/10"
            }`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex items-start gap-3 ${
                type === "success" ? "text-emerald-100" : "text-red-100"
              }`}
            >
              <div className="text-2xl">
                {type === "success" ? "✓" : "⚠"}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm opacity-90">{message}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`mt-4 w-full rounded-lg px-4 py-2 font-medium transition ${
                type === "success"
                  ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-500/30"
                  : "bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-500/30"
              }`}
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
