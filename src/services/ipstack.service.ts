import axios from 'axios';

interface IPStackResponse {
  ip: string;
  type?: string;
  continent_code?: string;
  continent_name?: string;
  country_code?: string;
  country_name?: string;
  region_code?: string;
  region_name?: string;
  city?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  location?: {
    geoname_id?: number;
    capital?: string;
    languages?: Array<{
      code?: string;
      name?: string;
      native?: string;
    }>;
    country_flag?: string;
    country_flag_emoji?: string;
    country_flag_emoji_unicode?: string;
    calling_code?: string;
    is_eu?: boolean;
  };
  time_zone?: {
    id?: string;
    current_time?: string;
    gmt_offset?: number;
    code?: string;
    is_daylight_saving?: boolean;
  };
  currency?: {
    code?: string;
    name?: string;
    plural?: string;
    symbol?: string;
    symbol_native?: string;
  };
  connection?: {
    asn?: number;
    isp?: string;
  };
  security?: {
    is_proxy?: boolean;
    proxy_type?: string;
    is_crawler?: boolean;
    crawler_name?: string;
    crawler_type?: string;
    is_tor?: boolean;
    threat_level?: string;
    threat_types?: string[];
  };
  error?: {
    code: number;
    type: string;
    info: string;
  };
}

export class IPStackService {
  private static readonly API_KEY = process.env.IPSTACK_API_KEY;
  private static readonly BASE_URL = 'http://api.ipstack.com';

  public static async lookupIP(ip: string): Promise<IPStackResponse> {
    if (!this.API_KEY) {
      throw new Error('IPSTACK_API_KEY is not defined in environment variables');
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/${ip}`, {
        params: {
          access_key: this.API_KEY,
          fields: 'ip,type,continent_code,continent_name,country_code,country_name,region_code,region_name,city,zip,latitude,longitude,location,time_zone,currency,connection,security'
        },
        timeout: 5000
      });

      if (response.data.error) {
        throw new Error(`IPStack API Error: ${response.data.error.info}`);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`IPStack API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  public static async getIPDetails(ip: string) {
    try {
      const details = await this.lookupIP(ip);
      
      return {
        ipAddress: details.ip,
        type: details.type,
        continent: {
          code: details.continent_code,
          name: details.continent_name
        },
        country: {
          code: details.country_code,
          name: details.country_name
        },
        region: {
          code: details.region_code,
          name: details.region_name
        },
        city: details.city,
        postalCode: details.zip,
        coordinates: {
          latitude: details.latitude,
          longitude: details.longitude
        },
        location: details.location,
        timezone: details.time_zone,
        currency: details.currency,
        connection: details.connection,
        security: details.security
      };
    } catch (error) {
      console.error('Error getting IP details:', error);
      throw error;
    }
  }
} 