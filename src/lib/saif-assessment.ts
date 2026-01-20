/**
 * SAIF (Self-Autonomous Intelligence Framework) Risk Assessment
 * H&&S:WAVE - CQW scoring and emergent capability assessment
 * 
 * Implements the SAIF risk assessment framework for measuring:
 * - CQW (Code Quality Workflow) scores
 * - Emergent capability percentages
 * - Self-maintaining vortex health
 */

import { DomainConfig } from './domain-config';
import { HealthCheckResult, calculateHealthSummary } from './api-health-service';

export interface SAIFAssessment {
  cqwScore: number; // 0-100: Code Quality Workflow score
  emergenceLevel: number; // 0-100: Emergent capability percentage
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  vortexHealth: 'stable' | 'fluctuating' | 'degraded' | 'critical';
  fragmentationScore: number; // 0-100: Lower is better (less fragmentation)
  unificationScore: number; // 0-100: Higher is better (more unified)
  assessmentDate: Date;
  recommendations: string[];
}

export interface SAIFMetrics {
  totalDomains: number;
  unifiedDomains: number;
  healthyDomains: number;
  averageResponseTime: number;
  testCoverage: number;
  cicdStatus: 'passing' | 'failing' | 'unknown';
}

/**
 * Calculate CQW (Code Quality Workflow) score
 * Based on health checks, test coverage, and CI/CD status
 */
