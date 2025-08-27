# 🌐 CDN 호스팅 가이드

이 가이드는 스킨 파일을 CDN에 호스팅하여 최적의 성능과 안정성을 확보하는 방법을 다룹니다.

## 🎯 CDN 호스팅 이점

### 성능 향상
- **전 세계 엣지 로케이션**: 사용자에게 가장 가까운 서버에서 파일 제공
- **캐싱 최적화**: 정적 파일의 효율적인 캐싱으로 로딩 속도 향상
- **압축 및 최적화**: 자동 파일 압축 및 이미지 최적화

### 안정성 증대
- **높은 가용성**: 99.9% 이상의 업타임 보장
- **자동 장애 복구**: 서버 장애 시 자동으로 다른 엣지로 라우팅
- **DDoS 보호**: 내장된 DDoS 공격 방어

### 비용 효율성
- **트래픽 기반 과금**: 사용한 만큼만 비용 지불
- **오리진 서버 부하 감소**: CDN이 대부분의 요청 처리
- **인프라 관리 불필요**: 서버 운영 및 유지보수 부담 없음

## 🏗️ 주요 CDN 서비스 비교

### AWS CloudFront

#### 장점
- ✅ 전 세계 400+ 엣지 로케이션
- ✅ Lambda@Edge로 고급 로직 처리 가능
- ✅ AWS 생태계와 완벽 통합
- ✅ 실시간 로그 및 메트릭

#### 단점
- ❌ 설정이 복잡할 수 있음
- ❌ 초기 학습 곡선 있음

#### 가격 구조
```
데이터 전송:
- 첫 10TB/월: $0.085/GB
- 다음 40TB/월: $0.080/GB
- 이후 점차 할인

요청 수:
- HTTP 요청: $0.0075/10,000 requests
- HTTPS 요청: $0.0100/10,000 requests
```

### Cloudflare

#### 장점
- ✅ 무료 플랜 제공
- ✅ 강력한 보안 기능
- ✅ 쉬운 설정 및 관리
- ✅ 실시간 분석 대시보드

#### 단점
- ❌ 일부 고급 기능은 유료
- ❌ 커스터마이징 제한

#### 가격 구조
```
Free 플랜:
- 무제한 대역폭
- 기본 보안 기능
- 3 페이지 규칙

Pro 플랜 ($20/월):
- 고급 보안 기능
- 20 페이지 규칙
- Polish (이미지 최적화)
```

### Azure CDN

#### 장점
- ✅ Microsoft 생태계 통합
- ✅ 다양한 가격 티어
- ✅ Azure 서비스와 연동
- ✅ 엔터프라이즈 급 보안

#### 단점
- ❌ 상대적으로 적은 엣지 로케이션
- ❌ 복잡한 가격 체계

### Google Cloud CDN

#### 장점
- ✅ Google의 글로벌 네트워크 활용
- ✅ GCP 서비스와 통합
- ✅ 예측 가능한 가격
- ✅ 고성능 캐싱

#### 단점
- ❌ 상대적으로 높은 진입 장벽
- ❌ 제한적인 무료 티어

## 🚀 AWS CloudFront 배포 가이드

### 1. S3 버킷 설정

```bash
# AWS CLI로 S3 버킷 생성
aws s3 mb s3://my-skin-cdn-bucket

# 버킷 정책 설정 (public read 허용)
aws s3api put-bucket-policy --bucket my-skin-cdn-bucket --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-skin-cdn-bucket/*"
    }
  ]
}'

# CORS 설정
aws s3api put-bucket-cors --bucket my-skin-cdn-bucket --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}'
```

### 2. CloudFront 배포 설정

```json
{
  "CallerReference": "skin-cdn-2024",
  "Aliases": {
    "Quantity": 1,
    "Items": ["skins.mydomain.com"]
  },
  "DefaultRootObject": "index.html",
  "Comment": "WithCookie Skin CDN",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-my-skin-cdn-bucket",
        "DomainName": "my-skin-cdn-bucket.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-my-skin-cdn-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      },
      "Headers": {
        "Quantity": 2,
        "Items": ["Origin", "Access-Control-Request-Method"]
      }
    }
  },
  "CacheBehaviors": {
    "Quantity": 2,
    "Items": [
      {
        "PathPattern": "*.js",
        "TargetOriginId": "S3-my-skin-cdn-bucket",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "DefaultTTL": 31536000,
        "MaxTTL": 31536000,
        "Compress": true
      },
      {
        "PathPattern": "*.css",
        "TargetOriginId": "S3-my-skin-cdn-bucket",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "DefaultTTL": 31536000,
        "MaxTTL": 31536000,
        "Compress": true
      }
    ]
  }
}
```

### 3. 자동 배포 스크립트

