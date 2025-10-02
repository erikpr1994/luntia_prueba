"use client";

import { useState, useEffect } from "react";
import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/StateComponents";
import { apiService, Shift } from "../../lib/api";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = async () => {
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
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const totalShifts = shifts.length;
  const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0);
  const avgHoursPerShift =
    totalShifts > 0 ? Math.round((totalHours / totalShifts) * 10) / 10 : 0;
  const uniqueVolunteers = new Set(shifts.map((s) => s.volunteer_id)).size;

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
        value={avgHoursPerShift.toString()}
        subtitle="Horas promedio por turno"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className="dataTable">
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
              {shift.volunteer_name || `Voluntario ${shift.volunteer_id}`}
            </td>
            <td>{shift.organization}</td>
            <td>{new Date(shift.date).toLocaleDateString("es-ES")}</td>
            <td>{shift.activity}</td>
            <td>{shift.hours}h</td>
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
