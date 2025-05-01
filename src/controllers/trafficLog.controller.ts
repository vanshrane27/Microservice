import { Request, Response } from 'express';
import { TrafficLog, ITrafficLog } from '../models/trafficLog.model';
import { IPLookupService } from '../services/ipLookup.service';

export class TrafficLogController {
  public static async createLog(req: Request, res: Response): Promise<void> {
    try {
      console.log('\x1b[36m%s\x1b[0m', 'Creating new log entry:', req.body);
      const { ipAddress, productUrl } = req.body;

      if (!productUrl) {
        console.log('\x1b[31m%s\x1b[0m', 'Missing required field: productUrl');
        res.status(400).json({ error: 'Product URL is required' });
        return;
      }

      // IP address is now optional, will use default value if not provided
      const ipDetails = await IPLookupService.getIPDetails(ipAddress);
      console.log('\x1b[36m%s\x1b[0m', 'IP details retrieved:', ipDetails);
      
      const logData: Partial<ITrafficLog> = {
        ...ipDetails,
        productUrl
      };

      const log = new TrafficLog(logData);
      console.log('\x1b[36m%s\x1b[0m', 'Saving log to database:', logData);
      await log.save();

      console.log('\x1b[32m%s\x1b[0m', 'Log created successfully:', log);
      res.status(201).json(log);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Error creating log:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public static async getLogById(req: Request, res: Response): Promise<void> {
    try {
      console.log('\x1b[36m%s\x1b[0m', 'Fetching log by ID:', req.params.id);
      const log = await TrafficLog.findById(req.params.id);
      if (!log) {
        console.log('\x1b[31m%s\x1b[0m', 'Log not found:', req.params.id);
        res.status(404).json({ error: 'Log not found' });
        return;
      }
      console.log('\x1b[32m%s\x1b[0m', 'Log found:', log);
      res.json(log);
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Error getting log:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public static async getAllLogs(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      console.log('\x1b[36m%s\x1b[0m', 'Fetching logs:', { page, limit, skip });

      const logs = await TrafficLog.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await TrafficLog.countDocuments();
      console.log('\x1b[36m%s\x1b[0m', 'Total logs in database:', total);

      res.json({
        logs,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Error getting logs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 