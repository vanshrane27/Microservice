declare module 'ipinfo' {
  interface IPInfoResponse {
    ip: string;
    hostname?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    org?: string;
    postal?: string;
    timezone?: string;
  }

  class IPinfo {
    constructor(token: string);
    lookupIp(ip: string): Promise<IPInfoResponse>;
  }

  export default IPinfo;
} 