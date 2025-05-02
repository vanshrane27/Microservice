import axios from 'axios';
import { ITrafficLog } from '../models/trafficLog.model';

export class IPLookupService {
  private static readonly IPSTACK_API_KEY = '643399aa2994efe4b97d7384f6ef38a0';
  private static readonly IPSTACK_BASE_URL = 'https://api.ipstack.com';

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

      console.log('\x1b[36m%s\x1b[0m', 'Looking up IP with ipstack:', ip);
      
      try {
        // Try to ping the API first
        try {
          await axios.get('https://api.ipstack.com', { timeout: 2000 });
          console.log('\x1b[32m%s\x1b[0m', 'API endpoint is reachable');
        } catch (pingError) {
          console.error('\x1b[31m%s\x1b[0m', 'Cannot reach API endpoint:', pingError.message);
        }

        const url = `${this.IPSTACK_BASE_URL}/${ip}`;
        console.log('\x1b[36m%s\x1b[0m', 'Request URL:', url);

        const response = await axios.get(url, {
          params: {
            access_key: this.IPSTACK_API_KEY
          },
          headers: {
            'Accept': 'application/json'
          },
          timeout: 5000,
          validateStatus: (status) => status < 500
        });

        console.log('\x1b[36m%s\x1b[0m', 'API Response Status:', response.status);
        console.log('\x1b[36m%s\x1b[0m', 'API Response Data:', response.data);

        const details = response.data;

        // Check if the API returned an error
        if (details.error) {
          console.error('\x1b[31m%s\x1b[0m', 'IPStack API Error:', details.error);
          return {
            ipAddress: ip,
            isPrivateIP: false,
            error: {
              message: details.error.info || 'IPStack API Error',
              code: details.error.code || 'API_ERROR'
            }
          };
        }

        const result = {
          ipAddress: ip,
          isPrivateIP: false,
          city: details.city || 'Unknown',
          country: details.country_name || 'Unknown',
          region: details.region_name || 'Unknown',
          latitude: details.latitude || undefined,
          longitude: details.longitude || undefined,
          organization: details.connection?.isp || 'Unknown',
          timezone: details.time_zone?.id || undefined,
          currency: details.currency?.code || undefined,
          language: details.location?.languages?.[0]?.code || undefined,
          security: {
            isProxy: details.security?.is_proxy || false,
            isCrawler: details.security?.is_crawler || false
          }
        };

        console.log('\x1b[36m%s\x1b[0m', 'Geolocation data found:', result);
        return result;
      } catch (apiError) {
        console.error('\x1b[31m%s\x1b[0m', 'IPStack API Error:', {
          message: apiError.message,
          code: apiError.code,
          response: apiError.response?.data,
          status: apiError.response?.status,
          config: {
            url: apiError.config?.url,
            method: apiError.config?.method,
            headers: apiError.config?.headers
          }
        });

        // Try a fallback to a different endpoint
        try {
          console.log('\x1b[36m%s\x1b[0m', 'Trying fallback endpoint...');
          const fallbackResponse = await axios.get(`http://ip-api.com/json/${ip}`, {
            timeout: 5000
          });
          
          const fallbackData = fallbackResponse.data;
          return {
            ipAddress: ip,
            isPrivateIP: false,
            city: fallbackData.city || 'Unknown',
            country: fallbackData.country || 'Unknown',
            region: fallbackData.regionName || 'Unknown',
            latitude: fallbackData.lat || undefined,
            longitude: fallbackData.lon || undefined,
            organization: fallbackData.isp || 'Unknown',
            timezone: fallbackData.timezone || undefined
          };
        } catch (fallbackError) {
          console.error('\x1b[31m%s\x1b[0m', 'Fallback API Error:', fallbackError.message);
          return {
            ipAddress: ip,
            isPrivateIP: false,
            error: {
              message: 'Both primary and fallback API failed',
              code: 'API_ERROR'
            }
          };
        }
      }
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