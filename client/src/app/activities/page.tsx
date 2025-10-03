"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "../../components/ActivitiesTable.module.css";
import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../components/StateComponents";
import { type Activity, apiService } from "../../lib/api";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getActivities();
      setActivities(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const totalActivities = activities.length;
  const totalParticipants = activities.reduce(
    (sum, activity) => sum + activity.participants,
    0,
  );
  const avgParticipants =
    totalActivities > 0 ? Math.round(totalParticipants / totalActivities) : 0;

  // Get recent activities (last 7 days)
  const recentActivities = activities.filter((a) => {
    const activityDate = new Date(a.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return activityDate >= sevenDaysAgo;
  });

  const stats = (
    <>
      <KPICard
        title="Total Actividades"
        value={totalActivities}
        subtitle="Actividades organizadas"
        icon="🎯"
      />
      <KPICard
        title="Esta Semana"
        value={recentActivities.length}
        subtitle="Actividades recientes"
        icon="📅"
      />
      <KPICard
        title="Total Participantes"
        value={totalParticipants.toLocaleString()}
        subtitle="Participantes totales"
        icon="👥"
      />
      <KPICard
        title="Promedio Participantes"
        value={avgParticipants.toString()}
        subtitle="Por actividad"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className={styles.activitiesTable}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Organización</th>
          <th>Fecha</th>
          <th>Participantes</th>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity.id}>
            <td>
              <span className={styles.activityName}>{activity.name}</span>
            </td>
            <td>
              <span className={styles.organization}>
                {activity.organization}
              </span>
            </td>
            <td>
              <span className={styles.activityDate}>
                {new Date(activity.date).toLocaleDateString("es-ES")}
              </span>
            </td>
            <td>
              <span className={styles.participants}>
                {activity.participants}
              </span>
            </td>
            <td>
              <span
                className={`${styles.activityType} ${
                  activity.participants >= 50 ? styles.large : styles.standard
                }`}
              >
                {activity.participants >= 50 ? "Gran Evento" : "Estándar"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const emptyState = (
    <EmptyState
      icon="🎯"
      title="No hay actividades registradas"
      message="Sube un archivo CSV con datos de actividades para comenzar"
    />
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchActivities} />;
  }

  return (
    <DataPage
      title="Actividades"
      icon="🎯"
      description="Gestión de actividades y eventos"
      dataType="activities"
      stats={stats}
      dataTable={activities.length > 0 ? dataTable : emptyState}
      emptyState={emptyState}
      onUploadComplete={fetchActivities}
    />
  );
}
