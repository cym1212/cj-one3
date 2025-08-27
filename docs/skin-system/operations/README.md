# ⚙️ 스킨 시스템 운영 가이드

이 섹션에서는 WithCookie WebBuilder 스킨 시스템의 실제 운영과 관련된 모든 정보를 제공합니다.

## 📂 운영 가이드 구조

```
operations/
├── README.md                    # 이 파일
├── monitoring-alerts.md         # 모니터링 및 알림 설정
├── performance-optimization.md  # 성능 최적화 전략
├── troubleshooting.md          # 문제 해결 가이드
├── maintenance.md              # 유지보수 가이드
└── disaster-recovery.md        # 재해 복구 계획
```

## 🎯 운영 목표

### 핵심 지표 (KPI)

| 지표 | 목표 | 측정 방법 | 액션 기준 |
|------|------|-----------|----------|
| **가용성** | 99.9% | 업타임 모니터링 | < 99.5% 시 즉시 대응 |
| **응답 시간** | < 200ms | CDN 응답 시간 | > 500ms 지속 시 조사 |
| **에러율** | < 0.1% | 4xx/5xx 에러 비율 | > 1% 시 긴급 대응 |
| **캐시 히트율** | > 95% | CDN 캐시 통계 | < 90% 시 캐시 전략 검토 |
| **로딩 성공률** | > 99.9% | 스킨 로딩 성공/실패 | < 99% 시 원인 분석 |

### 서비스 수준 목표 (SLO)

#### Tier 1: 중요 스킨 (로그인, 결제 등)
- **가용성**: 99.95%
- **응답 시간**: 95%ile < 150ms
- **복구 시간**: < 15분

#### Tier 2: 일반 스킨
- **가용성**: 99.9%
- **응답 시간**: 95%ile < 300ms
- **복구 시간**: < 1시간

#### Tier 3: 실험적 스킨
- **가용성**: 99.5%
- **응답 시간**: 95%ile < 1초
- **복구 시간**: < 4시간

## 📊 모니터링 대시보드

### 1. 실시간 대시보드 구성

```yaml
# Grafana 대시보드 설정
dashboard:
  title: "WithCookie Skin System"
  tags: ["skin", "cdn", "performance"]
  
  panels:
    - title: "Request Volume"
      type: "stat"
      targets:
        - expr: "sum(rate(skin_requests_total[5m]))"
      thresholds:
        - color: "green"
          value: 0
        - color: "yellow" 
          value: 1000
        - color: "red"
          value: 5000
          
    - title: "Error Rate"
      type: "stat"
      targets:
        - expr: "sum(rate(skin_requests_total{status=~'4..|5..'}[5m])) / sum(rate(skin_requests_total[5m])) * 100"
      thresholds:
        - color: "green"
          value: 0
        - color: "yellow"
          value: 0.1
        - color: "red"
          value: 1
          
    - title: "Response Time"
      type: "graph"
      targets:
        - expr: "histogram_quantile(0.95, sum(rate(skin_request_duration_seconds_bucket[5m])) by (le))"
        - expr: "histogram_quantile(0.50, sum(rate(skin_request_duration_seconds_bucket[5m])) by (le))"
```

### 2. 비즈니스 메트릭

