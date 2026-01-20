/**
 * SAIF Assessment Unit Tests
 * Tests for the SAIF risk assessment framework
 */

import {
  calculateCQWScore,
  calculateEmergenceLevel,
  calculateFragmentationScore,
  determineRiskLevel,
  determineVortexHealth,
  generateRecommendations,
  meetsEmergenceThreshold,
  performSAIFAssessment,
  SAIFMetrics,
  SAIFAssessment
} from '../src/lib/saif-assessment';

describe('SAIF Assessment', () => {
  describe('calculateCQWScore', () => {
    it('should return 100 for perfect metrics', () => {
      const metrics: SAIFMetrics = {
        totalDomains: 10,
        unifiedDomains: 10,
        healthyDomains: 10,
        averageResponseTime: 100,
        testCoverage: 100,
        cicdStatus: 'passing'
      };
      expect(calculateCQWScore(metrics)).toBe(100);
    });

    it('should return 0 for worst metrics', () => {
      const metrics: SAIFMetrics = {
        totalDomains: 10,
        unifiedDomains: 0,
        healthyDomains: 0,
        averageResponseTime: 5000,
        testCoverage: 0,
        cicdStatus: 'failing'
      };
      expect(calculateCQWScore(metrics)).toBe(0);
    });

    it('should handle zero domains gracefully', () => {
      const metrics: SAIFMetrics = {
        totalDomains: 0,
        unifiedDomains: 0,
        healthyDomains: 0,
        averageResponseTime: 0,
        testCoverage: 50,
        cicdStatus: 'unknown'
      };
      // Should not throw and should return a valid score
      const score = calculateCQWScore(metrics);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateEmergenceLevel', () => {
    it('should return 100 for fully unified and healthy system', () => {
      const metrics: SAIFMetrics = {
        totalDomains: 10,
        unifiedDomains: 10,
        healthyDomains: 10,
        averageResponseTime: 100,
        testCoverage: 100,
        cicdStatus: 'passing'
      };
      expect(calculateEmergenceLevel(metrics)).toBe(100);
    });

    it('should return 0 for completely fragmented system', () => {
      const metrics: SAIFMetrics = {
        totalDomains: 10,
        unifiedDomains: 0,
        healthyDomains: 0,
        averageResponseTime: 5000,
        testCoverage: 0,
        cicdStatus: 'failing'
      };
      expect(calculateEmergenceLevel(metrics)).toBe(0);
    });
  });

  describe('meetsEmergenceThreshold', () => {
    it('should return true when emergence level exceeds 85%', () => {
      const assessment: SAIFAssessment = {
        cqwScore: 90,
        emergenceLevel: 86,
        riskLevel: 'low',
        vortexHealth: 'stable',
        fragmentationScore: 10,
        unificationScore: 90,
        assessmentDate: new Date(),
        recommendations: []
      };
      expect(meetsEmergenceThreshold(assessment)).toBe(true);
    });

    it('should return false when emergence level is exactly 85%', () => {
      const assessment: SAIFAssessment = {
        cqwScore: 85,
        emergenceLevel: 85,
        riskLevel: 'low',
        vortexHealth: 'stable',
        fragmentationScore: 15,
        unificationScore: 85,
        assessmentDate: new Date(),
        recommendations: []
      };
      expect(meetsEmergenceThreshold(assessment)).toBe(false);
    });

    it('should return false when emergence level is below 85%', () => {
      const assessment: SAIFAssessment = {
        cqwScore: 70,
        emergenceLevel: 70,
        riskLevel: 'medium',
        vortexHealth: 'fluctuating',
        fragmentationScore: 30,
        unificationScore: 70,
        assessmentDate: new Date(),
        recommendations: []
      };
      expect(meetsEmergenceThreshold(assessment)).toBe(false);
    });
  });

  describe('determineRiskLevel', () => {
    it('should return low for high scores (>=85%)', () => {
      expect(determineRiskLevel(90, 90)).toBe('low');
      expect(determineRiskLevel(85, 85)).toBe('low');
    });

    it('should return medium for moderate scores (70-84%)', () => {
      expect(determineRiskLevel(80, 80)).toBe('medium');
      expect(determineRiskLevel(70, 70)).toBe('medium');
    });

    it('should return high for below-average scores (50-69%)', () => {
      expect(determineRiskLevel(60, 60)).toBe('high');
      expect(determineRiskLevel(50, 50)).toBe('high');
    });

    it('should return critical for poor scores (<50%)', () => {
      expect(determineRiskLevel(40, 40)).toBe('critical');
      expect(determineRiskLevel(20, 20)).toBe('critical');
    });
  });

  describe('determineVortexHealth', () => {
    it('should return stable for high CQW and low fragmentation', () => {
      expect(determineVortexHealth(90, 10)).toBe('stable');
    });

    it('should return fluctuating for moderate metrics', () => {
      expect(determineVortexHealth(70, 30)).toBe('fluctuating');
    });

    it('should return degraded for poor metrics', () => {
      expect(determineVortexHealth(50, 50)).toBe('degraded');
    });

    it('should return critical for very poor metrics', () => {
      expect(determineVortexHealth(20, 80)).toBe('critical');
    });
  });

  describe('generateRecommendations', () => {
    it('should recommend emergence improvements when below 85%', () => {
      const recommendations = generateRecommendations(90, 70, 20, []);
      expect(recommendations).toContain('Unify domains under consistent infrastructure');
      expect(recommendations).toContain('Implement automated health monitoring');
    });

    it('should return positive message when all metrics are good', () => {
      const recommendations = generateRecommendations(90, 90, 20, []);
      expect(recommendations).toContain('All systems operating within optimal parameters');
    });
  });

  describe('calculateFragmentationScore', () => {
    it('should return 0 for empty domain list', () => {
      expect(calculateFragmentationScore([])).toBe(0);
    });

    it('should return 0 for single provider, single environment', () => {
      const domains = [
        { id: '1', name: 'Domain 1', url: 'https://example.com', provider: 'vercel' as const, environment: 'production' as const, isActive: true }
      ];
      expect(calculateFragmentationScore(domains)).toBe(0);
    });

    it('should return higher score for multiple providers', () => {
      const domains = [
        { id: '1', name: 'Domain 1', url: 'https://example1.com', provider: 'vercel' as const, environment: 'production' as const, isActive: true },
        { id: '2', name: 'Domain 2', url: 'https://example2.com', provider: 'cloudflare-pages' as const, environment: 'production' as const, isActive: true }
      ];
      const score = calculateFragmentationScore(domains);
      expect(score).toBeGreaterThan(0);
    });
  });
});
