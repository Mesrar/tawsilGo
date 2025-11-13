# TawsilGo - Parcel Delivery Platform

TawsilGo is a comprehensive parcel delivery and logistics platform connecting customers with drivers for seamless package delivery between Europe and Morocco. Built with Next.js 15, it features real-time tracking, integrated payments, and interactive route visualization.

## 🚀 Features

- **Customer Portal**: Book deliveries, track parcels in real-time, manage orders
- **Driver Dashboard**: Accept trips, manage deliveries, QR code parcel verification
- **Real-time Tracking**: Live location updates with interactive maps (Leaflet)
- **Secure Payments**: Integrated Stripe payment processing
- **Multi-language Support**: Internationalization with next-intl (including Arabic RTL)
- **Role-based Access**: Separate interfaces for customers and drivers
- **Responsive Design**: Mobile-first PWA-ready design

## 🛠️ Tech Stack

### Core
- **Framework**: Next.js 15.1.5 (App Router with Turbopack)
- **React**: 19.0.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS with Radix UI components

### Authentication & State
- **Auth**: NextAuth.js v4 (JWT strategy)
- **Server State**: TanStack Query (React Query) v5
- **Form Management**: React Hook Form + Zod validation

### Maps & Routing
- **Maps**: Leaflet v1.9.4 with React Leaflet
- **Routing**: Geoapify API integration
- **Drawing**: Leaflet Draw for route creation

### Payments & APIs
- **Payments**: Stripe integration
- **API Client**: Centralized client with auto token refresh
- **Backend**: Microservices architecture (Auth, Parcel, Payment, Driver services)

### Testing & Quality
- **Unit/Integration**: Jest with 80% coverage threshold
- **E2E Testing**: Playwright (Chrome, Firefox, Safari, Mobile)
- **Linting**: ESLint with Next.js rules
- **Formatting**: Prettier

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend microservices running (see backend repository)
- Stripe account (for payment processing)

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd nextjs-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-64>
NEXTAUTH_URL=http://localhost:3000

# Backend Services (ensure these are running)
VERIFY_API_URL=http://localhost:8082
PARCEL_API_URL=http://localhost:8085/api/v1
PAYMENT_API_URL=http://localhost:8086/api/v1
DRIVER_API_URL=http://localhost:8084

# Stripe (get from dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# JWT Secret (should match backend)
JWT_SECRET_KEY=<generate-with-openssl-rand-base64-64>
```

**Important**: Never commit `.env.local` - it's already in `.gitignore`

### 4. Run Backend Services

Ensure all backend microservices are running on their respective ports:
- Auth Service: `http://localhost:8082`
- Parcel Service: `http://localhost:8085`
- Payment Service: `http://localhost:8086`
- Driver Service: `http://localhost:8084`

Refer to the backend repository for setup instructions.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server (with Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Testing
```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report (80% threshold)
npm run test:unit    # Run unit tests only
npm run test:integration # Run integration tests
npm run test:e2e     # Run Playwright E2E tests
```

### Cleanup
```bash
npm run clean        # Remove build artifacts
```

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── (site)/            # Main site route group
│   ├── api/               # API routes (legacy Pages Router)
│   ├── drivers/           # Driver-only routes
│   ├── users/             # Customer-only routes
│   └── services/          # API service layer
├── components/            # React components
│   ├── Auth/             # Authentication components
│   ├── Booking/          # Booking flow components
│   ├── Customer/         # Customer portal components
│   ├── Driver/           # Driver dashboard components
│   ├── Map/              # Leaflet map components
│   ├── Payment/          # Payment components
│   └── ui/               # Radix UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
│   ├── api/              # API client
│   ├── auth-context.tsx  # Auth state management
│   └── utils.ts          # Helper functions
├── pages/api/            # Backend API proxy routes
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── __tests__/            # Test files

```

## 🔐 Authentication & Authorization

### Flow
1. Users log in via `/auth/login` (NextAuth.js)
2. JWT tokens stored in HTTP-only cookies
3. Middleware (`middleware.ts`) protects routes by role:
   - `/users/*` → Customer role required
   - `/drivers/*` → Driver role required
4. API client auto-injects tokens and handles refresh

### Role-based Routing
- **Customers**: Access booking, tracking, payment pages
- **Drivers**: Access dashboard, trip management, parcel verification

## 🗺️ Map Features

Leaflet is client-side only - always use dynamic imports:

```typescript
const DynamicMap = dynamic(() => import('@/components/Map/RouteMap'), {
  ssr: false,
});
```

**Key Components**:
- `RouteMap`: Display routes with polylines
- `TripMap`: Show trip details with markers
- `DynamicTripMap`: Real-time trip tracking

## 💳 Payment Flow

1. Create payment record → `paymentService.createPayment()`
2. Get Stripe client secret → `paymentService.createPaymentIntent()`
3. Collect payment via Stripe Elements
4. Verify payment → `paymentService.verifyPayment()`
5. Update booking status

## 📱 Mobile & PWA

- Mobile-first responsive design
- Custom `useMobile()` hook for viewport detection
- Touch-optimized interfaces
- QR code scanning for drivers
- Swipeable components

## 🧪 Testing

### Run Tests
```bash
# Unit & Integration tests with coverage
npm run test:coverage

# E2E tests (requires backend services running)
npm run test:e2e
```

### Coverage Thresholds
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)**: Comprehensive project architecture and patterns
- **[docs/](./docs/)**: Additional implementation guides and specifications

## 🚀 Deployment

### Vercel (Recommended)

1. **Create Vercel Account**: Visit [vercel.com](https://vercel.com)

2. **Import Repository**:
   - Click "New Project"
   - Import your GitHub repository
   - Framework preset: Next.js (auto-detected)

3. **Configure Environment Variables**:
   Add all variables from `.env.example` in Vercel dashboard:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production domain)
   - `VERIFY_API_URL` (production backend URL)
   - `PARCEL_API_URL`
   - `PAYMENT_API_URL`
   - `DRIVER_API_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `JWT_SECRET_KEY`

4. **Deploy**: Click "Deploy"

5. **Configure Domain**: Add your custom domain in Vercel settings

### Environment-Specific Configuration

**Production**: Update API URLs to production backend endpoints
**Staging**: Use staging backend URLs for testing

## 🔄 CI/CD

GitHub Actions workflow runs on every push/PR:
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Unit & Integration tests
- ✅ Build verification

See `.github/workflows/ci.yml` for configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Quality
- Follow TypeScript strict mode
- Maintain 80%+ test coverage
- Run `npm run lint` before committing
- Use conventional commit messages

## 📄 License

[Add your license here]

## 👥 Authors

[Add your team information here]

## 🐛 Issues & Support

Report issues on [GitHub Issues](your-repo-url/issues)

## 🔗 Links

- [Backend Repository](link-to-backend-repo)
- [API Documentation](link-to-api-docs)
- [Design System](link-to-design-docs)

---

Built with ❤️ using Next.js and TypeScript
