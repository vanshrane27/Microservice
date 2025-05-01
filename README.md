# Traffic Log Microservice

A microservice designed to track and analyze website traffic, providing detailed insights into visitor information and geolocation data.

## Features

- **IP Address Tracking**: Logs and stores visitor IP addresses
- **Geolocation Data**: Automatically detects and stores visitor location information
- **Browser & Device Information**: Captures browser type, version, and device details
- **MongoDB Storage**: Real-time storage of traffic data in MongoDB
- **RESTful API**: Easy integration with other services through a well-defined API

## Technical Stack

### Backend
- **Node.js**: Runtime environment
- **TypeScript**: Programming language
- **Express.js**: Web framework
- **MongoDB**: Database for storing traffic data
- **Mongoose**: MongoDB object modeling for Node.js
- **geoip-lite**: IP geolocation library

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server with auto-reload
- **ts-node**: TypeScript execution environment

## API Endpoints

### Traffic Logging
- `POST /api/traffic/log`
  - Logs visitor traffic data
  - Returns detailed visitor information including geolocation

## Environment Variables

Create a `.env` file with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/traffic-log
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
traffic-log-microservice/
├── src/
│   ├── controllers/
│   │   └── trafficController.ts
│   ├── models/
│   │   └── trafficModel.ts
│   ├── services/
│   │   └── geoService.ts
│   ├── routes/
│   │   └── trafficRoutes.ts
│   ├── config/
│   │   └── config.ts
│   └── app.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

### Logging Traffic

```typescript
// Example API call to log traffic
fetch('http://localhost:3000/api/traffic/log', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## Data Storage

- **MongoDB**: Stores real-time traffic data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 