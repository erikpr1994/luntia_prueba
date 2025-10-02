"use client";

import { useState, useEffect } from "react";
import { apiService, DashboardMetrics, EngagementMetrics, ImpactMetrics, HealthMetrics } from "../lib/api";
import { LoadingState, ErrorState, EmptyState } from "./StateComponents";
import styles from "./Dashboard.module.css";

interface AdvancedDashboardProps {
  organization?: string;
}

export default function AdvancedDashboard({ organization }: AdvancedDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDashboardMetrics(organization);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organization]);

  if (loading) {
    return <LoadingState message="Cargando métricas avanzadas..." />;
  }

  if (error) {
    return <ErrorState onRetry={fetchData} />;
  }

  if (!metrics) {
    return (
      <EmptyState
        title="Sin datos"
        message="No se pudieron cargar las métricas avanzadas"
      />
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Dashboard Avanzado {organization ? `- ${organization}` : "General"}
        </h1>
        <p className={styles.subtitle}>
          Métricas de impacto, engagement y salud del programa
        </p>
      </header>

      {/* Engagement Metrics */}
      <section className={styles.metricsSection}>
        <h2 className={styles.sectionTitle}>📈 Engagement & Retención</h2>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.engagement.retentionRate}%</div>
            <div className={styles.kpiLabel}>Tasa de Retención</div>
            <div className={styles.kpiSubtext}>Voluntarios activos últimos 3 meses</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.engagement.avgHoursPerVolunteer}h</div>
            <div className={styles.kpiLabel}>Promedio Horas/Voluntario</div>
            <div className={styles.kpiSubtext}>Contribución promedio por persona</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.engagement.topPerformers.length}</div>
            <div className={styles.kpiLabel}>Top Performers</div>
            <div className={styles.kpiSubtext}>Voluntarios destacados identificados</div>
          </div>
        </div>
        
        {metrics.engagement.topPerformers.length > 0 && (
          <div className={styles.topPerformers}>
            <h3>🏆 Top Performers</h3>
            <div className={styles.performersList}>
              {metrics.engagement.topPerformers.map((performer, index) => (
                <div key={index} className={styles.performerCard}>
                  <div className={styles.performerName}>{performer.name}</div>
                  <div className={styles.performerRole}>{performer.role}</div>
                  <div className={styles.performerStats}>
                    {performer.total_hours}h • {performer.shift_count} turnos
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Impact Metrics */}
      <section className={styles.metricsSection}>
        <h2 className={styles.sectionTitle}>💡 Impacto & Eficiencia</h2>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>${metrics.impact.economicValue.toLocaleString()}</div>
            <div className={styles.kpiLabel}>Valor Económico</div>
            <div className={styles.kpiSubtext}>Valor del trabajo voluntario ($15/h)</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.impact.contributingVolunteers}</div>
            <div className={styles.kpiLabel}>Voluntarios Contribuyendo</div>
            <div className={styles.kpiSubtext}>Activos en turnos recientes</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.impact.activityEfficiency.avgParticipants.toFixed(1)}</div>
            <div className={styles.kpiLabel}>Participantes/Actividad</div>
            <div className={styles.kpiSubtext}>Eficiencia de actividades</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.impact.resourceUtilization.hoursThisMonth.toFixed(1)}h</div>
            <div className={styles.kpiLabel}>Horas Este Mes</div>
            <div className={styles.kpiSubtext}>Actividad del mes actual</div>
          </div>
        </div>
      </section>

      {/* Health Metrics */}
      <section className={styles.metricsSection}>
        <h2 className={styles.sectionTitle}>🏥 Salud del Programa</h2>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.health.volunteerHealth.active}</div>
            <div className={styles.kpiLabel}>Activos</div>
            <div className={styles.kpiSubtext}>Últimos 30 días</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.health.volunteerHealth.atRisk}</div>
            <div className={styles.kpiLabel}>En Riesgo</div>
            <div className={styles.kpiSubtext}>Últimos 90 días</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.health.volunteerHealth.inactive}</div>
            <div className={styles.kpiLabel}>Inactivos</div>
            <div className={styles.kpiSubtext}>Más de 90 días</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.health.sustainability.newVolunteers6m}</div>
            <div className={styles.kpiLabel}>Nuevos (6m)</div>
            <div className={styles.kpiSubtext}>Reclutamiento reciente</div>
          </div>
        </div>

        {/* Risk Indicators */}
        {(metrics.health.riskIndicators.staleShifts > 0 || 
          metrics.health.riskIndicators.staleDonations > 0 || 
          metrics.health.riskIndicators.staleActivities > 0) && (
          <div className={styles.riskIndicators}>
            <h3>⚠️ Indicadores de Riesgo</h3>
            <div className={styles.riskGrid}>
              {metrics.health.riskIndicators.staleShifts > 0 && (
                <div className={styles.riskCard}>
                  <div className={styles.riskValue}>{metrics.health.riskIndicators.staleShifts}</div>
                  <div className={styles.riskLabel}>Turnos Antiguos</div>
                  <div className={styles.riskSubtext}>Más de 90 días</div>
                </div>
              )}
              {metrics.health.riskIndicators.staleDonations > 0 && (
                <div className={styles.riskCard}>
                  <div className={styles.riskValue}>{metrics.health.riskIndicators.staleDonations}</div>
                  <div className={styles.riskLabel}>Donaciones Antiguas</div>
                  <div className={styles.riskSubtext}>Más de 180 días</div>
                </div>
              )}
              {metrics.health.riskIndicators.staleActivities > 0 && (
                <div className={styles.riskCard}>
                  <div className={styles.riskValue}>{metrics.health.riskIndicators.staleActivities}</div>
                  <div className={styles.riskLabel}>Actividades Antiguas</div>
                  <div className={styles.riskSubtext}>Más de 60 días</div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Sustainability Metrics */}
      <section className={styles.metricsSection}>
        <h2 className={styles.sectionTitle}>🌱 Sostenibilidad</h2>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>${metrics.health.sustainability.totalDonations.toLocaleString()}</div>
            <div className={styles.kpiLabel}>Total Donaciones</div>
            <div className={styles.kpiSubtext}>Recaudación histórica</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>${metrics.health.sustainability.avgDonationAmount.toFixed(0)}</div>
            <div className={styles.kpiLabel}>Donación Promedio</div>
            <div className={styles.kpiSubtext}>Valor promedio por donación</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{metrics.health.sustainability.newVolunteers12m}</div>
            <div className={styles.kpiLabel}>Nuevos (12m)</div>
            <div className={styles.kpiSubtext}>Crecimiento anual</div>
          </div>
        </div>
      </section>
    </div>
  );
}
