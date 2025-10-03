"use client";

import { useState } from "react";
import CSVUpload from "./CSVUpload";
import Modal from "./Modal";

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: "volunteers" | "members" | "shifts" | "donations" | "activities";
  onUploadComplete?: () => void;
}

const DATA_TYPE_LABELS = {
  volunteers: "Voluntarios",
  members: "Miembros",
  shifts: "Turnos",
  donations: "Donaciones",
  activities: "Actividades",
};

export default function CSVUploadModal({
  isOpen,
  onClose,
  dataType,
  onUploadComplete,
}: CSVUploadModalProps) {
  const [_uploadComplete, setUploadComplete] = useState(false);

  const handleUploadComplete = () => {
    setUploadComplete(true);
    if (onUploadComplete) {
      onUploadComplete();
    }

    // Close modal after a short delay to show success message
    setTimeout(() => {
      onClose();
      setUploadComplete(false);
    }, 2000);
  };

  const handleClose = () => {
    setUploadComplete(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Subir ${DATA_TYPE_LABELS[dataType]} - CSV`}
      size="large"
    >
      <div style={{ padding: "0" }}>
        <CSVUpload
          dataType={dataType}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </Modal>
  );
}
