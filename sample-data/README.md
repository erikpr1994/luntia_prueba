# Sample CSV Data Files

This directory contains comprehensive sample CSV files for testing the Luntia application. Each file contains realistic, diverse data that will populate your dashboard with meaningful metrics and charts.

## 📁 Files Overview

### 1. **volunteers.csv** (60 volunteers)
- **Organizations**: Green Earth Foundation, Community Help Center, Food Bank Network
- **Roles**: Coordinators, Team Leaders, Volunteers
- **Status**: Mix of active and inactive volunteers
- **Join Dates**: Spanning from 2023 to 2024

### 2. **members.csv** (60 members)
- **Organizations**: Same three organizations as volunteers
- **Monthly Contributions**: Range from $25 to $100
- **Join Dates**: Distributed throughout 2023-2024

### 3. **shifts.csv** (135 shifts)
- **Date Range**: September 25 - October 2, 2025 (last week - recent data!)
- **Activities**: 
  - Green Earth Foundation: Tree Planting, Garden Maintenance, Community Cleanup, Environmental Education
  - Community Help Center: Food Distribution, Shelter Assistance, Community Outreach
  - Food Bank Network: Food Sorting, Food Distribution, Inventory Management
- **Hours**: 3.0 to 6.5 hours per shift
- **Volunteers**: All active volunteers from volunteers.csv

### 4. **donations.csv** (72 donations)
- **Date Range**: September 25 - October 2, 2025 (last week)
- **Amount Range**: $150 to $18,000
- **Donors**: Mix of corporations, foundations, individuals, and community groups
- **Organizations**: All three organizations receiving donations

### 5. **activities.csv** (48 activities)
- **Date Range**: September 25 - October 2, 2025 (last week)
- **Participant Range**: 12 to 80 participants per activity
- **Activity Types**: Workshops, events, programs, and community initiatives

## 🚀 How to Upload

### Step 1: Start the Application
```bash
# Start the server (if not already running)
cd server && pnpm dev

# Start the client (if not already running)
cd client && pnpm dev
```

### Step 2: Navigate to Each Data Type Page
1. **Volunteers**: Go to `/volunteers` page
2. **Members**: Go to `/members` page  
3. **Shifts**: Go to `/shifts` page
4. **Donations**: Go to `/donations` page
5. **Activities**: Go to `/activities` page

### Step 3: Upload CSV Files
1. Click the **"Subir CSV"** button on each page
2. Select the corresponding CSV file from this directory
3. Wait for the upload to complete
4. Check the success message

### Step 4: Verify Dashboard
1. Go back to the **Dashboard** (`/`)
2. Check that all KPI cards show updated numbers
3. Verify the **"Actividad de Voluntarios"** chart shows data
4. The chart should display volunteer activity from September 2024

## 📊 Expected Results

After uploading all files, you should see:

### Dashboard KPIs:
- **Active Volunteers**: ~45-50 (active volunteers from volunteers.csv)
- **Average Hours per Volunteer**: ~4-5 hours
- **Retention Rate**: Calculated based on active vs inactive volunteers
- **Economic Value**: Calculated from volunteer hours
- **Members**: 60 (from members.csv)

### Chart Data:
- **Line Chart**: Shows daily volunteer activity from the last 7 days (September 25 - October 2, 2025)
- **Blue Line**: Number of unique volunteers per day
- **Green Line**: Number of shifts completed per day
- **Data Points**: Shows recent activity for the past week
- **Recent Data**: All data is from the last week, making it current and relevant

## 🔧 Troubleshooting

### If uploads fail:
1. Check that the server is running on port 3000
2. Verify CSV file format matches the expected headers
3. Check browser console for error messages
4. Ensure database connection is working

### If dashboard shows no data:
1. Verify all CSV files were uploaded successfully
2. Check that shifts.csv was uploaded (required for chart data)
3. Refresh the dashboard page
4. Check server logs for any errors

## 📈 Data Relationships

The sample data is designed to be interconnected:
- **Volunteers** work **Shifts** for specific **Activities**
- **Members** provide monthly contributions to **Organizations**
- **Donations** support **Organizations** and their **Activities**
- **Activities** have **Participants** (volunteers and community members)

This creates realistic relationships that will populate meaningful metrics and charts in your dashboard.

## 🎯 Next Steps

After uploading the sample data:
1. Explore the dashboard to see all metrics populated
2. Test the chart functionality with real data
3. Try uploading additional CSV files with different data
4. Test the individual data type pages for data display
5. Verify that all navigation and modals work correctly

The sample data provides a solid foundation for testing and demonstrating the application's capabilities!