```bash
#!/bin/bash
# deploy-to-cloudfront.sh

set -e

# 설정 변수
BUCKET_NAME="my-skin-cdn-bucket"
DISTRIBUTION_ID="E1234567890ABC"
LOCAL_DIR="./dist"
VERSION=$(git describe --tags --always)

echo "🚀 Starting deployment for version: $VERSION"

# 1. 빌드 생성
echo "📦 Building assets..."
npm run build

# 2. 버전별 디렉토리에 업로드
echo "📤 Uploading to S3..."
aws s3 sync $LOCAL_DIR/ s3://$BUCKET_NAME/$VERSION/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --metadata-directive REPLACE

# 3. latest 태그 업데이트
echo "🔗 Updating latest version..."
aws s3 sync s3://$BUCKET_NAME/$VERSION/ s3://$BUCKET_NAME/latest/ \
  --delete

# 4. CloudFront 캐시 무효화
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/latest/*"

# 5. 배포 완료 알림
echo "✅ Deployment completed successfully!"
echo "🌐 CDN URL: https://skins.mydomain.com/latest/"
echo "📊 CloudFront Console: https://console.aws.amazon.com/cloudfront/home#distribution-settings:$DISTRIBUTION_ID"

# 6. Health Check
echo "🏥 Running health check..."
HEALTH_URL="https://skins.mydomain.com/latest/health.json"
if curl -s $HEALTH_URL | grep -q "ok"; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  exit 1
fi
```

### 4. Health Check 파일

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "cdn": "cloudfront",
  "checksums": {
    "my-skin.umd.js": "sha256-abc123...",
    "my-skin.css": "sha256-def456..."
  }
}
```

## 🌊 Cloudflare 배포 가이드

### 1. Cloudflare 설정

```javascript
// wrangler.toml (Cloudflare Workers 설정)
name = "skin-cdn"
type = "javascript"
zone_id = "your-zone-id"
account_id = "your-account-id"
route = "skins.mydomain.com/*"

[env.production]
name = "skin-cdn-prod"
routes = [
  { pattern = "skins.mydomain.com/*", zone_id = "your-zone-id" }
]
```

### 2. Worker 스크립트

```javascript
// worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 보안 헤더 추가
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  })
  
  // 파일 타입별 Content-Type 설정
  const extension = url.pathname.split('.').pop()
  const contentTypes = {
    'js': 'application/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'svg': 'image/svg+xml'
  }
  
  if (contentTypes[extension]) {
    headers.set('Content-Type', contentTypes[extension])
  }
  
  // 압축 지원
  const acceptEncoding = request.headers.get('Accept-Encoding') || ''
  if (acceptEncoding.includes('gzip')) {
    headers.set('Content-Encoding', 'gzip')
  }
  
  return fetch(request, { headers })
}
```

### 3. 페이지 규칙 설정

```javascript
// Cloudflare API를 통한 페이지 규칙 설정
const pageRules = [
  {
    targets: [{ target: 'url', constraint: { operator: 'matches', value: 'skins.mydomain.com/*.js' }}],
    actions: [
      { id: 'cache_level', value: 'cache_everything' },
      { id: 'browser_cache_ttl', value: 31536000 },
      { id: 'edge_cache_ttl', value: 31536000 }
    ]
  },
  {
    targets: [{ target: 'url', constraint: { operator: 'matches', value: 'skins.mydomain.com/*.css' }}],
    actions: [
      { id: 'cache_level', value: 'cache_everything' },
      { id: 'browser_cache_ttl', value: 31536000 },
      { id: 'edge_cache_ttl', value: 31536000 }
    ]
  }
]
```

## 📊 성능 최적화

### 1. 캐시 최적화

```javascript
// 파일 타입별 캐시 전략
const cacheStrategies = {
  // 불변 파일 - 해시 포함 파일명
  immutable: {
    pattern: /\.[a-f0-9]{8}\.(js|css)$/,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    }
  },
  
  // 버전 파일 - 긴 캐시
  versioned: {
    pattern: /\/v[\d.]+\//,
    headers: {
      'Cache-Control': 'public, max-age=2592000', // 30일
    }
  },
  
  // latest 파일 - 짧은 캐시
  latest: {
    pattern: /\/latest\//,
    headers: {
      'Cache-Control': 'public, max-age=300', // 5분
    }
  }
}
```

### 2. 압축 설정

```nginx
# nginx.conf (자체 서버 운영 시)
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
  application/javascript
  application/json
  text/css
  text/plain
  text/xml
  application/xml
  application/xml+rss;

# Brotli 압축 (더 효율적)
brotli on;
brotli_comp_level 6;
brotli_types
  application/javascript
  application/json
  text/css
  text/plain;
```

### 3. HTTP/2 Push

```javascript
// HTTP/2 Server Push를 위한 Link 헤더
const generatePushHeaders = (mainFile) => {
  const dependencies = analyzeDependencies(mainFile)
  
  return dependencies.map(dep => 
    `<${dep.url}>; rel=preload; as=${dep.type}; crossorigin`
  ).join(', ')
}