```javascript
// 비즈니스 메트릭 수집
class SkinMetricsCollector {
  constructor() {
    this.metrics = {
      loadAttempts: new Map(),
      loadSuccesses: new Map(), 
      loadFailures: new Map(),
      renderTime: new Map(),
      userSatisfaction: new Map()
    }
  }
  
  recordLoadAttempt(skinId, userId = null) {
    this.increment('loadAttempts', skinId)
    
    // 사용자별 통계
    if (userId) {
      this.increment(`user_${userId}_attempts`, skinId)
    }
  }
  
  recordLoadSuccess(skinId, loadTime, userId = null) {
    this.increment('loadSuccesses', skinId)
    this.recordValue('loadTime', skinId, loadTime)
    
    // 성공률 계산
    const attempts = this.get('loadAttempts', skinId) || 0
    const successes = this.get('loadSuccesses', skinId) || 0
    const successRate = attempts > 0 ? (successes / attempts) * 100 : 0
    
    this.recordValue('successRate', skinId, successRate)
  }
  
  recordLoadFailure(skinId, error, userId = null) {
    this.increment('loadFailures', skinId)
    this.increment(`error_${error.type}`, skinId)
    
    // 에러 상세 정보 저장
    this.recordError(skinId, {
      type: error.type,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userId
    })
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalAttempts: this.sum('loadAttempts'),
        totalSuccesses: this.sum('loadSuccesses'),
        totalFailures: this.sum('loadFailures'),
        overallSuccessRate: this.calculateOverallSuccessRate()
      },
      skinBreakdown: this.generateSkinBreakdown(),
      errorAnalysis: this.generateErrorAnalysis(),
      performanceMetrics: this.generatePerformanceMetrics()
    }
    
    return report
  }
}
```

## 🚨 알림 시스템

### 1. 알림 규칙 정의

```yaml
# Prometheus Alert Rules
groups:
  - name: skin-system-alerts
    rules:
      - alert: SkinHighErrorRate
        expr: sum(rate(skin_requests_total{status=~"4..|5.."}[5m])) / sum(rate(skin_requests_total[5m])) > 0.01
        for: 2m
        labels:
          severity: warning
          service: skin-system
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for the last 5 minutes"
          
      - alert: SkinCriticalErrorRate
        expr: sum(rate(skin_requests_total{status=~"4..|5.."}[5m])) / sum(rate(skin_requests_total[5m])) > 0.05
        for: 1m
        labels:
          severity: critical
          service: skin-system
        annotations:
          summary: "Critical error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} - immediate action required"
          
      - alert: SkinSlowResponse
        expr: histogram_quantile(0.95, sum(rate(skin_request_duration_seconds_bucket[5m])) by (le)) > 1
        for: 5m
        labels:
          severity: warning
          service: skin-system
        annotations:
          summary: "Slow skin response times"
          description: "95th percentile response time is {{ $value }}s"
          
      - alert: SkinLoadFailures
        expr: increase(skin_load_failures_total[5m]) > 10
        for: 1m
        labels:
          severity: warning
          service: skin-system
        annotations:
          summary: "Multiple skin load failures"
          description: "{{ $value }} skin load failures in the last 5 minutes"
          
      - alert: CDNDown
        expr: up{job="cdn-health-check"} == 0
        for: 1m
        labels:
          severity: critical
          service: skin-system
        annotations:
          summary: "CDN health check failed"
          description: "CDN appears to be down - skin loading will be affected"
```

### 2. 알림 채널 설정

```javascript
// Slack 알림 통합
class AlertManager {
  constructor() {
    this.slackWebhook = process.env.SLACK_WEBHOOK_URL
    this.channels = {
      critical: '#skin-alerts-critical',
      warning: '#skin-alerts-warning', 
      info: '#skin-alerts-info'
    }
  }
  
  async sendAlert(alert) {
    const message = this.formatAlertMessage(alert)
    const channel = this.channels[alert.severity] || this.channels.info
    
    try {
      await this.sendSlackMessage(channel, message)
      
      // 중요한 알림은 SMS/전화도 발송
      if (alert.severity === 'critical') {
        await this.sendSMSAlert(alert)
        await this.createPagerDutyIncident(alert)
      }
      
    } catch (error) {
      console.error('Failed to send alert:', error)
      // 알림 발송 실패 시 대체 방법 사용
      await this.sendEmailAlert(alert)
    }
  }
  
  formatAlertMessage(alert) {
    const emoji = {
      critical: '🚨',
      warning: '⚠️',
      info: 'ℹ️'
    }[alert.severity] || 'ℹ️'
    
    return {
      channel: this.channels[alert.severity],
      username: 'Skin System Monitor',
      icon_emoji: ':warning:',
      attachments: [{
        color: this.getColorForSeverity(alert.severity),
        title: `${emoji} ${alert.summary}`,
        text: alert.description,
        fields: [
          {
            title: 'Severity',
            value: alert.severity.toUpperCase(),
            short: true
          },
          {
            title: 'Service',
            value: alert.service,
            short: true
          },
          {
            title: 'Time',
            value: new Date().toISOString(),
            short: true
          }
        ],
        actions: [
          {
            type: 'button',
            text: 'View Dashboard',
            url: 'https://grafana.example.com/d/skin-system'
          },
          {
            type: 'button', 
            text: 'Acknowledge',
            url: `https://alerts.example.com/ack/${alert.id}`
          }
        ]
      }]
    }
  }
}
```

## 🔧 자동화된 운영

### 1. 자동 스케일링

```javascript
// 트래픽 기반 자동 스케일링
class AutoScaler {
  constructor() {
    this.metrics = new MetricsCollector()
    this.scaleUpThreshold = 0.8
    this.scaleDownThreshold = 0.3
    this.cooldownPeriod = 300 // 5분
    this.lastScaleAction = 0
  }
  
