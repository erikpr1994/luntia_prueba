"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiService } from "../lib/api";
import CSVFormatHelp from "./CSVFormatHelp";
import styles from "./CSVUpload.module.css";

interface UploadResult {
  message: string;
  processed: number;
  errors: number;
}

interface CSVUploadProps {
  dataType?: DataType;
  onUploadComplete?: () => void;
}

type DataType =
  | "volunteers"
  | "members"
  | "shifts"
  | "donations"
  | "activities";

const DATA_TYPE_OPTIONS: {
  value: DataType;
  label: string;
  description: string;
}[] = [
  {
    value: "volunteers",
    label: "Voluntarios",
    description: "Datos de voluntarios",
  },
  { value: "members", label: "Miembros", description: "Datos de miembros" },
  { value: "shifts", label: "Turnos", description: "Datos de turnos" },
  {
    value: "donations",
    label: "Donaciones",
    description: "Datos de donaciones",
  },
  {
    value: "activities",
    label: "Actividades",
    description: "Datos de actividades",
  },
];

export default function CSVUpload({
  dataType: propDataType,
  onUploadComplete,
}: CSVUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>(
    propDataType || "volunteers",
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv"),
    );

    if (csvFile) {
      setSelectedFile(csvFile);
      setError(null);
      setUploadResult(null);
    } else {
      setError("Por favor selecciona un archivo CSV válido");
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setError(null);
        setUploadResult(null);
      }
    },
    [],
  );

  const handleDataTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDataType(e.target.value as DataType);
    },
    [],
  );

  // Update dataType when prop changes
  useEffect(() => {
    if (propDataType) {
      setDataType(propDataType);
    }
  }, [propDataType]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      let result: UploadResult;

      switch (dataType) {
        case "volunteers":
          result = await apiService.uploadVolunteersCSV(selectedFile);
          break;
        case "members":
          result = await apiService.uploadMembersCSV(selectedFile);
          break;
        case "shifts":
          result = await apiService.uploadShiftsCSV(selectedFile);
          break;
        case "donations":
          result = await apiService.uploadDonationsCSV(selectedFile);
          break;
        case "activities":
          result = await apiService.uploadActivitiesCSV(selectedFile);
          break;
        default:
          throw new Error("Tipo de datos no válido");
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);

      // Call callback to refresh dashboard data
      if (onUploadComplete) {
        onUploadComplete();
      }

      // Clear file after successful upload
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadResult(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al subir el archivo",
      );
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, dataType, onUploadComplete]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setUploadResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className={styles.uploadContainer}>
      <h3 className={styles.uploadTitle}>Cargar Datos CSV</h3>
      <p className={styles.uploadDescription}>
        Sube archivos CSV para importar datos de voluntarios, miembros, turnos,
        donaciones o actividades.
      </p>

      {!propDataType && (
        <div className={styles.dataTypeSelector}>
          <label htmlFor="dataType" className={styles.selectorLabel}>
            Tipo de datos
          </label>
          <select
            id="dataType"
            value={dataType}
            onChange={handleDataTypeChange}
            className={styles.selector}
          >
            {DATA_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        className={`${styles.dropZone} ${isDragging ? styles.dragActive : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <div className={styles.dropZoneIcon}>📁</div>
        <p className={styles.dropZoneText}>
          {selectedFile
            ? "Archivo seleccionado"
            : "Arrastra un archivo CSV aquí"}
        </p>
        <p className={styles.dropZoneSubtext}>
          o haz clic para seleccionar un archivo
        </p>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileSelect}
        className={styles.fileInput}
      />

      {selectedFile && (
        <div className={styles.fileInfo}>
          <div className={styles.fileIcon}>📄</div>
          <div className={styles.fileDetails}>
            <p className={styles.fileName}>{selectedFile.name}</p>
            <p className={styles.fileSize}>
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className={styles.removeButton}
            disabled={isUploading}
          >
            ✕
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className={styles.uploadButton}
      >
        {isUploading ? "Subiendo..." : "Subir Archivo"}
      </button>

      {isUploading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className={styles.progressText}>{uploadProgress}% completado</p>
        </div>
      )}

      {uploadResult && (
        <div className={`${styles.resultContainer} ${styles.resultSuccess}`}>
          <h4 className={styles.resultTitle}>✅ Subida exitosa</h4>
          <p className={styles.resultMessage}>
            {uploadResult.message} - {uploadResult.processed} registros
            procesados
            {uploadResult.errors > 0 &&
              `, ${uploadResult.errors} errores encontrados`}
          </p>
        </div>
      )}

      {error && (
        <div className={`${styles.resultContainer} ${styles.resultError}`}>
          <h4 className={styles.resultTitle}>❌ Error</h4>
          <p className={styles.resultMessage}>{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowHelp(!showHelp)}
        className={styles.toggleHelpButton}
      >
        {showHelp ? "Ocultar" : "Mostrar"} información de formato
      </button>

      {showHelp && <CSVFormatHelp dataType={dataType} />}
    </div>
  );
}
