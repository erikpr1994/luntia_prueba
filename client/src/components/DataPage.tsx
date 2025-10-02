"use client";

import { useState } from "react";
import CSVUploadModal from "./CSVUploadModal";
import styles from "./DataPage.module.css";

interface DataPageProps {
  title: string;
  icon: string;
  description: string;
  dataType: "volunteers" | "members" | "shifts" | "donations" | "activities";
  stats?: React.ReactNode;
  dataTable?: React.ReactNode;
  emptyState?: React.ReactNode;
}

export default function DataPage({
  title,
  icon,
  description,
  dataType,
  stats,
  dataTable,
  emptyState,
}: DataPageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadComplete = () => {
    // This will be handled by each page component to refresh data
    console.log("Upload completed for", dataType);
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <span className={styles.sectionIcon}>{icon}</span>
          {title}
        </h1>
        <p className={styles.pageSubtitle}>{description}</p>
      </header>

      <div className={styles.pageActions}>
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className={styles.uploadButton}
        >
          <span className={styles.uploadButtonIcon}>📁</span>
          Subir CSV
        </button>
      </div>

      {stats && <div className={styles.statsGrid}>{stats}</div>}

      <div className={styles.dataSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📋</span>
          Lista de {title}
        </h2>
        {dataTable || emptyState}
      </div>

      <CSVUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        dataType={dataType}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
