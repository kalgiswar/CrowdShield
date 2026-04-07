# CrowdShield

CrowdShield is a real-time safety monitoring system utilizing AI to detect incidents (Fire, Violence, Stampede) from camera feeds. It employs a microservices architecture to handle detection, verification, storage, and user alerts.

## Project Structure

- `backend/session`: Central API for session management and persistence (Port 8002).
- `backend/livestream`: WebSocket relay for low-latency video streaming (Port 8000).
- `backend/messenger`: WhatsApp notification automation service (Port 8003).
- `crowd_shield.db`: SQLite database for storing incident data.

## Features

- **Microservice Architecture**: Decoupled services for session management, streaming, and messaging.
- **AI-Powered Detection**: Integration with Vision Models for real-time threat detection.
- **Automated Alerts**: Direct notifications via WhatsApp on incident approval.
- **Persistent Storage**: Robust session tracking using SQLite.

## Installation

### Prerequisites

- Python 3.9 or higher
- [Playwright](https://playwright.dev/python/docs/intro) (for Messenger service)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kalgiswar/CrowdShield.git
   cd CrowdShield
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```

3. **Configure Environment**:
   Check `.env.example` in each service folder and create your `.env` files if necessary.

## Running the Services

You can start the backend services using the provided startup script:

### Windows (PowerShell):
```powershell
./start_missing_services.ps1
```

### Manual Start:
- **Session Service**: `python backend/session/main.py`
- **Livestream Service**: `python backend/livestream/main.py`
- **Messenger Service**: `python backend/messenger/main.py`

## Architecture

For a detailed technical overview, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

