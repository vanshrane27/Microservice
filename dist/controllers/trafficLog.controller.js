"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficLogController = void 0;
const trafficLog_model_1 = require("../models/trafficLog.model");
const ipLookup_service_1 = require("../services/ipLookup.service");
class TrafficLogController {
    static createLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ipAddress, productUrl } = req.body;
                if (!ipAddress || !productUrl) {
                    res.status(400).json({ error: 'IP address and product URL are required' });
                    return;
                }
                const ipDetails = yield ipLookup_service_1.IPLookupService.getIPDetails(ipAddress);
                const logData = Object.assign(Object.assign({}, ipDetails), { productUrl });
                const log = new trafficLog_model_1.TrafficLog(logData);
                yield log.save();
                res.status(201).json(log);
            }
            catch (error) {
                console.error('Error creating log:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static getLogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const log = yield trafficLog_model_1.TrafficLog.findById(req.params.id);
                if (!log) {
                    res.status(404).json({ error: 'Log not found' });
                    return;
                }
                res.json(log);
            }
            catch (error) {
                console.error('Error getting log:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static getAllLogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;
                const logs = yield trafficLog_model_1.TrafficLog.find()
                    .sort({ date: -1 })
                    .skip(skip)
                    .limit(limit);
                const total = yield trafficLog_model_1.TrafficLog.countDocuments();
                res.json({
                    logs,
                    pagination: {
                        total,
                        page,
                        pages: Math.ceil(total / limit)
                    }
                });
            }
            catch (error) {
                console.error('Error getting logs:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.TrafficLogController = TrafficLogController;
