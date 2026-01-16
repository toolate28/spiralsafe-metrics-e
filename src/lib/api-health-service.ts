/**
 * API Health Check Service for Domain Unification
 * H&&S:WAVE - Health monitoring for unified domains/subdomains
 */

import { DomainConfig, getEnvironmentConfig, UNIFIED_DOMAINS } from './domain-config';

export interface HealthCheckResult {
  domainId: string;
  url: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  responseTimeMs: number;
  statusCode?: number;
  lastChecked: Date;
  errorMessage?: string;
}

export interface HealthCheckSummary {
  totalDomains: number;
  healthyCount: number;
  degradedCount: number;
  unhealthyCount: number;
  unknownCount: number;
  averageResponseTimeMs: number;
  lastUpdated: Date;
}

// Response time thresholds for health status (in milliseconds)
// These values can be adjusted based on environment or network conditions
const HEALTHY_THRESHOLD_MS = 1000;
const DEGRADED_THRESHOLD_MS = 3000;

/**
 * Perform health check on a single domain
 * 
 * Note: Using 'no-cors' mode prevents access to response status and headers,
 * limiting health checks to response time analysis. For production use with
 * proper health checks, configure CORS on target domains or use a backend proxy.
 */
export async function checkDomainHealth(domain: DomainConfig): Promise<HealthCheckResult> {
  const config = getEnvironmentConfig();
  const healthUrl = domain.healthEndpoint 
    ? `${domain.url}${domain.healthEndpoint}`
    : domain.url;
  
  const startTime = performance.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.apiTimeout);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      mode: 'no-cors', // Required for cross-origin domains without CORS headers
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const responseTimeMs = Math.round(performance.now() - startTime);
    
    // With no-cors mode, we determine health status based on response time only
    const status = responseTimeMs < HEALTHY_THRESHOLD_MS ? 'healthy' : 
                   responseTimeMs < DEGRADED_THRESHOLD_MS ? 'degraded' : 'unhealthy';
    
    return {
      domainId: domain.id,
      url: healthUrl,
      status,
      responseTimeMs,
      statusCode: response.status || 200,
      lastChecked: new Date()
    };
  } catch (error) {
    const responseTimeMs = Math.round(performance.now() - startTime);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      domainId: domain.id,
      url: healthUrl,
      status: errorMessage.includes('abort') ? 'unhealthy' : 'unknown',
      responseTimeMs,
      lastChecked: new Date(),
      errorMessage
    };
  }
}

/**
 * Perform health checks on all active domains
 */
export async function checkAllDomainsHealth(
  domains: DomainConfig[] = UNIFIED_DOMAINS
): Promise<HealthCheckResult[]> {
  const activeDomains = domains.filter(d => d.isActive);
  
  const results = await Promise.allSettled(
    activeDomains.map(domain => checkDomainHealth(domain))
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      domainId: activeDomains[index].id,
      url: activeDomains[index].url,
      status: 'unknown' as const,
      responseTimeMs: 0,
      lastChecked: new Date(),
      errorMessage: 'Promise rejected'
    };
  });
}

/**
 * Calculate summary statistics from health check results
 */
export function calculateHealthSummary(results: HealthCheckResult[]): HealthCheckSummary {
  const healthyCount = results.filter(r => r.status === 'healthy').length;
  const degradedCount = results.filter(r => r.status === 'degraded').length;
  const unhealthyCount = results.filter(r => r.status === 'unhealthy').length;
  const unknownCount = results.filter(r => r.status === 'unknown').length;
  
  const totalResponseTime = results.reduce((sum, r) => sum + r.responseTimeMs, 0);
  const averageResponseTimeMs = results.length > 0 
    ? Math.round(totalResponseTime / results.length) 
    : 0;
  
  return {
    totalDomains: results.length,
    healthyCount,
    degradedCount,
    unhealthyCount,
    unknownCount,
    averageResponseTimeMs,
    lastUpdated: new Date()
  };
}

/**
 * Get health status color for UI display
 */
export function getHealthStatusColor(status: HealthCheckResult['status']): string {
  switch (status) {
    case 'healthy': return 'text-green-500';
    case 'degraded': return 'text-amber-500';
    case 'unhealthy': return 'text-red-500';
    default: return 'text-gray-400';
  }
}

/**
 * Get health status badge variant for UI display
 */
export function getHealthStatusBadgeVariant(
  status: HealthCheckResult['status']
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'healthy': return 'default';
    case 'degraded': return 'secondary';
    case 'unhealthy': return 'destructive';
    default: return 'outline';
  }
}
