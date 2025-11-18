# 🚦 Traffic Violation Dashboard

A modern web dashboard for analyzing traffic violations and managing enforcement activities.

## 🌟 Features

- **📊 Real-time Analytics** - View traffic violation statistics and trends
- **🗺️ Hotspot Detection** - Identify high-violation areas with geographic analysis  
- **👮 Repeat Offender Tracking** - Monitor frequent violators
- **📱 SMS Alert System** - Send notifications to vehicle owners
- **📈 Data Visualization** - Interactive charts and graphs
- **🎯 Clean Interface** - Modern, responsive design
- Repeat offender identification
- Time-based trend analysis
- Comprehensive filtering and pagination

### Frontend (Node.js + Express)
- Modern responsive dashboard
- Interactive data visualizations with Chart.js
- Real-time statistics cards
- Advanced filtering and search
- Pagination support
- Bootstrap-based responsive UI

## Tech Stack

### Backend
- **FastAPI**: High-performance web framework
- **Pandas**: Data manipulation and analysis
- **Scikit-learn**: Machine learning for clustering
- **SQLAlchemy**: Database operations
- **Uvicorn**: ASGI server

### Frontend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **EJS**: Templating engine
- **Chart.js**: Data visualization
- **Bootstrap 5**: UI framework
- **Axios**: HTTP client

## Project Structure

```
traffic-violation-dashboard/
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── main.py             # FastAPI application
│   │   ├── services/
│   │   │   └── data_service.py # Data processing service
│   │   └── routes/             # API routes
│   ├── data/                   # Dataset storage
│   └── requirements.txt        # Python dependencies
├── frontend/                    # Node.js frontend
│   ├── public/                 # Static files
│   │   ├── css/
│   │   └── js/
│   ├── routes/                 # Express routes
│   ├── services/               # API service layer
│   ├── views/                  # EJS templates
│   ├── server.js               # Express application
│   └── package.json            # Node.js dependencies
└── Indian_Traffic_Violations.csv # Dataset (4,000+ records)
```

## Dataset

The application uses a comprehensive dataset of Indian traffic violations containing:
- 4,000+ violation records
- Location-based data
- Vehicle and driver information
- Fine amounts and violation types
- Time-based analytics
- Weather and road conditions

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend server:
```bash
npm start
```

The frontend application will be available at `http://localhost:3000`

## API Endpoints

### Core Endpoints
- `GET /api/violations/` - List violations with filtering
- `GET /api/violations/stats` - Statistics overview
- `GET /api/violations/hotspots` - Hotspot analysis
- `GET /api/violations/repeat-offenders` - Repeat offender data
- `GET /api/violations/trends` - Time-based trends

### Frontend Routes
- `GET /` - Dashboard with statistics and charts
- `GET /violations` - Violations list with filtering
- `GET /analytics` - Analytics overview
- `GET /analytics/hotspots` - Detailed hotspots
- `GET /analytics/trends` - Trend analysis
- `GET /analytics/repeat-offenders` - Offender analysis

## Features Overview

### Dashboard
- Real-time statistics cards
- Interactive charts (pie, bar, line)
- Top violations and locations
- Hourly violation patterns
- Monthly trends visualization

### Violations Management
- Paginated violation list
- Advanced filtering (type, vehicle, location, date range)
- CSV export functionality
- Individual violation details

### Analytics & Insights
- Hotspot detection and mapping
- Repeat offender identification
- Time-series trend analysis
- Statistical breakdowns by various dimensions

## Development

### Running in Development Mode

Backend:
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm run dev  # If nodemon is configured
# or
npm start
```

### API Documentation
- Backend API docs: `http://localhost:8000/docs` (Swagger UI)
- Alternative docs: `http://localhost:8000/redoc`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please create an issue in the repository or contact the development team.
