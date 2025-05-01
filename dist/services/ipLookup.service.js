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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPLookupService = void 0;
const ipinfo_1 = __importDefault(require("ipinfo"));
if (!process.env.IPINFO_TOKEN) {
    throw new Error('IPINFO_TOKEN is not defined in environment variables');
}
const ipinfo = new ipinfo_1.default(process.env.IPINFO_TOKEN);
class IPLookupService {
    static isPrivateIP(ip) {
        const parts = ip.split('.');
        return (parts[0] === '10' ||
            (parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) ||
            (parts[0] === '192' && parts[1] === '168') ||
            parts[0] === '127' ||
            parts[0] === '0');
    }
    static getIPDetails(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPrivateIP = this.isPrivateIP(ip);
                if (isPrivateIP) {
                    return {
                        ipAddress: ip,
                        isPrivateIP: true,
                        city: 'Private Network',
                        country: 'Private Network',
                        region: 'Private Network',
                        organization: 'Private Network'
                    };
                }
                const details = yield ipinfo.lookupIp(ip);
                return {
                    ipAddress: ip,
                    isPrivateIP: false,
                    city: details.city || undefined,
                    country: details.country || undefined,
                    region: details.region || undefined,
                    postalCode: details.postal || undefined,
                    latitude: details.loc ? parseFloat(details.loc.split(',')[0]) : undefined,
                    longitude: details.loc ? parseFloat(details.loc.split(',')[1]) : undefined,
                    organization: details.org || undefined
                };
            }
            catch (error) {
                console.error('Error looking up IP:', error);
                return {
                    ipAddress: ip,
                    isPrivateIP: false
                };
            }
        });
    }
}
exports.IPLookupService = IPLookupService;
