"use client";

import { useCallback, useEffect, useState } from "react";
import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../components/StateComponents";
import { apiService, type Member } from "../../lib/api";
import styles from "../../components/MembersTable.module.css";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMembers();
      setMembers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const totalMembers = members.length;
  const premiumMembers = members.filter(
    (m) => parseFloat(m.monthly_contribution?.toString() || '0') >= 75
  ).length;
  const totalContributions = members.reduce(
    (sum, m) => sum + parseFloat(m.monthly_contribution?.toString() || '0'),
    0
  );
  const avgContribution =
    totalMembers > 0 ? totalContributions / totalMembers : 0;

  const stats = (
    <>
      <KPICard
        title="Total Socios"
        value={totalMembers}
        subtitle="Socios registrados"
        icon="👤"
      />
      <KPICard
        title="Socios Premium"
        value={premiumMembers}
        subtitle="Membresías premium"
        icon="⭐"
      />
      <KPICard
        title="Contribución Total"
        value={totalContributions.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
        subtitle="Contribución mensual total"
        icon="💰"
      />
      <KPICard
        title="Contribución Promedio"
        value={avgContribution.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
        subtitle="Contribución promedio por socio"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className={styles.membersTable}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Organización</th>
          <th>Fecha Ingreso</th>
          <th>Contribución Mensual</th>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>
              <span className={styles.memberName}>{member.name}</span>
            </td>
            <td>
              <span className={styles.organization}>{member.organization}</span>
            </td>
            <td>
              <span className={styles.joinDate}>
                {new Date(member.join_date).toLocaleDateString("es-ES")}
              </span>
            </td>
            <td>
              <span className={styles.contribution}>
                {parseFloat(member.monthly_contribution?.toString() || '0').toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </td>
            <td>
              <span
                className={`${styles.membership} ${
                  parseFloat(member.monthly_contribution?.toString() || '0') >= 75
                    ? styles.premium
                    : styles.basic
                }`}
              >
                {parseFloat(member.monthly_contribution?.toString() || '0') >= 75 ? "Premium" : "Básico"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const emptyState = (
    <EmptyState
      icon="👤"
      title="No hay socios registrados"
      message="Sube un archivo CSV con datos de socios para comenzar"
    />
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchMembers} />;
  }

  return (
    <DataPage
      title="Socios"
      icon="👤"
      description="Gestión de Socios y suscripciones"
      dataType="members"
      stats={stats}
      dataTable={members.length > 0 ? dataTable : emptyState}
      emptyState={emptyState}
      onUploadComplete={fetchMembers}
    />
  );
}
