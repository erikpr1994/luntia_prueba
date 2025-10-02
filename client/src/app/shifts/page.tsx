import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";

export default function ShiftsPage() {
  const stats = (
    <>
      <KPICard
        title="Total Turnos"
        value={156}
        subtitle="Turnos programados"
        icon="📅"
      />
      <KPICard
        title="Turnos Completados"
        value={142}
        subtitle="Turnos realizados"
        icon="✅"
      />
      <KPICard
        title="Horas Totales"
        value="1,136"
        subtitle="Horas trabajadas"
        icon="⏰"
      />
      <KPICard
        title="Eficiencia"
        value="91%"
        subtitle="Tasa de completado"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className="dataTable">
      <thead>
        <tr>
          <th>Voluntario</th>
          <th>Fecha</th>
          <th>Hora Inicio</th>
          <th>Hora Fin</th>
          <th>Actividad</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Juan Pérez</td>
          <td>2024-03-15</td>
          <td>09:00</td>
          <td>17:00</td>
          <td>Voluntariado general</td>
          <td>Completado</td>
        </tr>
        <tr>
          <td>María García</td>
          <td>2024-03-14</td>
          <td>14:00</td>
          <td>18:00</td>
          <td>Apoyo educativo</td>
          <td>Completado</td>
        </tr>
        <tr>
          <td>Carlos López</td>
          <td>2024-03-16</td>
          <td>10:00</td>
          <td>16:00</td>
          <td>Mantenimiento</td>
          <td>Programado</td>
        </tr>
      </tbody>
    </table>
  );

  const emptyState = (
    <div className="emptyState">
      <div className="emptyStateIcon">📅</div>
      <p className="emptyStateText">No hay turnos programados</p>
    </div>
  );

  return (
    <DataPage
      title="Turnos"
      icon="📅"
      description="Gestión de turnos y horarios de voluntarios"
      dataType="shifts"
      stats={stats}
      dataTable={dataTable}
      emptyState={emptyState}
    />
  );
}