  async checkAndScale() {
    const currentTime = Date.now()
    
    // 쿨다운 기간 확인
    if (currentTime - this.lastScaleAction < this.cooldownPeriod * 1000) {
      return
    }
    
    const currentLoad = await this.getCurrentLoad()
    const currentCapacity = await this.getCurrentCapacity()
    const utilization = currentLoad / currentCapacity
    
    if (utilization > this.scaleUpThreshold) {
      await this.scaleUp()
      this.lastScaleAction = currentTime
    } else if (utilization < this.scaleDownThreshold) {
      await this.scaleDown()
      this.lastScaleAction = currentTime
    }
  }
  
  async scaleUp() {
    console.log('🔼 Scaling up CDN capacity')
    
    // CDN 엣지 노드 추가 요청
    await this.addCDNEdgeNodes()
    
    // 백업 CDN 활성화
    await this.activateBackupCDN()
    
    // 알림 발송
    await this.sendScaleNotification('up')
  }
  
  async scaleDown() {
    console.log('🔽 Scaling down CDN capacity')
    
    // 점진적 스케일 다운
    await this.gradualScaleDown()
    
    // 알림 발송
    await this.sendScaleNotification('down')
  }
}
```

### 2. 자동 복구

```javascript
// 자동 복구 시스템
class AutoRecovery {
  constructor() {
    this.recoveryStrategies = new Map([
      ['high_error_rate', this.handleHighErrorRate.bind(this)],
      ['slow_response', this.handleSlowResponse.bind(this)],
      ['cdn_failure', this.handleCDNFailure.bind(this)],
      ['skin_load_failure', this.handleSkinLoadFailure.bind(this)]
    ])
  }
  
  async handleAlert(alert) {
    const strategy = this.recoveryStrategies.get(alert.type)
    
    if (strategy) {
      console.log(`🔧 Auto-recovering from ${alert.type}`)
      await strategy(alert)
    } else {
      console.log(`❓ No auto-recovery strategy for ${alert.type}`)
      await this.notifyOperators(alert)
    }
  }
  
  async handleHighErrorRate(alert) {
    // 1. 트래픽 일시 제한
    await this.enableRateLimit()
    
    // 2. 문제가 있는 스킨 식별
    const problematicSkins = await this.identifyProblematicSkins()
    
    // 3. 문제 스킨 일시 비활성화
    for (const skinId of problematicSkins) {
      await this.temporarilyDisableSkin(skinId)
    }
    
    // 4. 폴백 스킨으로 전환
    await this.enableFallbackSkins()
    
    // 5. 복구 확인
    await this.verifyRecovery()
  }
  
  async handleCDNFailure(alert) {
    // 1. 백업 CDN으로 즉시 전환
    await this.switchToBackupCDN()
    
    // 2. DNS 업데이트
    await this.updateDNSRecords()
    
    // 3. 캐시 워밍업
    await this.warmupBackupCDN()
    
    // 4. 메인 CDN 복구 모니터링
    this.startCDNRecoveryMonitoring()
  }
  