export function calculateCQWScore(metrics: SAIFMetrics): number {
  let score = 0;
  
  // Health coverage (40% weight)
  const healthRatio = metrics.totalDomains > 0 
    ? metrics.healthyDomains / metrics.totalDomains 
    : 0;
  score += healthRatio * 40;
  
  // Response time performance (20% weight)
  // Under 500ms = full points, over 3000ms = 0 points.
  // We linearly interpolate between 500ms (score = 1) and 3000ms (score = 0):
  //   rawScore = (3000 - averageResponseTime) / (3000 - 500)
  // The divisor 2500 is the width of this scoring window (3000ms - 500ms).
  // The result is then clamped to [0, 1] with Math.max/Math.min to avoid negative or >1 scores.
  const responseScore = Math.max(0, Math.min(1, (3000 - metrics.averageResponseTime) / 2500));
  score += responseScore * 20;
  
  // Test coverage (25% weight)
  score += (metrics.testCoverage / 100) * 25;
  
  // CI/CD status (15% weight)
  if (metrics.cicdStatus === 'passing') score += 15;
  else if (metrics.cicdStatus === 'unknown') score += 7.5;
  
  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Calculate emergent capability level
 * Measures the self-maintaining characteristics of the system
 */
export function calculateEmergenceLevel(metrics: SAIFMetrics): number {
  // Emergence = ability to self-maintain > 85% threshold
  // CHESS-spec Mission: "Stay two-moves ahead of ourselves" requires maintaining 
  // work quality over 85% to ensure emergent coherence
  const unificationRatio = metrics.totalDomains > 0
    ? metrics.unifiedDomains / metrics.totalDomains
    : 0;
  
  const healthRatio = metrics.totalDomains > 0
    ? metrics.healthyDomains / metrics.totalDomains
    : 0;
  
  // Emergence formula: weighted combination of unification and health
  const emergence = (unificationRatio * 0.6 + healthRatio * 0.4) * 100;
  
  return Math.round(emergence);
}

/**
 * Calculate fragmentation score
 * Higher fragmentation = more disparate systems, harder to manage
 */
export function calculateFragmentationScore(domains: DomainConfig[]): number {
  if (domains.length === 0) return 0;
  
  // Count unique providers
  const providers = new Set(domains.map(d => d.provider));
  // Fragmentation increases with more providers (normalized 0-1)
  // 1 provider = 0, 2+ providers = proportionally higher
  const providerFragmentation = providers.size <= 1 ? 0 : (providers.size - 1) / providers.size;
  
  // Count unique environments
  const environments = new Set(domains.map(d => d.environment));
  const envFragmentation = environments.size > 1 ? 0.3 : 0;
  
  // Check for inactive domains (indicates drift)
  const inactiveRatio = domains.filter(d => !d.isActive).length / domains.length;
  
  const fragmentation = (providerFragmentation * 0.4 + envFragmentation * 0.3 + inactiveRatio * 0.3) * 100;
  
  return Math.round(fragmentation);
}

/**
 * Determine risk level based on CQW and emergence
 * Thresholds aligned with CHESS-spec Mission (85% quality standard)
 */
export function determineRiskLevel(cqwScore: number, emergenceLevel: number): SAIFAssessment['riskLevel'] {
  const combinedScore = (cqwScore + emergenceLevel) / 2;
  
  // CHESS-spec aligned thresholds: 85/70/50 for low/medium/high
  if (combinedScore >= 85) return 'low';
  if (combinedScore >= 70) return 'medium';
  if (combinedScore >= 50) return 'high';
  return 'critical';
}

/**
 * Determine vortex health status
 */
export function determineVortexHealth(
  cqwScore: number, 
  fragmentationScore: number
): SAIFAssessment['vortexHealth'] {
  if (cqwScore >= 80 && fragmentationScore <= 20) return 'stable';
  if (cqwScore >= 60 && fragmentationScore <= 40) return 'fluctuating';
  if (cqwScore >= 40 && fragmentationScore <= 60) return 'degraded';
  return 'critical';
}

/**
 * Generate recommendations based on assessment
 */
export function generateRecommendations(
  cqwScore: number,
  emergenceLevel: number,
  fragmentationScore: number,
  healthResults: HealthCheckResult[]
): string[] {
  const recommendations: string[] = [];
  
  // CQW recommendations
  if (cqwScore < 60) {
    recommendations.push('Increase test coverage to improve CQW score');
    recommendations.push('Ensure CI/CD pipelines are passing');
  }
  
  // Emergence recommendations
  if (emergenceLevel < 85) {
    recommendations.push('Unify domains under consistent infrastructure');
    recommendations.push('Implement automated health monitoring');
  }
  
  // Fragmentation recommendations
  if (fragmentationScore > 40) {
    recommendations.push('Consolidate hosting providers to reduce fragmentation');
    recommendations.push('Standardize deployment environments');
  }
  
  // Health-based recommendations
  const unhealthyDomains = healthResults.filter(r => r.status === 'unhealthy');
  if (unhealthyDomains.length > 0) {
    recommendations.push(`Address health issues in ${unhealthyDomains.length} domain(s)`);
  }
  
  const slowDomains = healthResults.filter(r => r.responseTimeMs > 2000);
  if (slowDomains.length > 0) {
    recommendations.push(`Optimize response times for ${slowDomains.length} slow domain(s)`);
  }
  
  // If everything is good
  if (recommendations.length === 0) {
    recommendations.push('All systems operating within optimal parameters');
    recommendations.push('Continue monitoring for emergent behaviors');
  }
  
  return recommendations;
}

/**
 * Perform full SAIF assessment
 */
export function performSAIFAssessment(
  domains: DomainConfig[],
  healthResults: HealthCheckResult[],
  testCoverage: number = 75, // Default assumption
  cicdStatus: SAIFMetrics['cicdStatus'] = 'unknown'
): SAIFAssessment {
  const summary = calculateHealthSummary(healthResults);
  
  const metrics: SAIFMetrics = {
    totalDomains: domains.length,
    unifiedDomains: domains.filter(d => d.isActive).length,
    healthyDomains: summary.healthyCount,
    averageResponseTime: summary.averageResponseTimeMs,
    testCoverage,
    cicdStatus
  };
  
  const cqwScore = calculateCQWScore(metrics);
  const emergenceLevel = calculateEmergenceLevel(metrics);
  const fragmentationScore = calculateFragmentationScore(domains);
  const unificationScore = 100 - fragmentationScore;
  const riskLevel = determineRiskLevel(cqwScore, emergenceLevel);
  const vortexHealth = determineVortexHealth(cqwScore, fragmentationScore);
  const recommendations = generateRecommendations(
    cqwScore, 
    emergenceLevel, 
    fragmentationScore, 
    healthResults
  );
  
  return {
    cqwScore,
    emergenceLevel,
    riskLevel,
    vortexHealth,
    fragmentationScore,
    unificationScore,
    assessmentDate: new Date(),
    recommendations
  };
}

/**
 * Check if emergence level meets threshold (>85% per CHESS-spec Mission)
 * The CHESS-spec Mission defines the quality standard: "Stay two-moves ahead 
 * of ourselves, at all times" which requires maintaining work quality over 85%.
 */
export function meetsEmergenceThreshold(assessment: SAIFAssessment): boolean {
  return assessment.emergenceLevel > 85;
}

/**
 * Get SAIF status color for UI display
 */
export function getSAIFStatusColor(riskLevel: SAIFAssessment['riskLevel']): string {
  switch (riskLevel) {
    case 'low': return 'text-green-500';
    case 'medium': return 'text-amber-500';
    case 'high': return 'text-orange-500';
    case 'critical': return 'text-red-500';
  }
}

/**
 * Get vortex health color for UI display
 */
export function getVortexHealthColor(health: SAIFAssessment['vortexHealth']): string {
  switch (health) {
    case 'stable': return 'text-green-500';
    case 'fluctuating': return 'text-amber-500';
    case 'degraded': return 'text-orange-500';
    case 'critical': return 'text-red-500';
  }
}
