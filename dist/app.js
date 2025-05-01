"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const trafficLog_routes_1 = require("./routes/trafficLog.routes");
const validateEnv_1 = require("./utils/validateEnv");
// Load environment variables
dotenv_1.default.config();
// Validate environment variables
try {
    (0, validateEnv_1.validateEnv)();
}
catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Environment Error:', error.message);
    process.exit(1);
}
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/logs', trafficLog_routes_1.trafficLogRoutes);
// Database connection
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('\x1b[32m%s\x1b[0m', '✓ Connected to MongoDB');
})
    .catch((error) => {
    console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error:', error);
    process.exit(1);
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `✓ Server is running on port ${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', `  API Documentation: http://localhost:${PORT}/api/logs`);
});
