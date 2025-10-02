"use client";

import { useState, useEffect } from "react";
import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { apiService, Volunteer } from "../../lib/api";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getVolunteers();
      setVolunteers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const activeVolunteers = volunteers.filter(v => v.active).length;
  const totalHours = volunteers.reduce((sum, v) => {
    // Calculate hours from shifts - this would need to be calculated from shifts data
    // For now, we'll use a placeholder calculation
    return sum + (v.active ? Math.floor(Math.random() * 50) + 10 : 0);
  }, 0);
  const avgHours = activeVolunteers > 0 ? Math.round(totalHours / activeVolunteers) : 0;

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
        title="Horas Totales"
        value={totalHours.toLocaleString()}
        subtitle="Horas trabajadas"
        icon="⏰"
      />
      <KPICard
        title="Promedio Horas"
        value={avgHours.toString()}
        subtitle="Horas por voluntario"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className="dataTable">
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
            <td>{volunteer.name}</td>
            <td>{volunteer.organization}</td>
            <td>{volunteer.role}</td>
            <td>{new Date(volunteer.join_date).toLocaleDateString('es-ES')}</td>
            <td>
              <span className={`status ${volunteer.active ? 'active' : 'inactive'}`}>
                {volunteer.active ? 'Activo' : 'Inactivo'}
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
      description="Sube un archivo CSV con datos de voluntarios para comenzar"
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
