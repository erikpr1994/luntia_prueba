import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";

export default function MembersPage() {
  const stats = (
    <>
      <KPICard
        title="Total Miembros"
        value={128}
        subtitle="Miembros registrados"
        icon="👤"
      />
      <KPICard
        title="Miembros Activos"
        value={95}
        subtitle="Actualmente activos"
        icon="✅"
      />
      <KPICard
        title="Premium"
        value={32}
        subtitle="Membresías premium"
        icon="⭐"
      />
      <KPICard
        title="Renovaciones"
        value="85%"
        subtitle="Tasa de renovación"
        icon="🔄"
      />
    </>
  );

  const dataTable = (
    <table className="dataTable">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Tipo</th>
          <th>Fecha Ingreso</th>
          <th>Estado</th>
          <th>Última Actividad</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ana Martínez</td>
          <td>ana@email.com</td>
          <td>Premium</td>
          <td>2024-01-10</td>
          <td>Activo</td>
          <td>2024-03-15</td>
        </tr>
        <tr>
          <td>Roberto Silva</td>
          <td>roberto@email.com</td>
          <td>Básico</td>
          <td>2024-01-25</td>
          <td>Activo</td>
          <td>2024-03-12</td>
        </tr>
        <tr>
          <td>Laura Rodríguez</td>
          <td>laura@email.com</td>
          <td>Premium</td>
          <td>2024-02-05</td>
          <td>Activo</td>
          <td>2024-03-10</td>
        </tr>
      </tbody>
    </table>
  );

  const emptyState = (
    <div className="emptyState">
      <div className="emptyStateIcon">👤</div>
      <p className="emptyStateText">No hay miembros registrados</p>
    </div>
  );

  return (
    <DataPage
      title="Miembros"
      icon="👤"
      description="Gestión de miembros y suscripciones"
      dataType="members"
      stats={stats}
      dataTable={dataTable}
      emptyState={emptyState}
    />
  );
}