  async handleSkinLoadFailure(alert) {
    // 1. 캐시 무효화
    await this.invalidateCache(alert.skinId)
    
    // 2. 백업 버전으로 롤백
    await this.rollbackToLastKnownGood(alert.skinId)
    
    // 3. 문제 버전 조사
    await this.investigateFailedVersion(alert.skinId)
  }
}
```

## 📈 성능 최적화

### 1. 실시간 성능 분석

```javascript
// 성능 분석 시스템
class PerformanceAnalyzer {
  constructor() {
    this.metrics = new Map()
    this.thresholds = {
      loadTime: 200, // ms
      renderTime: 50, // ms
      bundleSize: 100 * 1024, // 100KB
      cacheHitRate: 0.95 // 95%
    }
  }
  
  analyzePerformance() {
    const analysis = {
      loadTimeAnalysis: this.analyzeLoadTimes(),
      bundleSizeAnalysis: this.analyzeBundleSizes(),
      cacheAnalysis: this.analyzeCachePerformance(),
      userExperienceAnalysis: this.analyzeUserExperience(),
      recommendations: []
    }
    
    // 성능 개선 권장사항 생성
    analysis.recommendations = this.generateRecommendations(analysis)
    
    return analysis
  }
  
  analyzeLoadTimes() {
    const loadTimes = this.getLoadTimeMetrics()
    
    return {
      p50: this.calculatePercentile(loadTimes, 0.5),
      p95: this.calculatePercentile(loadTimes, 0.95),
      p99: this.calculatePercentile(loadTimes, 0.99),
      slowSkins: this.identifySlowSkins(loadTimes),
      trendAnalysis: this.analyzeTrend(loadTimes)
    }
  }
  
  generateRecommendations(analysis) {
    const recommendations = []
    
    // 로드 시간 개선
    if (analysis.loadTimeAnalysis.p95 > this.thresholds.loadTime) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: 'Optimize slow-loading skins',
        description: `95th percentile load time (${analysis.loadTimeAnalysis.p95}ms) exceeds threshold`,
        actions: [
          'Enable compression for large bundles',
          'Implement code splitting',
          'Optimize asset loading order',
          'Consider moving to faster CDN'
        ]
      })
    }
    
    // 번들 크기 최적화
    const largeBundles = analysis.bundleSizeAnalysis.largeBundles
    if (largeBundles.length > 0) {
      recommendations.push({
        type: 'bundle-size',
        priority: 'medium',
        title: 'Reduce bundle sizes',
        description: `${largeBundles.length} skins exceed size threshold`,
        actions: [
          'Remove unused dependencies',
          'Implement tree shaking',
          'Use dynamic imports for non-critical code',
          'Optimize images and assets'
        ],
        affectedSkins: largeBundles
      })
    }
    
    // 캐시 최적화
    if (analysis.cacheAnalysis.hitRate < this.thresholds.cacheHitRate) {
      recommendations.push({
        type: 'caching',
        priority: 'high',
        title: 'Improve cache hit rate',
        description: `Cache hit rate (${analysis.cacheAnalysis.hitRate * 100}%) is below target`,
        actions: [
          'Review cache invalidation strategy',
          'Implement better cache warming',
          'Optimize cache key structure',
          'Consider longer cache TTL for stable content'
        ]
      })
    }
    
    return recommendations
  }
}
```

### 2. 자동 최적화

```javascript
// 자동 최적화 시스템
class AutoOptimizer {
  constructor() {
    this.optimizations = new Map([
      ['compress_assets', this.compressAssets.bind(this)],
      ['warm_cache', this.warmCache.bind(this)], 
      ['update_cdn_config', this.updateCDNConfig.bind(this)],
      ['optimize_routing', this.optimizeRouting.bind(this)]
    ])
  }
  
