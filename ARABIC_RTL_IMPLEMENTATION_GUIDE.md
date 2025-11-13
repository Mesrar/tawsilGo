# Arabic RTL Implementation Guide - Remaining Work

## ✅ Completed Pages (100%)
1. **Support Page** - `/ar/support` - Fully translated and tested
2. **Tracking Page** - `/ar/tracking` - Fully translated and tested
3. **Pricing Page** - `/ar/pricing` - 90% complete (main sections done)

## 🔄 Remaining Service Pages

### Pattern to Follow (Same for all 3 pages)

#### 1. Individual Shipping Page
**File:** `/app/[locale]/(site)/services/individual-shipping/page.tsx`

**Add at top (after imports):**
```typescript
import { useTranslations, useLocale } from 'next-intl';
```

**Add inside component:**
```typescript
export default function IndividualShippingPage() {
  const t = useTranslations('services.individualShipping');
  const locale = useLocale();
  const isRTL = locale === 'ar';
```

**Wrap main element:**
```typescript
return (
  <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
```

**Update features array (lines 24-55):**
```typescript
const features = [
  {
    icon: <Package className="h-6 w-6" />,
    title: t('features.doorToDoor.title'),
    description: t('features.doorToDoor.description'),
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: t('features.fastDelivery.title'),
    description: t('features.fastDelivery.description'),
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: t('features.insurance.title'),
    description: t('features.insurance.description'),
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: t('features.tracking.title'),
    description: t('features.tracking.description'),
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: t('features.cities.title'),
    description: t('features.cities.description'),
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: t('features.verified.title'),
    description: t('features.verified.description'),
  },
];
```

**Update hero section (lines 118-127):**
```typescript
<Badge className="mb-4 bg-moroccan-mint text-white border-none">
  {t('hero.badge')}
</Badge>
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
  {t('hero.title')}
  <span className="block text-moroccan-mint mt-2">{t('hero.titleHighlight')}</span>
</h1>
<p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto">
  {t('hero.subtitle')}
</p>
```

**Update buttons with RTL icons:**
```typescript
<Button ...>
  <Link href="/booking">
    {t('hero.bookNow')}
    <ChevronRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
  </Link>
</Button>
```

**Update use cases (lines 57-73):**
```typescript
const useCases = [
  {
    icon: <Heart className="h-5 w-5" />,
    title: t('useCases.carePackages.title'),
    example: t('useCases.carePackages.example'),
  },
  {
    icon: <Gift className="h-5 w-5" />,
    title: t('useCases.gifts.title'),
    example: t('useCases.gifts.example'),
  },
  {
    icon: <Home className="h-5 w-5" />,
    title: t('useCases.belongings.title'),
    example: t('useCases.belongings.example'),
  },
];
```

---

#### 2. Route Coverage Page
**File:** `/app/[locale]/(site)/services/route-coverage/page.tsx`

**Same pattern:**
```typescript
import { useTranslations, useLocale } from 'next-intl';

export default function RouteCoveragePage() {
  const t = useTranslations('services.routeCoverage');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
```

**Update hero (lines 26-40):**
```typescript
<Badge>{t('hero.badge')}</Badge>
<h1>
  {t('hero.title')}
  <span>{t('hero.titleHighlight')}</span>
</h1>
<p>{t('hero.subtitle')}</p>
```

**Update route finder labels:**
```typescript
<label>{t('routeFinder.from')}</label>
<label>{t('routeFinder.to')}</label>
<Button>{t('routeFinder.checkRoute')}</Button>
```

**Update city cards sections:**
```typescript
<h2>{t('europeanCities.title')}</h2>
<p>{t('europeanCities.subtitle')}</p>
// For each city card:
<span>{t('europeanCities.routes')}</span>
<span>{t('europeanCities.frequency')}</span>
```

---

#### 3. Specialized Services Page
**File:** `/app/[locale]/(site)/services/specialized/page.tsx`

**Same pattern:**
```typescript
import { useTranslations, useLocale } from 'next-intl';

export default function SpecializedServicesPage() {
  const t = useTranslations('services.specialized');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
```

**Update services array (lines 25-100):**
```typescript
const services = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: t('services.express.title'),
    duration: t('services.express.duration'),
    price: t('services.express.price'),
    description: t('services.express.description'),
    features: [
      t('services.express.features.nextBus'),
      t('services.express.features.priority'),
      t('services.express.features.sms'),
      t('services.express.features.guarantee'),
    ],
    useCases: t('services.express.useCases'),
  },
  // Repeat for temperature, documents, insurance, oversized, customs
];
```

---

## 🎨 RTL Styling Patterns

### Text Alignment
```typescript
className={`text-lg ${isRTL ? 'text-right' : ''}`}
```

### Flex Direction
```typescript
className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}
```

### Icon Positioning
```typescript
<Icon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
```

### Headings
```typescript
<h2 className={`text-3xl font-bold ${isRTL ? 'text-right' : ''}`}>
  {t('heading')}
</h2>
```

---

## ✅ Testing Checklist

After implementation, test each page:

1. Navigate to `/ar/[page-name]`
2. Verify all text is in Arabic
3. Check RTL layout (text flows right-to-left)
4. Verify icons are on correct side
5. Test on mobile (375px width)
6. Check dark mode compatibility

---

## 📊 Translation Keys Available

All translations are ready in `/messages/ar.json`:

- ✅ `support.*` - 18 keys
- ✅ `tracking.*` - 21 keys
- ✅ `pricing.*` - 35+ keys
- ✅ `services.individualShipping.*` - 25+ keys
- ✅ `services.routeCoverage.*` - 20+ keys
- ✅ `services.specialized.*` - 50+ keys

**Total: ~200 translation keys ready to use**

---

## 🚀 Quick Implementation Steps

For each remaining page:

1. Add imports: `useTranslations`, `useLocale`
2. Add hooks: `t`, `locale`, `isRTL`
3. Wrap main: `dir={isRTL ? "rtl" : "ltr"}`
4. Replace strings with `t('key')`
5. Add RTL classes where needed
6. Test in browser

**Estimated time per page: 15-20 minutes**

---

## 📸 Working Examples

Check these pages for reference:
- `/ar/support` - Perfect implementation ✅
- `/ar/tracking` - Perfect implementation ✅

Screenshots saved:
- `ar-support-page.png`
- `ar-tracking-page.png`
