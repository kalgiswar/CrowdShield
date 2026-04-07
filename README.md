# Crowd-Shield

Crowd-Shield is a comprehensive crowd management system designed to enhance safety and efficiency during large gatherings. It combines real-time crowd density analysis, predictive modeling, and emergency response coordination to ensure public safety.

## Features

- **Real-Time Crowd Monitoring**: Utilizes computer vision to detect and track crowd density in various zones.
- **Predictive Analytics**: Employs machine learning models to forecast crowd behavior and potential congestion points.
- **Emergency Response**: Integrated alert system to notify authorities and deploy resources when crowd density exceeds safe limits.
- **Zone Management**: Divide large areas into manageable zones for better monitoring and control.
- **Historical Analysis**: Track crowd patterns over time to optimize event planning.

## Tech Stack

- **Frontend**: React, Redux Toolkit, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI/ML**: TensorFlow.js, Scikit-learn
- **Real-Time Communication**: Socket.io
- **Mapping**: Leaflet, Mapbox

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Python (for ML model training)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

### Dashboard

The main dashboard provides a real-time overview of crowd density across different zones. You can view:
- Current crowd levels
- Density heatmaps
- Historical trends
- Alert notifications

### Zone Management

1. Go to the "Zones" section in the sidebar.
2. Click "Add Zone" to create a new monitoring zone.
3. Draw the zone boundaries on the map.
4. Configure alert thresholds for the zone.

### Alerts

Alerts are automatically triggered when crowd density exceeds the configured thresholds. You can:
- View active alerts on the map
- Acknowledge alerts
- View alert history
- Configure notification preferences

## Development

### Adding a New Zone

1. Draw the zone on the map in the "Zones" section.
2. Set the density thresholds (e.g., Green: < 50 people, Yellow: 50-100, Red: > 100).
3. Save the zone.

### Training the ML Model

1. Prepare your training data (images of different crowd densities).
2. Run the training script:
   ```bash
   cd backend/ml_models
   python train_model.py
   ```
3. The trained model will be saved automatically.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.