  async runOptimizations() {
    const performanceData = await this.gatherPerformanceData()
    const optimizationPlan = this.createOptimizationPlan(performanceData)
    
    for (const optimization of optimizationPlan) {
      try {
        await this.executeOptimization(optimization)
        await this.verifyOptimization(optimization)
      } catch (error) {
        console.error(`Optimization failed: ${optimization.type}`, error)
        await this.rollbackOptimization(optimization)
      }
    }
  }
  
  async compressAssets() {
    // 압축되지 않은 에셋 식별
    const uncompressedAssets = await this.findUncompressedAssets()
    
    for (const asset of uncompressedAssets) {
      // Gzip 압축 적용
      const compressed = await this.compressFile(asset, 'gzip')
      await this.uploadCompressedVersion(asset, compressed)
      
      // Brotli 압축도 적용 (지원하는 경우)
      if (this.supportsBrotli(asset)) {
        const brotliCompressed = await this.compressFile(asset, 'brotli')
        await this.uploadCompressedVersion(asset, brotliCompressed)
      }
    }
  }
  
  async warmCache() {
    // 인기 있는 스킨 식별
    const popularSkins = await this.getPopularSkins()
    
    // 주요 지역별로 캐시 워밍업
    const regions = ['us-east-1', 'eu-west-1', 'ap-southeast-1']
    
    for (const region of regions) {
      for (const skinId of popularSkins) {
        await this.warmCacheInRegion(skinId, region)
      }
    }
  }
}
```

## 🔍 장애 대응

### 1. 장애 분류 및 대응

```javascript
// 장애 대응 시스템
class IncidentResponse {
  constructor() {
    this.severityLevels = {
      P0: { // Critical
        responseTime: 15, // 15분
        description: '전체 서비스 중단',
        escalation: ['CTO', 'Engineering Manager', 'On-call Engineer']
      },
      P1: { // High
        responseTime: 60, // 1시간
        description: '주요 기능 영향',
        escalation: ['Engineering Manager', 'On-call Engineer']
      },
      P2: { // Medium
        responseTime: 240, // 4시간
        description: '일부 기능 영향',
        escalation: ['On-call Engineer']
      },
      P3: { // Low
        responseTime: 1440, // 24시간
        description: '미미한 영향',
        escalation: ['Team Lead']
      }
    }
  }
  
  async handleIncident(incident) {
    const severity = this.assessSeverity(incident)
    const response = this.severityLevels[severity]
    
    // 1. 즉시 알림
    await this.notifyStakeholders(incident, response.escalation)
    
    // 2. 자동 복구 시도
    const autoRecoveryResult = await this.attemptAutoRecovery(incident)
    
    if (!autoRecoveryResult.success) {
      // 3. 수동 개입 필요
      await this.escalateToHuman(incident, severity)
    }
    
    // 4. 사후 분석 일정
    await this.schedulePostMortem(incident)
  }
  
  assessSeverity(incident) {
    // 영향도와 긴급도 매트릭스
    const impact = this.calculateImpact(incident)
    const urgency = this.calculateUrgency(incident)
    
    if (impact >= 4 && urgency >= 4) return 'P0'
    if (impact >= 3 && urgency >= 3) return 'P1'
    if (impact >= 2 || urgency >= 2) return 'P2'
    return 'P3'
  }
  
  calculateImpact(incident) {
    const factors = {
      affectedUsers: incident.metrics.affectedUsers,
      errorRate: incident.metrics.errorRate,
      businessCritical: incident.isBusinessCritical,
      dataLoss: incident.hasDataLoss
    }
    
    let score = 0
    
    // 사용자 영향도
    if (factors.affectedUsers > 10000) score += 2
    else if (factors.affectedUsers > 1000) score += 1
    
    // 에러율 영향도
    if (factors.errorRate > 0.1) score += 2
    else if (factors.errorRate > 0.01) score += 1
    
    // 비즈니스 중요도
    if (factors.businessCritical) score += 2
    
    // 데이터 손실
    if (factors.dataLoss) score += 3
    
    return score
  }
}
```

### 2. 사후 분석 (Post-Mortem)

```markdown
# 장애 보고서 템플릿

