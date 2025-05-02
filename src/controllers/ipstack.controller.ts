import { Request, Response } from 'express';
import { IPStackService } from '../services/ipstack.service';

export class IPStackController {
  public static async getIPDetails(req: Request, res: Response) {
    try {
      const { ip } = req.params;
      
      if (!ip) {
        return res.status(400).json({
          error: 'IP address is required'
        });
      }

      const details = await IPStackService.getIPDetails(ip);
      res.json(details);
    } catch (error) {
      console.error('Error in getIPDetails:', error);
      res.status(500).json({
        error: 'Failed to get IP details',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public static async getCurrentIPDetails(req: Request, res: Response) {
    try {
      // Get the client's IP address
      const clientIP = req.ip || req.connection.remoteAddress;
      
      if (!clientIP) {
        return res.status(400).json({
          error: 'Could not determine IP address'
        });
      }

      const details = await IPStackService.getIPDetails(clientIP);
      res.json(details);
    } catch (error) {
      console.error('Error in getCurrentIPDetails:', error);
      res.status(500).json({
        error: 'Failed to get IP details',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 