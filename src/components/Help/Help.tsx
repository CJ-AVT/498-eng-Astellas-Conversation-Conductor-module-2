import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

export default function Help() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      {/* Trigger button anchored to right side, rotated 90 degrees anticlockwise */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed right-0 z-50 flex flex-col items-center gap-1 px-2 py-4  transition-colors -translate-y-1/2 bg-[var(--color-help-button-background)] rounded-l-lg top-1/2 hover:opacity-90">
          <HelpCircle className="w-4 h-4 text-[var(--color-help-button-text)]" />
          <span className="[writing-mode:vertical-rl] text-[var(--color-help-button-text)] text-lg">Help</span>
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto bg-[var(--color-help-popup-background)]">
          <DialogHeader className="pr-10">
            <DialogTitle className="text-2xl font-bold text-[var(--color-help-popup-text)]">Help & Information</DialogTitle>
            <DialogDescription className="text-[var(--color-help-popup-text)]">Lorem Ipsum.</DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <section>
              <h3 className="mb-3 text-lg font-semibold text-[var(--color-help-popup-text)]">Getting Started</h3>
              <p className="leading-relaxed text-[var(--color-help-popup-text)]">Lorem Ipsum.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
