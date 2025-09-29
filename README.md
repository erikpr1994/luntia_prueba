# CSV Processing API

A Node.js/Express API for processing CSV files and storing data in PostgreSQL database.

## Features

- **CSV Processing**: Upload and process CSV files for volunteers, members, shifts, donations, and activities
- **Data Transformation**: Normalize dates, booleans, and numbers from various formats
- **PostgreSQL Database**: Store processed data with proper relationships
- **Docker Support**: Run with Docker Compose for easy setup
- **TypeScript**: Full type safety and modern development experience

## Quick Start

### Using Docker (Recommended)

1. **Start the services:**

   ```bash
   docker-compose up -d
   ```

2. **Check if services are running:**

   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f server
   ```

### Manual Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start PostgreSQL database:**

   ```bash
   docker-compose up -d postgres
   ```

3. **Start the server:**
   ```bash
   cd server
   pnpm dev
   ```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### CSV Upload Endpoints

- `POST /api/upload/voluntarios` - Upload volunteers CSV
- `POST /api/upload/socios` - Upload members CSV
- `POST /api/upload/turnos` - Upload shifts CSV
- `POST /api/upload/donaciones` - Upload donations CSV
- `POST /api/upload/actividades` - Upload activities CSV

### Statistics

- `GET /api/stats` - Get database statistics

## CSV Format

### Volunteers (voluntarios.csv)

```csv
id,entidad,nombre,alta,activo,rol
v1,Asociación A,Ana Ruiz,2024-02-10,true,Coordinadora
```

### Members (socios.csv)

```csv
id,entidad,nombre,alta,aportacion_mensual
s1,Asociación A,Laura Gómez,2023-12-01,15
```

### Shifts (turnos.csv)

```csv
id,voluntario_id,entidad,fecha,actividad,horas
t1,v1,Asociación A,2025-08-01,Acompañamiento,3
```

### Donations (donaciones.csv)

```csv
id,entidad,fecha,donante,importe
d1,Asociación A,2025-08-10,Fundación X,500
```

### Activities (actividades.csv)

```csv
id,entidad,nombre,fecha,participantes
a1,Asociación A,Jornada Hospital,2025-08-12,35
```

## Data Transformation

The API automatically handles:

- **Date formats**: YYYY-MM-DD, DD/MM/YYYY, YYYY/MM/DD
- **Boolean values**: true/false, TRUE/FALSE, 1/0, yes/no
- **Numbers**: Handles N/A, empty values, and NaN
- **Data validation**: Ensures data integrity

## Testing the API

### Using curl

1. **Upload a CSV file:**

   ```bash
   curl -X POST -F "csv=@server/sample-data/voluntarios.csv" http://localhost:3000/api/upload/voluntarios
   ```

2. **Check statistics:**
   ```bash
   curl http://localhost:3000/api/stats
   ```

### Using Postman

1. Create a POST request to `http://localhost:3000/api/upload/voluntarios`
2. Set body type to `form-data`
3. Add key `csv` with type `File`
4. Select your CSV file
5. Send the request

## Database Schema

The API creates the following tables:

- `voluntarios` - Volunteers data
- `socios` - Members data
- `turnos` - Shifts data
- `donaciones` - Donations data
- `actividades` - Activities data

All tables include proper relationships and indexes for optimal performance.

## Environment Variables

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=csv_processor
DB_USER=postgres
DB_PASSWORD=password
PORT=3000
```

## Development

- **Linting**: `pnpm lint`
- **Formatting**: `pnpm format`
- **Build**: `pnpm build`
- **Dev**: `pnpm dev`