## 요약
- **발생일시**: 2024-01-15 14:30 UTC
- **해결일시**: 2024-01-15 15:45 UTC
- **지속시간**: 1시간 15분
- **심각도**: P1
- **영향범위**: 로그인 스킨 로딩 실패

## 영향도
- **영향받은 사용자**: 약 5,000명
- **에러율**: 15%
- **수익 영향**: 약 $2,000

## 원인 분석
### 근본 원인
CDN 캐시 무효화 작업 중 설정 오류로 인한 잘못된 캐시 규칙 적용

### 기여 요인
1. 배포 시 캐시 검증 절차 부족
2. 모니터링 알림 임계값 설정 문제
3. 수동 캐시 무효화 프로세스의 오류 가능성

## 타임라인
- 14:30 - 배포 시작
- 14:32 - 캐시 무효화 실행
- 14:35 - 사용자 에러 보고 시작
- 14:40 - 모니터링 알림 발생
- 14:45 - 엔지니어 대응 시작
- 15:00 - 원인 파악 완료
- 15:15 - 캐시 설정 수정
- 15:30 - 복구 확인
- 15:45 - 완전 복구

## 해결 방법
1. 잘못된 캐시 규칙 롤백
2. 올바른 캐시 설정 재적용
3. 캐시 워밍업 실행

## 예방 조치
### 즉시 실행
- [ ] 배포 체크리스트에 캐시 검증 단계 추가
- [ ] 모니터링 알림 임계값 조정 (5분 → 2분)
- [ ] 캐시 설정 검증 자동화 도구 개발

### 장기 계획
- [ ] 배포 프로세스 자동화 확대
- [ ] 카나리 배포 도입으로 점진적 롤아웃
- [ ] 캐시 설정 변경 시 자동 검증 도구 구축

## 학습된 교훈
1. 수동 프로세스는 오류 가능성이 높다
2. 모니터링 알림이 너무 늦게 발생했다
3. 배포 검증 절차가 불충분했다

## 액션 아이템
| 액션 | 담당자 | 기한 | 상태 |
|------|--------|------|------|
| 캐시 검증 자동화 | Engineering Team | 2024-01-22 | 진행중 |
| 알림 임계값 조정 | DevOps Team | 2024-01-17 | 완료 |
| 배포 체크리스트 업데이트 | Release Team | 2024-01-16 | 완료 |
```

## 📚 운영 문서

### 운영 가이드 링크

1. **[모니터링 및 알림](./monitoring-alerts.md)** - 종합 모니터링 시스템
2. **[성능 최적화](./performance-optimization.md)** - 성능 튜닝 전략
3. **[문제 해결](./troubleshooting.md)** - 일반적인 문제와 해결방법
4. **[유지보수](./maintenance.md)** - 정기 유지보수 가이드
5. **[재해 복구](./disaster-recovery.md)** - 재해 복구 계획

### 운영 체크리스트

#### 일일 점검
- [ ] 시스템 상태 대시보드 확인
- [ ] 에러율 및 응답시간 검토
- [ ] 캐시 히트율 확인
- [ ] 새로운 알림 검토

#### 주간 점검  
- [ ] 성능 트렌드 분석
- [ ] 용량 계획 검토
- [ ] 보안 업데이트 확인
- [ ] 백업 상태 검증

#### 월간 점검
- [ ] 전체 시스템 리뷰
- [ ] 비용 최적화 검토
- [ ] 재해 복구 테스트
- [ ] 팀 교육 및 지식 공유

---

> **💡 핵심 포인트**: 효과적인 운영은 **예방적 모니터링, 신속한 대응, 지속적인 개선**을 통해 달성됩니다. 자동화를 통해 휴먼 에러를 줄이고, 체계적인 프로세스로 안정성을 확보하세요.