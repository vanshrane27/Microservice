import geoip from 'geoip-lite';
import { ITrafficLog } from '../models/trafficLog.model';

export class IPLookupService {
  private static isPrivateIP(ip: string): boolean {
    const parts = ip.split('.');
    return (
      parts[0] === '10' ||
      (parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) ||
      (parts[0] === '192' && parts[1] === '168') ||
      parts[0] === '127' ||
      parts[0] === '0'
    );
  }

  public static async getIPDetails(ip: string): Promise<Partial<ITrafficLog>> {
    try {
      // Handle case where no IP is provided
      if (!ip) {
        console.log('\x1b[33m%s\x1b[0m', 'No IP address provided, using default value');
        return {
          ipAddress: '0.0.0.0',
          isPrivateIP: true,
          city: 'Unknown',
          country: 'Unknown',
          region: 'Unknown',
          organization: 'Unknown',
          error: {
            message: 'No IP address provided, using default value'
          }
        };
      }

      console.log('\x1b[36m%s\x1b[0m', 'Starting IP lookup for:', ip);
      const isPrivateIP = this.isPrivateIP(ip);
      
      if (isPrivateIP) {
        console.log('\x1b[36m%s\x1b[0m', 'IP is private, returning default values');
        return {
          ipAddress: ip,
          isPrivateIP: true,
          city: 'Private Network',
          country: 'Private Network',
          region: 'Private Network',
          organization: 'Private Network'
        };
      }

      console.log('\x1b[36m%s\x1b[0m', 'Looking up IP with geoip-lite:', ip);
      const geo = geoip.lookup(ip);
      
      if (!geo) {
        console.log('\x1b[36m%s\x1b[0m', 'No geolocation data found for IP:', ip);
        return {
          ipAddress: ip,
          isPrivateIP: false,
          city: 'Unknown',
          country: 'Unknown',
          region: 'Unknown',
          organization: 'Unknown'
        };
      }

      const result = {
        ipAddress: ip,
        isPrivateIP: false,
        city: geo.city || 'Unknown',
        country: geo.country || 'Unknown',
        region: geo.region || 'Unknown',
        latitude: geo.ll ? geo.ll[0] : undefined,
        longitude: geo.ll ? geo.ll[1] : undefined,
        organization: 'Unknown' // geoip-lite doesn't provide organization info
      };

      console.log('\x1b[36m%s\x1b[0m', 'Geolocation data found:', result);
      return result;
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Error in getIPDetails:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name
      });
      
      return {
        ipAddress: ip,
        isPrivateIP: false,
        error: {
          message: error.message,
          code: error.code
        }
      };
    }
  }
} 