// 사용 예시
headers.set('Link', generatePushHeaders('my-skin.umd.js'))
```

## 🔒 보안 설정

### 1. CORS 정책

```javascript
// 엄격한 CORS 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Expose-Headers': 'Content-Length, Date, Server'
}

// 동적 Origin 검증
function validateOrigin(origin, allowedOrigins) {
  if (allowedOrigins.includes('*')) return true
  
  return allowedOrigins.some(allowed => {
    if (allowed.startsWith('*.')) {
      const domain = allowed.slice(2)
      return origin.endsWith(domain)
    }
    return origin === allowed
  })
}
```

### 2. 무결성 검증

```javascript
// 파일 무결성 검증을 위한 해시 생성
const crypto = require('crypto')

function generateFileHash(fileContent) {
  return crypto
    .createHash('sha256')
    .update(fileContent)
    .digest('base64')
}

// Subresource Integrity 헤더
function generateSRIHeaders(files) {
  const integrity = files.map(file => ({
    url: file.url,
    integrity: `sha256-${generateFileHash(file.content)}`
  }))
  
  return integrity
}
```

### 3. Rate Limiting

```javascript
// Cloudflare Worker를 이용한 Rate Limiting
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = new Map()
  }
  
  isAllowed(clientIP) {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    // 이전 요청 기록 정리
    const clientRequests = this.requests.get(clientIP) || []
    const validRequests = clientRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(clientIP, validRequests)
    return true
  }
}
```

## 📈 모니터링 및 분석

### 1. 실시간 메트릭

```javascript
// CloudWatch 커스텀 메트릭 전송
const AWS = require('aws-sdk')
const cloudwatch = new AWS.CloudWatch()

async function sendMetrics(metricData) {
  const params = {
    Namespace: 'SkinCDN',
    MetricData: [
      {
        MetricName: 'RequestCount',
        Value: metricData.requests,
        Unit: 'Count',
        Timestamp: new Date()
      },
      {
        MetricName: 'ResponseTime',
        Value: metricData.responseTime,
        Unit: 'Milliseconds',
        Timestamp: new Date()
      }
    ]
  }
  
  return cloudwatch.putMetricData(params).promise()
}
```

### 2. 로그 분석

```javascript
// 구조화된 로깅
function logRequest(request, response, startTime) {
  const logData = {
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('User-Agent'),
    referer: request.headers.get('Referer'),
    statusCode: response.status,
    responseTime: Date.now() - startTime,
    cacheStatus: response.headers.get('CF-Cache-Status'),
    country: request.cf?.country,
    clientIP: request.headers.get('CF-Connecting-IP')
  }
  
  console.log(JSON.stringify(logData))
}
```

## 🔄 배포 자동화

### 1. GitHub Actions 워크플로우

```yaml
# .github/workflows/deploy-cdn.yml
name: Deploy to CDN
on:
  push:
    tags: ['v*']
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment || 'production' }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test
        
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
          
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ vars.S3_BUCKET }}/${{ github.ref_name }}/ \
            --delete \
            --cache-control "public, max-age=31536000, immutable"
            
      - name: Update latest
        if: github.event.inputs.environment == 'production'
        run: |
          aws s3 sync s3://${{ vars.S3_BUCKET }}/${{ github.ref_name }}/ \
            s3://${{ vars.S3_BUCKET }}/latest/ \
            --delete
            
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ vars.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/latest/*"
            
      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 2. 롤백 스크립트

```bash
#!/bin/bash
# rollback-cdn.sh

PREVIOUS_VERSION=${1:-$(git describe --tags --abbrev=0 HEAD~1)}
BUCKET_NAME="my-skin-cdn-bucket"
DISTRIBUTION_ID="E1234567890ABC"

echo "🔄 Rolling back to version: $PREVIOUS_VERSION"

# 1. 이전 버전 확인
if ! aws s3 ls s3://$BUCKET_NAME/$PREVIOUS_VERSION/ > /dev/null 2>&1; then
  echo "❌ Version $PREVIOUS_VERSION not found in S3"
  exit 1
fi

# 2. latest를 이전 버전으로 되돌리기
echo "📤 Restoring from $PREVIOUS_VERSION..."
aws s3 sync s3://$BUCKET_NAME/$PREVIOUS_VERSION/ s3://$BUCKET_NAME/latest/ \
  --delete

# 3. CloudFront 캐시 무효화
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/latest/*"

# 4. 헬스 체크
echo "🏥 Running health check..."
sleep 10
if curl -s "https://skins.mydomain.com/latest/health.json" | grep -q "ok"; then
  echo "✅ Rollback completed successfully"
else
  echo "❌ Rollback failed - health check failed"
  exit 1
fi
```

---

> **💡 핵심 포인트**: CDN 호스팅은 **성능, 안정성, 확장성**을 모두 제공하는 최적의 배포 방식입니다. 적절한 캐시 전략과 보안 설정을 통해 프로덕션 수준의 서비스를 제공할 수 있습니다.