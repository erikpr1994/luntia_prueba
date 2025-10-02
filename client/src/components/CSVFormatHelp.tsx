"use client";

import { useState } from "react";
import styles from "./CSVFormatHelp.module.css";

interface CSVFormatHelpProps {
  dataType: string;
}

const FORMAT_INFO = {
  volunteers: {
    title: "Formato para Voluntarios",
    description: "El archivo CSV debe contener las siguientes columnas:",
    fields: [
      "nombre (obligatorio): Nombre del voluntario",
      "email (obligatorio): Correo electrónico",
      "telefono (opcional): Número de teléfono",
      "fecha_registro (opcional): Fecha de registro (YYYY-MM-DD)",
      "activo (opcional): true/false si está activo",
    ],
    sample:
      "nombre,email,telefono,fecha_registro,activo\nJuan Pérez,juan@email.com,+1234567890,2024-01-15,true",
  },
  members: {
    title: "Formato para Miembros",
    description: "El archivo CSV debe contener las siguientes columnas:",
    fields: [
      "nombre (obligatorio): Nombre del miembro",
      "email (obligatorio): Correo electrónico",
      "fecha_ingreso (opcional): Fecha de ingreso (YYYY-MM-DD)",
      "tipo_membresia (opcional): Tipo de membresía",
      "activo (opcional): true/false si está activo",
    ],
    sample:
      "nombre,email,fecha_ingreso,tipo_membresia,activo\nMaría García,maria@email.com,2024-01-10,premium,true",
  },
  shifts: {
    title: "Formato para Turnos",
    description: "El archivo CSV debe contener las siguientes columnas:",
    fields: [
      "voluntario_id (obligatorio): ID del voluntario",
      "fecha (obligatorio): Fecha del turno (YYYY-MM-DD)",
      "hora_inicio (obligatorio): Hora de inicio (HH:MM)",
      "hora_fin (obligatorio): Hora de fin (HH:MM)",
      "actividad (opcional): Descripción de la actividad",
      "completado (opcional): true/false si se completó",
    ],
    sample:
      "voluntario_id,fecha,hora_inicio,hora_fin,actividad,completado\n1,2024-01-20,09:00,17:00,Voluntariado general,true",
  },
  donations: {
    title: "Formato para Donaciones",
    description: "El archivo CSV debe contener las siguientes columnas:",
    fields: [
      "donante (obligatorio): Nombre del donante",
      "monto (obligatorio): Monto de la donación",
      "fecha (obligatorio): Fecha de la donación (YYYY-MM-DD)",
      "tipo (opcional): Tipo de donación",
      "comentarios (opcional): Comentarios adicionales",
    ],
    sample:
      "donante,monto,fecha,tipo,comentarios\nEmpresa ABC,5000.00,2024-01-18,corporativa,Donación para programa educativo",
  },
  activities: {
    title: "Formato para Actividades",
    description: "El archivo CSV debe contener las siguientes columnas:",
    fields: [
      "nombre (obligatorio): Nombre de la actividad",
      "descripcion (opcional): Descripción detallada",
      "fecha_inicio (obligatorio): Fecha de inicio (YYYY-MM-DD)",
      "fecha_fin (opcional): Fecha de fin (YYYY-MM-DD)",
      "ubicacion (opcional): Ubicación de la actividad",
      "participantes (opcional): Número de participantes",
    ],
    sample:
      "nombre,descripcion,fecha_inicio,fecha_fin,ubicacion,participantes\nCampaña de limpieza,Limpieza de playa local,2024-01-25,2024-01-25,Playa Central,25",
  },
};

export default function CSVFormatHelp({ dataType }: CSVFormatHelpProps) {
  const [showSample, setShowSample] = useState(false);

  const formatInfo = FORMAT_INFO[dataType as keyof typeof FORMAT_INFO];

  if (!formatInfo) {
    return null;
  }

  return (
    <div className={styles.helpContainer}>
      <h4 className={styles.helpTitle}>📋 {formatInfo.title}</h4>
      <div className={styles.helpContent}>
        <p>{formatInfo.description}</p>
        <ul className={styles.helpList}>
          {formatInfo.fields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
        <p>
          <button
            type="button"
            onClick={() => setShowSample(!showSample)}
            className={styles.sampleLink}
          >
            {showSample ? "Ocultar" : "Ver"} ejemplo de formato
          </button>
        </p>
        {showSample && (
          <pre
            style={{
              background: "#f1f5f9",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "12px",
              overflow: "auto",
              margin: "8px 0 0 0",
            }}
          >
            {formatInfo.sample}
          </pre>
        )}
      </div>
    </div>
  );
}
