import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";

export default function VolunteersPage() {
  // Mock data - in a real app, this would come from API calls
  const stats = (
    <>
      <KPICard
        title="Total Voluntarios"
        value={45}
        subtitle="Voluntarios registrados"
        icon="👥"
      />
      <KPICard
        title="Voluntarios Activos"
        value={32}
        subtitle="Actualmente activos"
        icon="✅"
      />
      <KPICard
        title="Horas Totales"
        value="1,240"
        subtitle="Horas trabajadas"
        icon="⏰"
      />
      <KPICard
        title="Promedio Horas"
        value="38.7"
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
          <th>Email</th>
          <th>Teléfono</th>
          <th>Fecha Registro</th>
          <th>Estado</th>
          <th>Horas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Juan Pérez</td>
          <td>juan@email.com</td>
          <td>+1234567890</td>
          <td>2024-01-15</td>
          <td>Activo</td>
          <td>45</td>
        </tr>
        <tr>
          <td>María García</td>
          <td>maria@email.com</td>
          <td>+1234567891</td>
          <td>2024-01-20</td>
          <td>Activo</td>
          <td>38</td>
        </tr>
        <tr>
          <td>Carlos López</td>
          <td>carlos@email.com</td>
          <td>+1234567892</td>
          <td>2024-02-01</td>
          <td>Inactivo</td>
          <td>12</td>
        </tr>
      </tbody>
    </table>
  );

  const emptyState = (
    <div className="emptyState">
      <div className="emptyStateIcon">👥</div>
      <p className="emptyStateText">No hay voluntarios registrados</p>
    </div>
  );

  return (
    <DataPage
      title="Voluntarios"
      icon="👥"
      description="Gestión de voluntarios y sus actividades"
      dataType="volunteers"
      stats={stats}
      dataTable={dataTable}
      emptyState={emptyState}
    />
  );
}
