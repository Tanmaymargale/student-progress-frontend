import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="
          w-[90vw]            // almost full width on mobile
          sm:w-[600px]        // small screens
          md:w-[800px]        // medium/desktop screens
          max-h-[90vh]        // max height 90% of viewport
          overflow-y-auto     // scroll if content overflows
          rounded-lg          // rounded corners
          p-6                 // padding inside modal
          bg-white dark:bg-gray-900 // background color for light/dark mode
          border border-border // border to match your theme
        "
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;