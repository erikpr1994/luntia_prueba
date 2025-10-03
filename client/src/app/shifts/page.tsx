"use client";

import { useCallback, useEffect, useState } from "react";
import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";
import styles from "../../components/ShiftsTable.module.css";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../components/StateComponents";
import { apiService, type Shift } from "../../lib/api";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getShifts();
      setShifts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const totalShifts = shifts.length;
  const totalHours = shifts.reduce(
    (sum, shift) => sum + parseFloat(shift.hours?.toString() || "0"),
    0,
  );
  const avgHoursPerShift = totalShifts > 0 ? totalHours / totalShifts : 0;
  const uniqueVolunteers = new Set(shifts.map((s) => s.volunteer_id)).size;

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
        title="Total Turnos"
        value={totalShifts}
        subtitle="Turnos registrados"
        icon="📅"
      />
      <KPICard
        title="Voluntarios Únicos"
        value={uniqueVolunteers}
        subtitle="Voluntarios que han trabajado"
        icon="👥"
      />
      <KPICard
        title="Horas Totales"
        value={totalHours.toLocaleString()}
        subtitle="Horas trabajadas"
        icon="⏰"
      />
      <KPICard
        title="Promedio por Turno"
        value={formatHoursMinutes(avgHoursPerShift)}
        subtitle="Horas promedio por turno"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className={styles.shiftsTable}>
      <thead>
        <tr>
          <th>Voluntario</th>
          <th>Organización</th>
          <th>Fecha</th>
          <th>Actividad</th>
          <th>Horas</th>
        </tr>
      </thead>
      <tbody>
        {shifts.map((shift) => (
          <tr key={shift.id}>
            <td>
              <span className={styles.volunteerName}>
                {shift.volunteer_name || `Voluntario ${shift.volunteer_id}`}
              </span>
            </td>
            <td>
              <span className={styles.organization}>{shift.organization}</span>
            </td>
            <td>
              <span className={styles.shiftDate}>
                {new Date(shift.date).toLocaleDateString("es-ES")}
              </span>
            </td>
            <td>
              <span className={styles.activity}>{shift.activity}</span>
            </td>
            <td>
              <span className={styles.hours}>
                {parseFloat(shift.hours?.toString() || "0").toLocaleString(
                  "es-ES",
                )}
                h
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const emptyState = (
    <EmptyState
      icon="📅"
      title="No hay turnos registrados"
      message="Sube un archivo CSV con datos de turnos para comenzar"
    />
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchShifts} />;
  }

  return (
    <DataPage
      title="Turnos"
      icon="📅"
      description="Gestión de turnos y horarios de voluntarios"
      dataType="shifts"
      stats={stats}
      dataTable={shifts.length > 0 ? dataTable : emptyState}
      emptyState={emptyState}
      onUploadComplete={fetchShifts}
    />
  );
}
