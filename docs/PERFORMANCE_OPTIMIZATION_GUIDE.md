# TawsilGo Performance Optimization Guide

## Overview

This guide covers comprehensive performance optimization strategies for the TawsilGo multi-profile logistics platform, including frontend optimization, backend performance, and end-to-end workflow optimization.

## Table of Contents

1. [Frontend Performance](#frontend-performance)
2. [Backend Performance](#backend-performance)
3. [Database Optimization](#database-optimization)
4. [API Performance](#api-performance)
5. [Mobile Performance](#mobile-performance)
6. [Monitoring and Analytics](#monitoring-and-analytics)
7. [Performance Testing](#performance-testing)
8. [Deployment Optimization](#deployment-optimization)

## Frontend Performance

### Code Splitting and Lazy Loading

#### Route-based Code Splitting
```typescript
// Next.js automatic code splitting for pages
// Already implemented by Next.js App Router

// Dynamic imports for heavy components
const DynamicMap = dynamic(() => import('@/components/Map/RouteMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

const DynamicChart = dynamic(() => import('@/components/Charts/FleetChart'), {
  loading: () => <ChartSkeleton />,
});
```

#### Component-level Code Splitting
```typescript
// Split organization-specific components
const OrganizationRegistration = dynamic(
  () => import('@/app/[locale]/(site)/organizations/register/page'),
  { loading: () => <RegistrationSkeleton /> }
);

const FleetManagement = dynamic(
  () => import('@/app/[locale]/(site)/organizations/fleet/page'),
  { loading: () => <FleetSkeleton /> }
);
```

### Image Optimization

#### Next.js Image Component
```typescript
import Image from 'next/image';

// Optimized organization logos and vehicle images
<Image
  src="/vehicles/truck.jpg"
  alt="Delivery Truck"
  width={400}
  height={300}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### Image Optimization Strategy
- **WebP Format**: Use WebP for modern browsers
- **Responsive Images**: Multiple sizes for different viewports
- **Lazy Loading**: Below-the-fold images
- **CDN Integration**: Serve images from CDN

### Bundle Optimization

#### Webpack Configuration
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'date-fns',
      'recharts'
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
};
```

#### Tree Shaking
```typescript
// Import only what you need
import { Truck, Package, MapPin } from 'lucide-react';
// Instead of
import * as Icons from 'lucide-react';

// Use specific functions from libraries
import { format } from 'date-fns';
// Instead of
import * as dateFns from 'date-fns';
```

### Caching Strategy

#### React Query Configuration
```typescript
// lib/react-query-config.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Smart cache keys
export const queryKeys = {
  organizations: ['organizations'],
  organization: (id: string) => ['organizations', id],
  fleet: (orgId: string) => ['organizations', orgId, 'fleet'],
  trips: (orgId: string, params?: any) => ['organizations', orgId, 'trips', params],
  vehicles: (orgId: string) => ['organizations', orgId, 'vehicles'],
};
```

#### Service Worker Caching
```typescript
// public/sw.js
const CACHE_NAME = 'tawsgo-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/auth/signin',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});
```

## Backend Performance

### API Optimization

#### Database Connection Pooling
```typescript
// lib/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

#### Redis Caching Layer
```typescript
// lib/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

export const cacheService = {
  async get(key: string) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl: number = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string) {
    await redis.del(key);
  },
};
```

#### API Response Optimization
```typescript
// lib/api-optimization.ts
import compression from 'compression';

// Response compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024,
}));

// Response caching middleware
const cacheResponse = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedBody = cache.get(key);

    if (cachedBody) {
      res.send(cachedBody);
      return;
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body, { ttl: duration * 1000 });
      res.sendResponse(body);
    };

    next();
  };
};
```

### Database Optimization

#### Query Optimization
```sql
-- Indexes for organization queries
CREATE INDEX idx_organizations_admin_id ON organizations(admin_id);
CREATE INDEX idx_organizations_status ON organizations(verification_status, is_active);
CREATE INDEX idx_organization_vehicles_org_id ON organization_vehicles(organization_id);
CREATE INDEX idx_organization_vehicles_status ON organization_vehicles(status, is_available);
CREATE INDEX idx_organization_trips_org_id ON organization_trips(organization_id);
CREATE INDEX idx_organization_trips_status ON organization_trips(status, departure_time);
CREATE INDEX idx_organization_drivers_org_id ON organization_drivers(organization_id);
CREATE INDEX idx_organization_drivers_status ON organization_drivers(status, is_verified);

-- Composite indexes for common queries
CREATE INDEX idx_trips_org_status_date ON organization_trips(organization_id, status, departure_time);
CREATE INDEX idx_vehicles_org_available ON organization_vehicles(organization_id, is_available, status);
```

#### Query Pagination
```typescript
// lib/pagination.ts
export class PaginationService {
  static async paginate<T>(
    query: any,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: T[]; pagination: any }> {
    const offset = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      query.limit(limit).offset(offset),
      query.count() as Promise<number>
    ]);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page * limit < totalCount,
        hasPreviousPage: page > 1,
      },
    };
  }
}
```

## API Performance

### Request Optimization

#### Batch Requests
```typescript
// app/api/batch/route.ts
export async function POST(request: Request) {
  const { requests } = await request.json();

  const results = await Promise.allSettled(
    requests.map(async (req: any) => {
      switch (req.endpoint) {
        case '/organizations/current':
          return organizationService.getCurrentOrganization();
        case '/organizations/fleet':
          return fleetService.getFleetOverview();
        case '/organizations/trips':
          return organizationService.getTrips(req.params);
        default:
          throw new Error(`Unknown endpoint: ${req.endpoint}`);
      }
    })
  );

  return Response.json({
    results: results.map(result => ({
      status: result.status,
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    })),
  });
}
```

#### Request Debouncing
```typescript
// lib/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Usage in search components
const debouncedSearch = debounce(
  (query: string) => searchOrganizations(query),
  300
);
```

### Response Compression

#### Gzip Compression
```typescript
// middleware.ts
import compression from 'compression';

