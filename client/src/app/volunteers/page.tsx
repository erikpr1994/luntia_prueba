"use client";

import { useState, useEffect } from "react";
import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/StateComponents";
import { apiService, Volunteer, BasicMetrics } from "../../lib/api";
import styles from "../../components/VolunteersTable.module.css";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [basicMetrics, setBasicMetrics] = useState<BasicMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [volunteersResponse, metricsResponse] = await Promise.all([
        apiService.getVolunteers(),
        apiService.getBasicMetrics(),
      ]);
      setVolunteers(volunteersResponse.data);
      setBasicMetrics(metricsResponse.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const activeVolunteers = volunteers.filter((v) => v.active).length;
  const avgHours = basicMetrics?.avgHoursPerVolunteer || 0;

  // Format hours and minutes for display
  const formatHoursMinutes = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (wholeHours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}min`;
    }
  };

  const stats = (
    <>
      <KPICard
        title="Total Voluntarios"
        value={volunteers.length}
        subtitle="Voluntarios registrados"
        icon="👥"
      />
      <KPICard
        title="Voluntarios Activos"
        value={activeVolunteers}
        subtitle="Actualmente activos"
        icon="✅"
      />
      <KPICard
        title="Promedio Horas"
        value={formatHoursMinutes(avgHours)}
        subtitle="Horas promedio por voluntario"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className={styles.volunteersTable}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Organización</th>
          <th>Rol</th>
          <th>Fecha Registro</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {volunteers.map((volunteer) => (
          <tr key={volunteer.id}>
            <td>
              <span className={styles.volunteerName}>{volunteer.name}</span>
            </td>
            <td>
              <span className={styles.organization}>
                {volunteer.organization}
              </span>
            </td>
            <td>
              <span className={styles.role}>{volunteer.role}</span>
            </td>
            <td>
              <span className={styles.joinDate}>
                {new Date(volunteer.join_date).toLocaleDateString("es-ES")}
              </span>
            </td>
            <td>
              <span
                className={`${styles.status} ${
                  volunteer.active ? styles.active : styles.inactive
                }`}
              >
                {volunteer.active ? "Activo" : "Inactivo"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const emptyState = (
    <EmptyState
      icon="👥"
      title="No hay voluntarios registrados"
      message="Sube un archivo CSV con datos de voluntarios para comenzar"
    />
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchVolunteers} />;
  }

  return (
    <DataPage
      title="Voluntarios"
      icon="👥"
      description="Gestión de voluntarios y sus actividades"
      dataType="volunteers"
      stats={stats}
      dataTable={volunteers.length > 0 ? dataTable : emptyState}
      emptyState={emptyState}
      onUploadComplete={fetchVolunteers}
    />
  );
}
