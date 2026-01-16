/**
 * Domain Unification Configuration for VortexForge Autonomy
 * H&&S:WAVE - Unified domain/subdomain management for SpiralSafe
 */

export type Environment = 'development' | 'production' | 'staging';

export interface DomainConfig {
  id: string;
  name: string;
  url: string;
  environment: Environment;
  healthEndpoint?: string;
  provider: 'vercel' | 'github-pages' | 'cloudflare-pages' | 'custom';
  isActive: boolean;
  lastHealthCheck?: Date;
  healthStatus?: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
}

export interface SAIFRiskScore {
  cqwScore: number; // Code Quality Workflow score (0-100)
  emergenceLevel: number; // Emergent capability percentage
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  assessmentDate: Date;
}

export const UNIFIED_DOMAINS: DomainConfig[] = [
  {
    id: 'vercel-prod',
    name: 'SpiralSafe Vercel (Production)',
    url: 'https://spiralsafe.vercel.app',
    environment: 'production',
    healthEndpoint: '/api/health',
    provider: 'vercel',
    isActive: true,
    healthStatus: 'unknown'
  },
  {
    id: 'github-pages',
    name: 'SpiralSafe GitHub Pages',
    url: 'https://spiralsafe.github.io',
    environment: 'production',
    healthEndpoint: '/',
    provider: 'github-pages',
    isActive: true,
    healthStatus: 'unknown'
  },
  {
    id: 'cloudflare-pages',
    name: 'SpiralSafe Cloudflare Pages',
    url: 'https://spiralsafe.pages.dev',
    environment: 'production',
    healthEndpoint: '/',
    provider: 'cloudflare-pages',
    isActive: true,
    healthStatus: 'unknown'
  },
  {
    id: 'toolated-online',
    name: 'Toolated Online',
    url: 'https://toolated.online',
    environment: 'production',
    healthEndpoint: '/',
    provider: 'custom',
    isActive: true,
    healthStatus: 'unknown'
  },
  {
    id: 'api-spiralsafe',
    name: 'API SpiralSafe (Health)',
    url: 'https://api.spiralsafe.org',
    environment: 'production',
    healthEndpoint: '/health',
    provider: 'custom',
    isActive: true,
    healthStatus: 'unknown'
  },
  {
    id: 'vercel-dev',
    name: 'SpiralSafe Vercel (Development)',
    url: 'https://spiralsafe-dev.vercel.app',
    environment: 'development',
    healthEndpoint: '/api/health',
    provider: 'vercel',
    isActive: true,
    healthStatus: 'unknown'
  }
];

/**
 * Get domains filtered by environment
 */
export function getDomainsByEnvironment(env: Environment): DomainConfig[] {
  return UNIFIED_DOMAINS.filter(domain => domain.environment === env);
}

/**
 * Get domains filtered by provider
 */
export function getDomainsByProvider(provider: DomainConfig['provider']): DomainConfig[] {
  return UNIFIED_DOMAINS.filter(domain => domain.provider === provider);
}

/**
 * Get active domains only
 */
export function getActiveDomains(): DomainConfig[] {
  return UNIFIED_DOMAINS.filter(domain => domain.isActive);
}

/**
 * Calculate aggregate health status across all domains
 */
export function getAggregateHealthStatus(domains: DomainConfig[]): 'healthy' | 'degraded' | 'unhealthy' | 'unknown' {
  const statuses = domains.map(d => d.healthStatus);
  
  if (statuses.every(s => s === 'healthy')) return 'healthy';
  if (statuses.some(s => s === 'unhealthy')) return 'unhealthy';
  if (statuses.some(s => s === 'degraded')) return 'degraded';
  return 'unknown';
}

/**
 * Environment-specific configuration
 */
export const ENVIRONMENT_CONFIG = {
  development: {
    apiTimeout: 10000,
    healthCheckInterval: 60000, // 1 minute
    enableDetailedLogging: true,
    saifThreshold: 50
  },
  staging: {
    apiTimeout: 5000,
    healthCheckInterval: 30000, // 30 seconds
    enableDetailedLogging: true,
    saifThreshold: 60
  },
  production: {
    apiTimeout: 5000,
    healthCheckInterval: 15000, // 15 seconds
    enableDetailedLogging: false,
    saifThreshold: 60
  }
};

/**
 * Get current environment from runtime
 */
export function getCurrentEnvironment(): Environment {
  const env = import.meta.env.MODE;
  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  return 'development';
}

/**
 * Get environment-specific config
 */
export function getEnvironmentConfig() {
  return ENVIRONMENT_CONFIG[getCurrentEnvironment()];
}