app.use(compression({
  threshold: 1024,
  level: 6,
  memLevel: 8,
}));
```

## Mobile Performance

### Responsive Image Optimization
```typescript
// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimimizedImage({
  src,
  alt,
  width,
  height,
  priority = false
}: OptimizedImageProps) {
  return (
    <picture>
      <source
        srcSet={`${src}?format=webp&w=${width}&h=${height}`}
        type="image/webp"
      />
      <source
        srcSet={`${src}?format=jpg&w=${width}&h=${height}`}
        type="image/jpeg"
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </picture>
  );
}
```

### Touch Optimization
```typescript
// hooks/useTouchOptimized.ts
export function useTouchOptimized() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });

    return () => window.removeEventListener('touchstart', checkTouch);
  }, []);

  return {
    isTouch,
    touchProps: isTouch ? {
      style: {
        minHeight: '44px',
        minWidth: '44px',
        padding: '12px 16px'
      }
    } : {}
  };
}
```

## Monitoring and Analytics

### Performance Monitoring
```typescript
// lib/performance-monitoring.ts
export class PerformanceMonitor {
  static measurePageLoad(pageName: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      const metrics = {
        page: pageName,
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.navigationStart,
      };

      this.sendMetrics(metrics);
    }
  }

  static measureComponentRender(componentName: string, renderTime: number) {
    this.sendMetrics({
      type: 'component_render',
      component: componentName,
      renderTime,
    });
  }

  private static async sendMetrics(metrics: any) {
    if (process.env.NODE_ENV === 'production') {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        body: JSON.stringify(metrics),
      });
    }
  }
}
```

### Error Tracking
```typescript
// lib/error-tracking.ts
export class ErrorTracker {
  static trackError(error: Error, context?: any) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.sendError(errorData);
  }

  static trackApiError(endpoint: string, error: any, request?: any) {
    this.trackError(new Error(`API Error: ${endpoint}`), {
      endpoint,
      error,
      request,
    });
  }

  private static async sendError(errorData: any) {
    try {
      await fetch('/api/analytics/error', {
        method: 'POST',
        body: JSON.stringify(errorData),
      });
    } catch (e) {
      console.error('Failed to send error data:', e);
    }
  }
}
```

## Performance Testing

### Load Testing
```typescript
// tests/load/api-load-test.ts
import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

export default function() {
  // Test organization endpoints
  let response = http.get('http://localhost:3000/api/organizations/current');
  check(response, {
    'organizations/current status is 200': (r) => r.status === 200,
    'organizations/current response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Test fleet endpoints
  response = http.get('http://localhost:3000/api/organizations/fleet');
  check(response, {
    'fleet status is 200': (r) => r.status === 200,
    'fleet response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
```

### Frontend Performance Testing
```typescript
// tests/performance/lighthouse.ts
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { writeFileSync } from 'fs';

async function runLighthouseAudit(url: string) {
  const chrome = await launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info' as const,
    output: 'json' as const,
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  await chrome.kill();

  if (runnerResult) {
    const { lhr } = runnerResult;
    console.log(`Performance score: ${lhr.categories.performance.score * 100}`);

    // Save detailed report
    writeFileSync(`lighthouse-report-${Date.now()}.json`, JSON.stringify(lhr, null, 2));
  }
}

// Run audits for key pages
['/', '/organizations/register', '/dashboard', '/organizations/fleet'].forEach(runLighthouseAudit);
```

## Deployment Optimization

### Production Build Optimization
```javascript
// next.config.js
module.exports = {
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'date-fns',
      'recharts',
      'framer-motion',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};
```

### CDN Configuration
```typescript
// lib/cdn-config.ts
export const CDN_CONFIG = {
  baseUrl: process.env.CDN_URL || 'https://cdn.tawsgo.com',
  imageCompression: {
    quality: 85,
    progressive: true,
  },
  caching: {
    maxAge: 31536000, // 1 year
    immutable: true,
  },
};

// Optimized asset URL generation
export function getAssetUrl(path: string): string {
  return `${CDN_CONFIG.baseUrl}${path}`;
}
```

### Docker Optimization
```dockerfile
# Multi-stage Dockerfile for production
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS builder
COPY . .
RUN npm ci
RUN npm run build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## Performance Metrics and KPIs

### Key Performance Indicators
- **Page Load Time**: < 2 seconds for all pages
- **Time to Interactive**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **API Response Time**: < 500ms for 95% of requests
- **Database Query Time**: < 100ms average
- **Cache Hit Rate**: > 90%
- **Error Rate**: < 1%

### Monitoring Dashboard
```typescript
// components/PerformanceDashboard.tsx
export function PerformanceDashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: fetchPerformanceMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="performance-dashboard">
      <MetricCard
        title="Page Load Time"
        value={metrics?.pageLoadTime}
        unit="ms"
        target={2000}
      />
      <MetricCard
        title="API Response Time"
        value={metrics?.apiResponseTime}
        unit="ms"
        target={500}
      />
      <MetricCard
        title="Cache Hit Rate"
        value={metrics?.cacheHitRate}
        unit="%"
        target={90}
      />
      <MetricCard
        title="Error Rate"
        value={metrics?.errorRate}
        unit="%"
        target={1}
        inverse
      />
    </div>
  );
}
```

This performance optimization guide provides comprehensive strategies for ensuring the TawsilGo platform delivers optimal performance across all user profiles and devices.