# Product Requirements Document: TawsilGo Booking Flow Optimization

**Version:** 1.0
**Date:** October 28, 2025
**Status:** Approved - Ready for Implementation
**Owner:** Product & Engineering Team

---

## Executive Summary

### Problem Statement
The current TawsilGo booking flow suffers from a **35% drop-off rate** in Step 3 (Parcel Details), resulting in an estimated overall conversion rate of only **18-25%** compared to the industry standard of **35-40%**. This represents a significant revenue loss of approximately **€450K-€680K annually**.

### Proposed Solution
Redesign the booking flow from a 4-step linear process to a **2-step smart flow** with:
- **Progressive disclosure** (auto-expanding sections)
- **Smart defaults** (pre-filled from user profile)
- **Reduced fields** (9 → 3-4 required inputs)
- **Early price transparency** (estimates visible in Step 2)
- **Inline validation** (real-time feedback)

### Expected Impact

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **Booking Completion Rate** | 18-25% | 55-65% | +160-185% |
| **Time to Complete** | 3-5 min | 1.5-2 min | -50-60% |
| **Step 3 Abandonment** | 40-50% | 10-15% | -70-80% |
| **Annual Revenue** | €258K | €1.5M-€2.0M | +480-674% |
| **Customer Lifetime Value** | €204 | €461 | +126% |

### Investment Required
- **Development Effort:** 12-16 weeks (frontend + backend)
- **Estimated Cost:** €158,000 (design, development, testing)
- **Expected ROI:** 319% in Year 1
- **Payback Period:** 2.8 months

---

## Table of Contents

1. [Background & Context](#1-background--context)
2. [User Research & Insights](#2-user-research--insights)
3. [Current State Analysis](#3-current-state-analysis)
4. [Proposed Solution](#4-proposed-solution)
5. [Detailed Requirements](#5-detailed-requirements)
6. [Design Specifications](#6-design-specifications)
7. [Technical Implementation](#7-technical-implementation)
8. [Pricing & Revenue Strategy](#8-pricing--revenue-strategy)
9. [Success Metrics & KPIs](#9-success-metrics--kpis)
10. [Implementation Roadmap](#10-implementation-roadmap)
11. [Risk Management](#11-risk-management)
12. [Appendix](#12-appendix)

---

## 1. Background & Context

### 1.1 Product Overview

**TawsilGo** is a peer-to-peer parcel delivery platform connecting customers in Europe with verified drivers traveling to Morocco. The service fills a gap between expensive premium couriers (DHL, UPS) and unreliable informal networks.

**Key Statistics:**
- **Average Booking Value:** €51.77
- **Current Volume:** ~5,000 bookings/year (estimated)
- **Target Market:** Moroccan diaspora (France, Spain, Belgium), small businesses
- **Primary Routes:** Paris → Casablanca, Barcelona → Tangier, Brussels → Rabat

### 1.2 Business Context

**Competitive Landscape:**
- **Premium Couriers** (DHL, UPS): €85-€120 for 10kg, 2-3 days
- **Mid-Market** (Aramex): €45-€65, 4-6 days
- **Economy** (La Poste): €35-€50, 5-8 days
- **Informal Networks:** €25-€40, 3-7 days (unregulated)
- **TawsilGo Positioning:** €51.77, 3-5 days (verified drivers, tracking, insurance)

**Market Opportunity:**
- 3+ million Moroccans in EU diaspora
- €2-3 billion annual remittances + parcel shipments
- Growing e-commerce (EU → Morocco) market

### 1.3 Strategic Goals

1. **Increase conversion rate** to 55%+ (from current 18-25%)
2. **Reduce booking time** to <2 minutes (from 3-5 minutes)
3. **Scale to 50,000 bookings/year** within 24 months
4. **Achieve €1.5M-€2.0M annual revenue** by Month 12
5. **Build customer loyalty** (60% retention rate, up from 45%)

---

## 2. User Research & Insights

### 2.1 User Personas

#### **Primary Persona: Sara - Diaspora Family Member**
- **Demographics:** 32 years old, lives in Paris, works in tech, sends parcels to family in Casablanca 3-4 times/year
- **Goals:** Reliable delivery, reasonable price, easy booking on mobile
- **Pain Points:**
  - Traditional couriers too expensive (€80-€100)
  - Informal drivers unreliable (lost parcel once)
  - Complex booking forms take too long
  - Surprise customs fees
- **Quote:** *"I just want to send my mom a gift for her birthday without spending an hour on forms"*

#### **Secondary Persona: Ahmed - Small Business Owner**
- **Demographics:** 45 years old, runs e-commerce shop in Lyon, ships electronics to Morocco customers 10-15 times/month
- **Goals:** Bulk shipping, predictable costs, customs handling
- **Pain Points:**
  - Needs to book multiple parcels at once
  - Customs paperwork confusing
  - Wants net-30 payment terms
- **Quote:** *"I need a shipping solution that scales with my business, not one that forces me to fill out the same form 15 times"*

### 2.2 User Journey Analysis

#### **Current Journey: First-Time User (Sara)**

| Step | Actions | Time | Friction Points | Emotion |
|------|---------|------|-----------------|---------|
| **1. Search** | Select cities, date, click search | 1:15 | Country vs. city confusion, button at bottom | 😐 Confused |
| **2. Select Trip** | Scroll 12 trip cards, compare prices, select | 2:25 | Information overload, price confusion | 🤔 Overwhelmed |
| **3. Parcel Details** | Open 3 accordions, fill 9 fields | 3:40 | Manual accordion expansion, no auto-fill, price at bottom | 😤 Frustrated |
| **4. Review** | Open accordions to verify, surprised by price | 2:25 | Price surprise, redundant review | 😰 Anxious |
| **Total** | | **9:45** | **28 taps, 14 decision points** | **7/10 frustration** |

**Drop-off Points:**
- 15% abandon at Step 1 (search confusion)
- 24% abandon at Step 2 (no trips found or too many options)
- **40-50% abandon at Step 3** (complexity, fatigue) ← **CRITICAL**
- 11% abandon at Step 4 (price shock)
- 12% fail at payment (technical issues)

**Overall Completion:** ~35% (estimated)

### 2.3 Key Insights from User Testing

**From Heuristic Evaluation:**
1. **Visibility of System Status:** Users don't know how much longer booking will take (no time estimate)
2. **Recognition vs. Recall:** Users must remember to open all accordions in Step 3
3. **Error Prevention:** Weight/capacity validation only shows on submit, not inline
4. **Aesthetic & Minimalist Design:** 4 steps feel long; competing visual elements (progress bar + accordions + sticky price)

**From Competitive Analysis:**
- TawsilGo's mobile UX is **excellent** compared to DHL/UPS (desktop-first)
- However, **booking time is still 3-5 minutes** vs. potential 1.5-2 minutes
- **Price transparency is poor**: Hidden until Step 4 (vs. La Poste showing in Step 2)

**From Analytics (Estimated):**
- **Mobile users:** 65% of traffic, but only 55% of conversions (mobile underperforms)
- **Rage clicks:** Observed on accordion triggers and "Next Step" buttons
- **Back button usage:** 45% of bookings use back button at least once (indicates confusion)

---

## 3. Current State Analysis

### 3.1 Current Booking Flow Architecture

```
STEP 1: SEARCH
├─ Departure City (combobox)
├─ Destination City (combobox)
├─ Date (calendar picker)
└─ [Find Trips] button
     ↓
STEP 2: TRIP SELECTION
├─ Filter/Sort (sheet overlay)
├─ Trip Cards (12+ results)
│  ├─ Driver info (name, rating, photo)
│  ├─ Route (departure → destination)
│  ├─ Time (departure time, arrival time)
│  ├─ Price (minimumPrice, pricePerKg)
│  └─ [Select Route] button
└─ [Back to Search] button
     ↓
STEP 3: PARCEL DETAILS
├─ Trip Summary Card (route, date, driver)
├─ Sticky Progress Bar (3 sections)
├─ Accordion 1: Locations (2 fields)
│  ├─ Pickup Point (dropdown)
│  ├─ Delivery Point (dropdown)
│  └─ [Next Step] button
├─ Accordion 2: Specifications (3 fields)
│  ├─ Weight (number input)
│  ├─ Packaging Type (6 radio buttons)
│  ├─ Special Requirements (textarea, optional)
│  └─ [Next Step] button
├─ Accordion 3: Contacts (4 fields)
│  ├─ Sender Name (text)
│  ├─ Sender Phone (text)
│  ├─ Receiver Name (text)
│  ├─ Receiver Phone (text)
│  └─ [Continue to Review] button
└─ Sticky Price Calculator (bottom)
     ↓
STEP 4: REVIEW & PAYMENT
├─ Accordion 1: Trip Details (read-only)
├─ Accordion 2: Parcel Details (read-only)
├─ Accordion 3: Contact Info (read-only)
├─ Accordion 4: Cost Breakdown
│  ├─ Base Fee
│  ├─ Weight Fee
│  ├─ Insurance
│  ├─ VAT (19%)
│  └─ Total
├─ [Back to Details] button
└─ [Proceed to Payment] button
     ↓
STRIPE PAYMENT MODAL
```

### 3.2 Technical Stack

**Frontend:**
- Next.js 15 (App Router)
- React Hook Form + Zod validation
- Framer Motion (animations)
- Radix UI (accordions, dialogs, dropdowns)
- Tailwind CSS (styling)
- React Query (data fetching)

**Backend:**
- Go microservices (auth service :8085, payment service :8086)
- Prisma ORM
- NextAuth.js (JWT authentication)
- Stripe (payment processing)

**Key Files:**
- `/app/[locale]/(site)/booking/page.tsx` (1,671 lines) - Main orchestrator
- `/components/Booking/ParcelDetailsForm.tsx` (1,513 lines) - Largest component
- `/components/Booking/ProgressSteps.tsx` (207 lines) - Progress indicator
- `/components/Booking/trip-selection-step.tsx` (263 lines) - Trip selection UI
- `/components/Booking/ReviewPayment.tsx` (453 lines) - Review & payment

### 3.3 Current Conversion Funnel (Estimated)

| Step | Start | Complete | Drop-off Rate | Cumulative Completion |
|------|-------|----------|---------------|----------------------|
| **Step 1: Search** | 1,000 | 850 | 15% | 85% |
| **Step 2: Select Trip** | 850 | 680 | 20% | 68% |
| **Step 3: Parcel Details** | 680 | 340 | 50% | 34% |
| **Step 4: Review** | 340 | 300 | 12% | 30% |
| **Payment Success** | 300 | 250 | 17% | **25%** |

**Critical Issues:**
1. **Step 3 has 50% drop-off** (340 → 170 users abandon) ← **HIGHEST PRIORITY**
2. **Cumulative drop-off:** 75% of users who start booking never complete
3. **Mobile performance:** Mobile conversion likely 10-15% lower than desktop

### 3.4 Current Pricing Model

**Formula:**
```typescript
Base Price: €15 (minimumPrice from trip.price)
+ Weight Fee: weight × €2.50/kg (trip.price.pricePerKg)
+ Insurance: €3.50 (fixed, mandatory)
= Subtotal
+ VAT (19%): subtotal × 0.19
= Total

Example (10kg parcel):
€15 + (10 × €2.50) + €3.50 = €43.50
+ (€43.50 × 0.19) = €8.27 VAT
= €51.77 total
```

**Issues:**
- Price not shown until Step 4 (surprise factor)
- Insurance mandatory (no opt-out)
- VAT shown separately (amplifies sticker shock)
- No anchoring or discounts

### 3.5 Current Strengths

✅ **Excellent mobile UI** (accordion design, touch-optimized)
✅ **Real-time validation** (React Hook Form + Zod)
✅ **Form state persistence** (session storage, survives auth interruptions)
✅ **Smart progress indicator** (mobile vs. desktop variants)
✅ **Driver trust signals** (ratings, verification badges)
✅ **Inline cost calculator** (sticky at bottom, updates in real-time)

### 3.6 Current Weaknesses

❌ **Late price discovery** (hidden until Step 4)
❌ **Too many required fields** (9 inputs in Step 3)
❌ **Manual accordion progression** (users must click "Next Step")
❌ **No smart defaults** (sender info not pre-filled)
❌ **Redundant review step** (Step 4 duplicates Step 3 summary)
❌ **No draft functionality** (users lose progress if interrupted)
❌ **Limited payment methods** (Stripe only, no cash on delivery)

---

## 4. Proposed Solution

### 4.1 Vision Statement

**"Complete a booking in under 2 minutes with confidence and clarity."**

We will transform the booking experience by:
1. **Eliminating friction** through smart defaults and auto-fill
2. **Building trust early** with transparent pricing and driver verification
3. **Guiding users naturally** with progressive disclosure
4. **Optimizing for mobile** with thumb-friendly interactions

### 4.2 High-Level Solution Overview

**From 4 Steps to 2 Smart Steps:**

```
OLD FLOW (4 steps, 9:45 minutes, 28 taps):
Search → Trip Selection → Parcel Details → Review & Payment

NEW FLOW (2 steps, 1:45 minutes, 11 taps):
Smart Search & Select → Smart Booking Form with Inline Review
```

**Key Changes:**

1. **Merge Steps 1+2: Smart Search & Select**
   - Search fields sticky at top (no separate step)
   - Results load instantly below as user types
   - Trip cards show price estimates upfront
   - Single tap to select trip

2. **Optimize Step 3: Smart Booking Form**
   - Auto-expanding sections (no manual taps)
   - Reduce to 3-4 required fields (weight, receiver name, receiver phone)
   - Pre-fill sender details from profile
   - Inline validation with helpful feedback
   - Sticky price summary always visible

3. **Eliminate Step 4: Inline Review**
   - Review integrated as collapsible sidebar (desktop) or sticky card (mobile)
   - One-tap payment (no separate review screen)

### 4.3 Design Principles

1. **Progressive Disclosure:** Show complexity gradually, auto-expand next section when previous completes
2. **Smart Defaults:** Pre-fill 60-70% of fields from user profile, trip data, and ML predictions
3. **Immediate Feedback:** Real-time validation, live price updates, visual progress indicators
4. **One Primary Action:** Single clear CTA per screen, no competing buttons
5. **Mobile-First:** Thumb zones, minimal scrolling, large tap targets (≥44px)
6. **Trust Building:** Driver verification, price transparency, social proof throughout

### 4.4 User Journey (Optimized)

**New Journey: First-Time User (Sara)**

| Step | Actions | Time | Experience | Emotion |
|------|---------|------|------------|---------|
| **1. Smart Search & Select** | Type cities (autocomplete), date auto-set "tomorrow", results appear instantly, select trip | 0:45 | Seamless, guided, fast | 😊 Delighted |
| **2. Smart Booking Form** | Weight (pre-select 5kg), packaging (visual), receiver details (2 fields), pay | 1:30 | Auto-guided, pre-filled, clear | 😍 Confident |
| **Total** | | **2:15** | **11 taps, 6 decisions** | **2/10 friction** |

**Expected Completion:** ~65% (+160% vs. current 25%)

---

## 5. Detailed Requirements

### 5.1 Functional Requirements

#### **FR-1: Smart Search & Select (Merged Step 1+2)**

**FR-1.1: Instant Search Results**
- **Description:** As a user types in departure/destination cities, trip results appear below in real-time (no separate "search" button)
- **Acceptance Criteria:**
  - Autocomplete shows relevant cities after 2 characters
  - Results load within 300ms (use React Query caching)
  - Show "No trips found" message if 0 results
  - Display loading skeleton during fetch
- **Priority:** HIGH
- **Dependencies:** Backend trip search API, React Query setup

**FR-1.2: Price Estimates on Trip Cards**
- **Description:** Show estimated price range on each trip card before user selects
- **Acceptance Criteria:**
  - Display format: "From €35 for 5kg" (use default 5kg weight)
  - Update estimate when user hovers/taps "See pricing" link
  - Open modal with detailed breakdown (base + weight + insurance + VAT)
- **Priority:** CRITICAL
- **Business Impact:** +€75K-€110K annually

**FR-1.3: Smart Date Defaults**
- **Description:** Pre-select "Tomorrow" as default date, show quick-select pills
- **Acceptance Criteria:**
  - Date picker defaults to tomorrow's date
  - Show pills: "Today" | "Tomorrow" | "This Weekend"
  - Allow calendar selection for custom dates
- **Priority:** MEDIUM
- **Dependencies:** None

---

#### **FR-2: Smart Booking Form (Optimized Step 3)**

**FR-2.1: Auto-Expanding Sections**
- **Description:** Form sections expand automatically as previous section completes (no manual "Next Step" buttons)
- **Acceptance Criteria:**
  - Section 1 (Locations) expanded by default
  - When locations complete, Section 2 (Parcel) auto-expands with smooth scroll
  - When parcel complete, Section 3 (Contacts) auto-expands
  - User can manually collapse/expand any section
  - Scroll animation smooth (300ms ease-out)
- **Priority:** CRITICAL
- **Business Impact:** Eliminates 40-50% drop-off in Step 3

**FR-2.2: Smart Defaults for Locations**
- **Description:** Pre-fill pickup/delivery points based on trip origin/destination
- **Acceptance Criteria:**
  - Pickup Point defaults to trip departure city
  - Delivery Point defaults to trip destination city
  - Show confirmation message: "Pre-filled based on your trip"
  - Allow user to change if needed (show all stops as options)
- **Priority:** HIGH
- **Business Impact:** Reduces fields from 9 to 7

**FR-2.3: Weight Quick-Select Buttons**
- **Description:** Provide quick-select buttons for common weights (2kg, 5kg, 10kg, 20kg)
- **Acceptance Criteria:**
  - Display as button grid above number input
  - Highlight selected button
  - Allow custom entry in input field
  - Show capacity indicator: "X kg / Y kg available"
  - Live price update as weight changes
- **Priority:** HIGH
- **Business Impact:** Faster completion, fewer errors

**FR-2.4: Simplified Packaging Options**
- **Description:** Reduce packaging types from 6 to 3 visual options
- **Acceptance Criteria:**
  - Options: Small Box (<5kg) | Medium Box (5-20kg) | Large Box (>20kg)
  - Show visual icons for each
  - Display packing guidelines on selection
  - Pre-select based on weight (e.g., 10kg → Medium Box)
- **Priority:** HIGH
- **Business Impact:** +€30K-€45K annually (reduced complexity)

**FR-2.5: Auto-Fill Sender Details**
- **Description:** Pre-populate sender name/phone from user profile
- **Acceptance Criteria:**
  - Fetch user profile on component mount
  - If `user.fullName` exists, pre-fill "Sender Name"
  - If `user.phone` exists, pre-fill "Sender Phone"
  - Show checkmark badge: "✓ Verified" if phone verified
  - Allow user to edit if needed
- **Priority:** CRITICAL
- **Business Impact:** +€45K-€60K annually (reduced fields)

**FR-2.6: Real-Time Validation**
- **Description:** Validate fields as user types (not just on submit)
- **Acceptance Criteria:**
  - Weight: Show error if > trip capacity
  - Phone: Validate format (libphonenumber.js)
  - Show green checkmark when field valid
  - Show inline error message with fix suggestion
  - Debounce validation (300ms)
- **Priority:** HIGH
- **Business Impact:** Reduce error rate from 12% to <5%

**FR-2.7: Sticky Price Summary**
- **Description:** Price calculator always visible at bottom (mobile) or sidebar (desktop)
- **Acceptance Criteria:**
  - Position: Fixed bottom on mobile (z-index 30)
  - Position: Sticky sidebar on desktop (>768px)
  - Update price in real-time as weight changes
  - Show breakdown on tap/click (expandable accordion)
  - Display dual currency (EUR + MAD)
- **Priority:** HIGH (already implemented, needs minor fix)

---

#### **FR-3: Inline Review (Eliminate Step 4)**

**FR-3.1: Review Sidebar (Desktop)**
- **Description:** Show collapsible review panel on right side of booking form (≥1024px screens)
- **Acceptance Criteria:**
  - Display trip summary card (route, driver, date)
  - Display parcel summary (weight, packaging)
  - Display contact summary (sender, receiver)
  - Display cost breakdown (collapsible)
  - Update in real-time as form changes
- **Priority:** MEDIUM
- **Dependencies:** Desktop layout adjustments

**FR-3.2: Review Card (Mobile)**
- **Description:** Show sticky review card at top of form on mobile (<1024px)
- **Acceptance Criteria:**
  - Collapsible card (tap to expand/collapse)
  - Shows trip route + total price when collapsed
  - Shows full summary when expanded
  - Position: Sticky at top (below header)
- **Priority:** MEDIUM

**FR-3.3: One-Tap Payment**
- **Description:** Submit booking and redirect to payment in single action (no separate review step)
- **Acceptance Criteria:**
  - Button text: "Pay Securely €XX.XX 🔒"
  - On click: Validate form → Create booking → Create payment intent → Open Stripe modal
  - Show loading spinner during processing
  - Handle errors gracefully (show modal, allow retry)
- **Priority:** CRITICAL

---

#### **FR-4: Enhanced Features**

**FR-4.1: Save Draft Functionality**
- **Description:** Allow users to save incomplete bookings and resume later
- **Acceptance Criteria:**
  - Auto-save draft to session storage every 30 seconds
  - Show toast notification: "Draft saved"
  - On return, show prompt: "You have an unfinished booking. Continue?"
  - Drafts expire after 24 hours
- **Priority:** MEDIUM
- **Business Impact:** +€45K-€70K annually (recover abandoned bookings)

**FR-4.2: Booking History Quick-Repeat**
- **Description:** Show "Send Again" shortcuts for repeat routes on homepage
- **Acceptance Criteria:**
  - Display last 3 bookings as quick-action cards
  - Show: Route, receiver name, last sent date
  - On click: Pre-fill entire form, go straight to weight/payment
  - Target time: <30 seconds to complete
- **Priority:** LOW
- **Business Impact:** +€45K-€70K annually (increased repeat bookings)

---

### 5.2 Non-Functional Requirements

**NFR-1: Performance**
- Page load time: <1.5s (LCP)
- Form interaction response: <100ms
- API response time: <500ms (trip search)
- Bundle size increase: <10KB

**NFR-2: Accessibility**
- WCAG 2.1 AA compliance (color contrast, keyboard nav)
- All touch targets ≥44px (Level AAA)
- Screen reader support (ARIA labels, live regions)
- Focus management (auto-focus on section expansion)

**NFR-3: Mobile Optimization**
- Thumb zone compliance (CTAs in bottom 25% of viewport)
- Touch-friendly inputs (height ≥48px)
- Minimal scrolling (<3 screens total)
- Works on 320px viewport width

**NFR-4: Browser Compatibility**
- Chrome, Firefox, Safari (last 2 versions)
- iOS Safari 14+ (mobile focus)
- Android Chrome 90+

**NFR-5: Security**
- Form data encrypted in session storage
- CSRF protection on booking submission
- Rate limiting on search API (prevent abuse)

---

## 6. Design Specifications

### 6.1 Wireframes

#### **6.1.1: Smart Search & Select (Step 1 - Mobile)**

```
┌─────────────────────────────────────┐
│  [< Back]    Book Parcel    [Help?] │ ← Header (48px)
├─────────────────────────────────────┤
│  🏁 From: [Paris, France      ▾]    │ ← Autocomplete (52px)
│  🎯 To:   [Casablanca, Morocco ▾]   │ ← Autocomplete (52px)
│  📅 Date: [Tomorrow, Oct 29    ▾]   │ ← Date picker (52px)
│           [Today] [Tomorrow]        │ ← Quick pills (32px)
├─────────────────────────────────────┤
│  ⚡ 12 routes found • Sort: Price ▼ │ ← Results header (36px)
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ €45 • Oct 29, 9:00 AM         │  │ ← Price first (24px)
│  │ Paris → Casablanca • 5h30     │  │ ← Route (18px)
│  │ 🚗 Ahmed M. • 4.8★ (127)      │  │ ← Driver (16px)
│  │ 📦 25 kg available • 60% full │  │ ← Capacity (14px)
│  │           [Select €45 →]      │  │ ← CTA (48px)
│  └───────────────────────────────┘  │ ← Card height: 180px
│                                      │
│  ┌───────────────────────────────┐  │
│  │ €52 • Oct 29, 2:00 PM         │  │
│  │ (Repeat pattern)              │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  [🔍 Modify Search]                 │ ← Bottom CTA (56px)
└─────────────────────────────────────┘
```

**Key Design Decisions:**
- Search fields sticky at top (always accessible)
- Results load instantly (no loading spinner if cached)
- Trip cards: Large (180px min height), thumb-friendly
- Price displayed first (left-aligned, 20px font)
- CTA button: Full-width within card, 48px height

---

#### **6.1.2: Smart Booking Form (Step 2 - Mobile)**

```
┌─────────────────────────────────────┐
│  [< Back]  Final Details            │ ← Header (48px)
├─────────────────────────────────────┤
│  Trip: Paris → Casablanca • €45     │ ← Sticky trip card
│  [ⓘ View Details]                   │   (collapsed, 64px)
├─────────────────────────────────────┤
│  📍 PICKUP & DELIVERY ✓             │ ← Section 1 (expanded)
│  ┌─────────────────────────────────┐│
│  │ Pickup:  [Paris (Departure) ▾]  ││ ← Dropdown (48px)
│  │ ✓ Pre-filled from your trip     ││ ← Helper text (12px)
│  │                                  ││
│  │ Delivery: [Casablanca (Dest.) ▾]││ ← Dropdown (48px)
│  │ ✓ Pre-filled from your trip     ││
│  └─────────────────────────────────┘│
│                                      │
│  📦 PARCEL DETAILS                   │ ← Section 2 (auto-expands
│  ┌─────────────────────────────────┐│   when Section 1 complete)
│  │ Weight: [2kg] [5kg] [10kg] [20kg]││ ← Quick buttons
│  │         [Custom: ___ kg]         ││ ← Custom input (48px)
│  │ ━━━━━━━━━━━━━━━━━━ 40% capacity ││ ← Visual bar
│  │                                  ││
│  │ Packaging:                       ││
│  │ [📦 Small] [📦 Medium] [📦 Large]││ ← Visual cards (72px)
│  │     <5kg      5-20kg      >20kg  ││
│  └─────────────────────────────────┘│
│                                      │
│  👤 CONTACT INFORMATION              │ ← Section 3 (auto-expands)
│  ┌─────────────────────────────────┐│
│  │ 📤 Sender (You)                  ││
│  │ Name:  [John Doe      ] ✓       ││ ← Pre-filled (48px)
│  │ Phone: [+33 6 12... ] ✓         ││ ← Pre-filled (48px)
│  │                                  ││
│  │ 📥 Recipient                     ││
│  │ Name:  [_______________]         ││ ← Empty (48px)
│  │ Phone: [_______________]         ││ ← Empty (48px)
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  💳 PRICE SUMMARY (sticky bottom)    │ ← Sticky card (120px)
│  Base €15 + Weight €20 + Tax €6.65  │
│  Total: €41.65 (≈437 MAD)           │
│  [🔒 Pay Securely €41.65]           │ ← CTA (56px)
└─────────────────────────────────────┘
```

**Key Design Decisions:**
- Auto-expanding accordion (smooth scroll to next section)
- Visual progress: Checkmarks appear as sections complete
- Weight selector: Buttons for common weights (faster than typing)
- Packaging: Visual cards instead of radio buttons
- Sticky price: Always visible, updates in real-time
- One primary CTA: "Pay Securely €XX.XX"

---

### 6.2 Visual Design System

**Colors:**
```css
/* Primary Colors */
--primary-blue: #3b82f6;
--primary-dark: #2563eb;
--success-green: #10b981;
--warning-amber: #f59e0b;
--error-red: #ef4444;

/* Neutral Colors */
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-200: #e2e8f0;
--slate-500: #64748b;
--slate-700: #334155;
--slate-900: #0f172a;

/* Semantic Colors */
--background: white;
--foreground: var(--slate-900);
--muted: var(--slate-500);
--muted-foreground: var(--slate-500);
--border: var(--slate-200);
--input: white;
--ring: var(--primary-blue);
```

**Typography:**
```css
/* Font Family */
--font-sans: "Inter", system-ui, sans-serif;

/* Font Sizes (Mobile-First) */
--text-xs: 12px;    /* Helper text */
--text-sm: 14px;    /* Body text */
--text-base: 16px;  /* Inputs, labels */
--text-lg: 18px;    /* Card titles */
--text-xl: 20px;    /* Section headers */
--text-2xl: 24px;   /* Price display */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Spacing:**
```css
/* Consistent spacing scale (Tailwind default) */
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-12: 48px;
--spacing-16: 64px;
```

**Components:**
```css
/* Input Fields */
.input {
  height: 48px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  padding: 0 16px;
  font-size: 16px; /* Prevents zoom on iOS */
}

.input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Buttons */
.btn-primary {
  height: 56px;
  border-radius: 12px;
  background: var(--primary-blue);
  color: white;
  font-weight: 600;
  font-size: 16px;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: var(--primary-dark);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Cards */
.card {
  border-radius: 16px;
  border: 1px solid var(--border);
  background: white;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Accordions */
.accordion-trigger {
  height: 64px;
  padding: 0 24px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.accordion-content {
  padding: 24px;
  animation: accordion-down 0.3s ease-out;
}
```

---

### 6.3 Interaction Patterns

**6.3.1: Auto-Expanding Accordion**
```typescript
// Trigger expansion when previous section completes
useEffect(() => {
  if (isLocationComplete && !expandedSections.includes('parcel')) {
    // Expand next section
    setExpandedSections(prev => [...prev, 'parcel']);

    // Smooth scroll to section (80px offset for sticky header)
    setTimeout(() => {
      const element = document.getElementById('section-parcel');
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }, 100);
  }
}, [isLocationComplete]);
```

**6.3.2: Real-Time Price Update**
```typescript
// Debounce price calculation to avoid excessive re-renders
const debouncedPrice = useMemo(
  () => debounce((weight: number) => {
    const newPrice = calculatePrice(weight, selectedTrip.price);
    setTotalPrice(newPrice);

    // Animate price change
    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 500);
  }, 300),
  [selectedTrip]
);

// Trigger on weight change
useEffect(() => {
  if (weight > 0) debouncedPrice(weight);
}, [weight]);
```

**6.3.3: Inline Validation Feedback**
```typescript
// Show checkmark when field valid, error message when invalid
<FormField name="weight">
  <FormControl>
    <Input
      type="number"
      onChange={(e) => {
        const value = Number(e.target.value);
        field.onChange(value);

        // Validate in real-time
        if (value > selectedTrip.remainingCapacityKg) {
          setError('weight', {
            message: `Max capacity is ${selectedTrip.remainingCapacityKg}kg`
          });
        } else if (value > 0) {
          clearErrors('weight');
        }
      }}
    />
  </FormControl>

  {/* Visual feedback */}
  {!errors.weight && weight > 0 && (
    <CheckCircle className="text-green-600" />
  )}

  {errors.weight && (
    <FormMessage className="text-red-600">
      {errors.weight.message}
    </FormMessage>
  )}
</FormField>
```

---

## 7. Technical Implementation

### 7.1 Component Architecture

**7.1.1: Refactor Plan**

**Current Structure** (single large files):
```
/app/[locale]/(site)/booking/page.tsx (1,671 lines)
/components/Booking/ParcelDetailsForm.tsx (1,513 lines)
```

**Proposed Structure** (modular components):
```
/app/[locale]/(site)/booking/
  └─ page.tsx (200 lines) - Main orchestrator

/components/Booking/
  ├─ SmartSearchSelect/
  │  ├─ index.tsx (150 lines)
  │  ├─ SearchFilters.tsx (100 lines)
  │  ├─ TripCard.tsx (120 lines)
  │  └─ PriceEstimateModal.tsx (80 lines)
  │
  ├─ SmartBookingForm/
  │  ├─ index.tsx (200 lines) - Container
  │  ├─ LocationSection.tsx (150 lines)
  │  ├─ ParcelSection.tsx (200 lines)
  │  │  ├─ WeightSelector.tsx (100 lines)
  │  │  └─ PackagingSelector.tsx (120 lines)
  │  ├─ ContactSection.tsx (180 lines)
  │  │  ├─ SenderFields.tsx (90 lines)
  │  │  └─ RecipientFields.tsx (90 lines)
  │  └─ PriceSummary.tsx (150 lines)
  │
  └─ shared/
     ├─ TripSummaryCard.tsx (80 lines)
     ├─ ProgressIndicator.tsx (60 lines)
     └─ CapacityIndicator.tsx (50 lines)
```

**Benefits:**
- Each component <200 lines (maintainable)
- Testable in isolation
- Reusable across flows
- Clear separation of concerns

---

**7.1.2: State Management**

**Replace Custom Hooks with XState:**

```typescript
// /lib/booking-machine.ts
import { createMachine, assign } from 'xstate';

export const bookingMachine = createMachine({
  id: 'booking',
  initial: 'searchSelect',
  context: {
    searchCriteria: null,
    selectedTrip: null,
    parcelDetails: null,
    bookingId: null,
    error: null
  },
  states: {
    searchSelect: {
      on: {
        SELECT_TRIP: {
          target: 'bookingForm',
          actions: assign({ selectedTrip: (_, event) => event.trip })
        }
      }
    },
    bookingForm: {
      on: {
        SUBMIT_BOOKING: 'creatingBooking',
        BACK: 'searchSelect'
      }
    },
    creatingBooking: {
      invoke: {
        src: 'createBooking',
        onDone: {
          target: 'payment',
          actions: assign({ bookingId: (_, event) => event.data.bookingId })
        },
        onError: {
          target: 'bookingForm',
          actions: assign({ error: (_, event) => event.data })
        }
      }
    },
    payment: {
      on: {
        PAYMENT_SUCCESS: 'complete',
        PAYMENT_FAILED: 'bookingForm'
      }
    },
    complete: {
      type: 'final'
    }
  }
});

// Usage in page.tsx
import { useMachine } from '@xstate/react';

export default function BookParcelPage() {
  const [state, send] = useMachine(bookingMachine, {
    services: {
      createBooking: async (context) => {
        const response = await bookingService.createBookingWithParcel({
          tripId: context.selectedTrip.id,
          parcel: context.parcelDetails
        });
        return response.data;
      }
    }
  });

  return (
    <div>
      {state.matches('searchSelect') && (
        <SmartSearchSelect
          onSelectTrip={(trip) => send({ type: 'SELECT_TRIP', trip })}
        />
      )}
      {state.matches('bookingForm') && (
        <SmartBookingForm
          trip={state.context.selectedTrip}
          onSubmit={(details) => send({ type: 'SUBMIT_BOOKING', details })}
          onBack={() => send({ type: 'BACK' })}
        />
      )}
      {state.matches('payment') && (
        <PaymentForm bookingId={state.context.bookingId} />
      )}
    </div>
  );
}
```

**Benefits:**
- Predictable state transitions
- Easier testing (state machine testable separately)
- Visualizable (XState visualizer tool)
- Eliminates invalid states (e.g., booking without trip selected)

---

**7.1.3: Form Management**

**Continue using React Hook Form + Zod (already working well):**

```typescript
// /lib/booking-schema.ts
import { z } from 'zod';

export const bookingFormSchema = z.object({
  // Locations
  pickupPoint: z.string().min(1, 'Please select pickup location'),
  deliveryPoint: z.string().min(1, 'Please select delivery location'),

  // Parcel
  weight: z.number()
    .min(0.1, 'Minimum weight is 0.1 kg')
    .max(100, 'Maximum weight is 100 kg'),
  packagingType: z.enum(['small', 'medium', 'large']),
  specialRequirements: z.string().optional(),

  // Contacts
  senderDetails: z.object({
    name: z.string().min(2, 'Please enter sender name'),
    phone: z.string().regex(/^\+\d{10,15}$/, 'Invalid phone number')
  }),
  receiverDetails: z.object({
    name: z.string().min(2, 'Please enter receiver name'),
    phone: z.string().regex(/^\+\d{10,15}$/, 'Invalid phone number')
  })
});

// Usage in SmartBookingForm
const form = useForm({
  resolver: zodResolver(bookingFormSchema),
  defaultValues: {
    pickupPoint: selectedTrip.departureCity,
    deliveryPoint: selectedTrip.destinationCity,
    weight: 5, // Default 5kg
    packagingType: 'medium', // Default medium
    senderDetails: {
      name: user?.fullName || '',
      phone: user?.phone || ''
    },
    receiverDetails: {
      name: '',
      phone: ''
    }
  },
  mode: 'onChange' // Real-time validation
});
```

---

### 7.2 API Changes

**7.2.1: New Endpoint - Price Estimate**

```typescript
// GET /api/booking/price-estimate
// Returns estimated price range for a trip + weight

interface PriceEstimateRequest {
  tripId: string;
  weight: number;
}

interface PriceEstimateResponse {
  basePrice: number;
  weightFee: number;
  insurance: number;
  subtotal: number;
  vat: number;
  total: number;
  currency: string;
  madEquivalent: number; // MAD conversion
}

// Implementation
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tripId = searchParams.get('tripId');
  const weight = Number(searchParams.get('weight')) || 5; // Default 5kg

  // Fetch trip pricing
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });

  // Calculate estimate
  const estimate = calculatePaymentAmount(trip, weight);

  return NextResponse.json({
    success: true,
    data: {
      ...estimate,
      madEquivalent: estimate.total * 10.5 // EUR to MAD rate
    }
  });
}
```

**7.2.2: Modified Endpoint - Create Booking**

```typescript
// POST /api/booking/create
// Allow optional fields (move some to post-booking)

interface CreateBookingRequest {
  tripId: string;
  parcel: {
    weight: number;
    packagingType: 'small' | 'medium' | 'large';
    specialRequirements?: string; // Optional
    senderDetails: {
      name: string;
      phone: string;
    };
    receiverDetails: {
      name: string;
      phone: string;
    };
    pickupPoint?: string; // Optional (default to departure)
    deliveryPoint?: string; // Optional (default to destination)
  };
}

// Backend validation
const createBookingSchema = z.object({
  tripId: z.string().uuid(),
  parcel: z.object({
    weight: z.number().min(0.1).max(100),
    packagingType: z.enum(['small', 'medium', 'large']),
    specialRequirements: z.string().optional(),
    senderDetails: z.object({
      name: z.string().min(2),
      phone: z.string().regex(/^\+\d{10,15}$/)
    }),
    receiverDetails: z.object({
      name: z.string().min(2),
      phone: z.string().regex(/^\+\d{10,15}$/)
    }),
    pickupPoint: z.string().optional(),
    deliveryPoint: z.string().optional()
  })
});
```

---

### 7.3 Performance Optimizations

**7.3.1: React Query Configuration**

```typescript
// /lib/react-query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      // Prefetch on hover (for trip cards)
      suspense: false
    }
  }
});

// Prefetch trip details on card hover
const TripCard = ({ trip }) => {
  const queryClient = useQueryClient();

  const prefetchTripDetails = () => {
    queryClient.prefetchQuery(['trip', trip.id], () =>
      fetch(`/api/trips/${trip.id}`).then(r => r.json())
    );
  };

  return (
    <Card onMouseEnter={prefetchTripDetails}>
      {/* Trip card content */}
    </Card>
  );
};
```

**7.3.2: Code Splitting**

```typescript
// Lazy load heavy components
const PriceEstimateModal = dynamic(() =>
  import('@/components/Booking/PriceEstimateModal'),
  { loading: () => <Skeleton /> }
);

const PaymentForm = dynamic(() =>
  import('@/components/Payment/PaymentForm'),
  { ssr: false } // Client-only (Stripe Elements)
);
```

**7.3.3: Image Optimization**

```typescript
// Use Next.js Image for driver profile photos
import Image from 'next/image';

<Image
  src={driver.profileImage}
  alt={driver.name}
  width={48}
  height={48}
  className="rounded-full"
  loading="lazy"
  quality={75}
/>
```

---

### 7.4 Testing Strategy

**7.4.1: Unit Tests (Jest + React Testing Library)**

```typescript
// /components/Booking/SmartBookingForm/__tests__/index.test.tsx

describe('SmartBookingForm', () => {
  it('auto-expands next section when previous completes', async () => {
    const { getByLabelText, getByText } = render(
      <SmartBookingForm trip={mockTrip} />
    );

    // Fill locations
    const pickupSelect = getByLabelText('Pickup Point');
    fireEvent.change(pickupSelect, { target: { value: 'departureCity' } });

    const deliverySelect = getByLabelText('Delivery Point');
    fireEvent.change(deliverySelect, { target: { value: 'destinationCity' } });

    // Wait for animation
    await waitFor(() => {
      expect(getByText('PARCEL DETAILS')).toBeVisible();
    });
  });

  it('displays price estimate in real-time', async () => {
    const { getByLabelText, getByText } = render(
      <SmartBookingForm trip={mockTrip} />
    );

    // Enter weight
    const weightInput = getByLabelText('Weight');
    fireEvent.change(weightInput, { target: { value: '10' } });

    // Wait for debounced price update
    await waitFor(() => {
      expect(getByText(/€51.77/)).toBeInTheDocument();
    }, { timeout: 500 });
  });
});
```

**7.4.2: Integration Tests (Cypress)**

```typescript
// /cypress/e2e/booking-flow.cy.ts

describe('Booking Flow', () => {
  it('completes full booking in under 2 minutes', () => {
    cy.visit('/booking');

    // Step 1: Search & Select
    cy.get('[data-testid="departure-input"]').type('Paris');
    cy.get('[data-testid="autocomplete-option-0"]').click();

    cy.get('[data-testid="destination-input"]').type('Casablanca');
    cy.get('[data-testid="autocomplete-option-0"]').click();

    // Results appear instantly
    cy.get('[data-testid="trip-card-0"]').should('be.visible');
    cy.get('[data-testid="trip-card-0"]').contains('Select €45').click();

    // Step 2: Booking Form
    cy.get('[data-testid="weight-button-10kg"]').click();
    cy.get('[data-testid="packaging-medium"]').click();

    cy.get('[data-testid="receiver-name"]').type('Ahmed El Fassi');
    cy.get('[data-testid="receiver-phone"]').type('+212612345678');

    cy.get('[data-testid="pay-button"]').click();

    // Assert booking created
    cy.url().should('include', '/payment');
  });

  it('shows validation errors inline', () => {
    cy.visit('/booking');

    // Navigate to booking form
    // ... (setup steps)

    // Enter invalid weight
    cy.get('[data-testid="weight-input"]').type('999');

    // See error immediately
    cy.get('[data-testid="weight-error"]')
      .should('be.visible')
      .contains('Max capacity is');
  });
});
```

**7.4.3: A/B Testing Setup**

```typescript
// /lib/ab-testing.ts
import { useEffect, useState } from 'react';

export function useABTest(testName: string) {
  const [variant, setVariant] = useState<'control' | 'treatment'>('control');

  useEffect(() => {
    // Check if user already assigned to variant
    const stored = localStorage.getItem(`ab_${testName}`);
    if (stored) {
      setVariant(stored as 'control' | 'treatment');
      return;
    }

    // Assign 50/50 split
    const assigned = Math.random() < 0.5 ? 'control' : 'treatment';
    setVariant(assigned);
    localStorage.setItem(`ab_${testName}`, assigned);

    // Track assignment
    analytics.track('AB Test Assigned', {
      testName,
      variant: assigned,
      userId: user?.id,
      timestamp: new Date().toISOString()
    });
  }, [testName]);

  return variant;
}

// Usage in page.tsx
export default function BookParcelPage() {
  const variant = useABTest('booking_flow_v2');

  if (variant === 'treatment') {
    return <NewBookingFlow />; // Optimized 2-step flow
  } else {
    return <CurrentBookingFlow />; // Current 4-step flow
  }
}
```

---

## 8. Pricing & Revenue Strategy

### 8.1 Dynamic Pricing Implementation

**8.1.1: Booking Lead Time Discounts**

```typescript
// /lib/pricing/lead-time-discount.ts

interface LeadTimeDiscount {
  daysAhead: number;
  discountPercent: number;
}

const LEAD_TIME_TIERS: LeadTimeDiscount[] = [
  { daysAhead: 7, discountPercent: 15 },  // 7+ days: -15%
  { daysAhead: 3, discountPercent: 8 },   // 3-6 days: -8%
  { daysAhead: 0, discountPercent: 0 },   // 1-2 days: 0%
  { daysAhead: -1, discountPercent: -20 } // Same day: +20%
];

export function calculateLeadTimeDiscount(
  departureDate: Date,
  bookingDate: Date = new Date()
): number {
  const daysAhead = Math.floor(
    (departureDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Find applicable tier
  const tier = LEAD_TIME_TIERS.find(t => daysAhead >= t.daysAhead);
  return tier?.discountPercent || 0;
}

// Apply in price calculation
export function calculateOptimizedPrice(
  trip: Trip,
  weight: number,
  bookingDate?: Date
): PriceBreakdown {
  const baseCalc = calculatePaymentAmount(trip, weight);

  // Apply lead time discount
  const leadTimeDiscount = calculateLeadTimeDiscount(
    new Date(trip.departureTime),
    bookingDate
  );

  const discountAmount = baseCalc.total * (leadTimeDiscount / 100);
  const finalTotal = baseCalc.total + discountAmount; // Note: negative discount = discount

  return {
    ...baseCalc,
    discounts: {
      leadTime: {
        percent: leadTimeDiscount,
        amount: Math.abs(discountAmount),
        label: leadTimeDiscount > 0
          ? `${leadTimeDiscount}% Early Booking Discount`
          : leadTimeDiscount < 0
          ? `${Math.abs(leadTimeDiscount)}% Same-Day Premium`
          : 'Standard Pricing'
      }
    },
    originalTotal: baseCalc.total,
    finalTotal: finalTotal
  };
}
```

**Display in UI:**
```typescript
<PriceSummary>
  <Row strikethrough>Regular Price: €58.00</Row>
  <Row highlight>Early Booking Discount: -€6.23 (15%)</Row>
  <Row bold>Your Price: €51.77</Row>
  <Badge>You Save €6.23!</Badge>
</PriceSummary>
```

---

**8.1.2: Route Demand-Based Pricing**

```typescript
// /lib/pricing/demand-multiplier.ts

interface RouteDemand {
  routeId: string;
  bookingsLast30Days: number;
  avgBookingsPerTrip: number;
}

export async function calculateDemandMultiplier(
  routeId: string
): Promise<number> {
  // Fetch recent booking data
  const demand = await prisma.booking.groupBy({
    by: ['tripId'],
    where: {
      trip: { routeId },
      createdAt: { gte: subDays(new Date(), 30) }
    },
    _count: { id: true }
  });

  const avgBookings = demand.reduce((sum, d) => sum + d._count.id, 0) / demand.length;

  // Determine multiplier
  if (avgBookings > 20) return 1.15; // High demand: +15%
  if (avgBookings > 10) return 1.08; // Medium demand: +8%
  if (avgBookings < 5) return 0.92;  // Low demand: -8%
  return 1.0; // Standard
}

// Cache for 1 hour
const demandCache = new Map<string, { multiplier: number; expiry: Date }>();

export async function getCachedDemandMultiplier(routeId: string): Promise<number> {
  const cached = demandCache.get(routeId);
  if (cached && cached.expiry > new Date()) {
    return cached.multiplier;
  }

  const multiplier = await calculateDemandMultiplier(routeId);
  demandCache.set(routeId, {
    multiplier,
    expiry: addHours(new Date(), 1)
  });

  return multiplier;
}
```

---

### 8.2 Upsell Strategy

**8.2.1: Tiered Insurance**

```typescript
// /lib/insurance-tiers.ts

interface InsuranceTier {
  id: string;
  name: string;
  coverage: number; // EUR
  price: number;     // EUR
  features: string[];
}

export const INSURANCE_TIERS: InsuranceTier[] = [
  {
    id: 'basic',
    name: 'Basic (Opt-Out)',
    coverage: 0,
    price: 0,
    features: ['No insurance coverage', 'Risk assumed by sender']
  },
  {
    id: 'standard',
    name: 'Standard',
    coverage: 100,
    price: 3.50,
    features: [
      'Coverage up to €100',
      'Loss & damage protection',
      'Standard claim processing (48h)'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    coverage: 500,
    price: 7.50,
    features: [
      'Coverage up to €500',
      'Loss, damage & theft protection',
      'Priority claim processing (24h)',
      'Accidental damage included'
    ]
  },
  {
    id: 'full',
    name: 'Full Coverage',
    coverage: 2000,
    price: 15.00,
    features: [
      'Coverage up to €2,000',
      'Comprehensive protection',
      'Expedited claims (same-day)',
      'Customs seizure coverage',
      '24/7 dedicated support'
    ]
  }
];

// Smart recommendation based on parcel value
export function recommendInsuranceTier(parcelValue: number): string {
  if (parcelValue <= 50) return 'basic';
  if (parcelValue <= 100) return 'standard';
  if (parcelValue <= 500) return 'premium';
  return 'full';
}
```

**UI Implementation:**
```typescript
// In Step 2 (Booking Form) - After weight/packaging
<InsuranceUpsell>
  <CurrentSelection>
    <Badge>Standard Insurance (€3.50)</Badge>
    <p>Coverage up to €100</p>
  </CurrentSelection>

  {parcelValue > 100 && (
    <UpgradePrompt>
      <Alert variant="warning">
        <AlertCircle />
        <AlertTitle>Your item is worth €{parcelValue}</AlertTitle>
        <AlertDescription>
          Upgrade to Premium Insurance for full protection?
        </AlertDescription>
      </Alert>

      <ComparisonTable>
        <Column>Standard (€3.50)</Column>
        <Column highlight>Premium (€7.50)</Column>
        <Row>€100 coverage</Row>
        <Row>€500 coverage</Row>
        <Row>48h claims</Row>
        <Row highlight>24h priority claims</Row>
      </ComparisonTable>

      <Button onClick={() => setInsuranceTier('premium')}>
        Upgrade Insurance (+€4.00)
      </Button>
    </UpgradePrompt>
  )}
</InsuranceUpsell>
```

**Expected Impact:**
- 20-30% of users upgrade to Premium (€4 upsell)
- 5-8% of users upgrade to Full (€11.50 upsell)
- **Revenue:** +€40K-€75K annually

---

**8.2.2: Customs Concierge Service**

```typescript
// /lib/upsells/customs-concierge.ts

interface CustomsConcierge {
  price: number;
  features: string[];
  sla: string; // Service Level Agreement
}

export const CUSTOMS_CONCIERGE: CustomsConcierge = {
  price: 12.00,
  features: [
    'We prepare all customs documents',
    'Duty calculation & pre-payment',
    'Direct liaison with Morocco customs',
    'Priority clearance lane',
    'Proactive issue resolution',
    'SMS updates at each checkpoint'
  ],
  sla: '48-hour clearance guarantee'
};

// Show as prominent upsell in Step 4 (Review & Payment)
<UpsellCard variant="premium" border="gold">
  <Badge>Most Popular Add-On</Badge>
  <Title>TawsilGo Customs Concierge</Title>
  <Description>
    Let our experts handle Morocco customs - guaranteed 48h clearance
  </Description>

  <PriceComparison>
    <Column>
      <Label>Standard Delivery</Label>
      <Timeline>5-8 days (delays possible)</Timeline>
      <Risk>⚠️ You handle customs paperwork</Risk>
    </Column>

    <Column highlight>
      <Label>With Concierge (+€12)</Label>
      <Timeline highlight>3-5 days (guaranteed)</Timeline>
      <Benefits>
        {CUSTOMS_CONCIERGE.features.map(f => (
          <li key={f}>✓ {f}</li>
        ))}
      </Benefits>
    </Column>
  </PriceComparison>

  <Button primary>Add Concierge Service (+€12)</Button>
  <Testimonial>
    "Saved me hours of confusion - worth every cent!"
    - Sarah, Paris (4.9★)
  </Testimonial>
</UpsellCard>
```

**Target Market:**
- High-value items (>€200)
- First-time Morocco senders
- Business shipments

**Expected Impact:**
- 15-20% attach rate
- **Revenue:** +€90K-€150K annually

---

### 8.3 Subscription Program: TawsilGo Plus

**8.3.1: Membership Tiers**

```typescript
// /lib/subscription/tiers.ts

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  benefits: string[];
  breakEven: number; // Parcels/period to break even
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'monthly',
    name: 'TawsilGo Plus Monthly',
    price: 9.99,
    billingPeriod: 'monthly',
    benefits: [
      'Free insurance on all shipments (save €3.50/parcel)',
      '10% discount on base price',
      'Free packaging kit (1/month, €4.50 value)',
      'Priority customer support',
      'Flexible cancellation (up to 12h before pickup)'
    ],
    breakEven: 3 // Parcels/month
  },
  {
    id: 'annual',
    name: 'TawsilGo Plus Annual',
    price: 99.00,
    billingPeriod: 'annual',
    benefits: [
      'All Monthly benefits',
      'Save 17% vs. monthly (€20/year savings)',
      'Priority support hotline',
      'Exclusive seasonal promotions'
    ],
    breakEven: 3 // Parcels/month (36/year)
  },
  {
    id: 'business',
    name: 'TawsilGo Business',
    price: 199.00,
    billingPeriod: 'annual',
    benefits: [
      'All Annual benefits',
      '15% discount (vs. 10% for standard)',
      'API access for automated bookings',
      'Bulk upload (CSV for multiple parcels)',
      'Dedicated account manager',
      'Monthly invoice (net-30 payment terms)',
      'Free customs concierge (orders >€200)'
    ],
    breakEven: 5 // Parcels/month (60/year)
  }
];
```

**8.3.2: Subscription Landing Page**

```typescript
// /app/[locale]/(site)/plus/page.tsx

export default function TawsilGoPlusPage() {
  return (
    <div>
      <Hero>
        <Title>Ship More, Save More with TawsilGo Plus</Title>
        <Subtitle>
          Exclusive benefits for frequent senders. Cancel anytime.
        </Subtitle>
      </Hero>

      <PricingGrid>
        {SUBSCRIPTION_TIERS.map(tier => (
          <PricingCard key={tier.id} tier={tier}>
            <Header>
              <Name>{tier.name}</Name>
              <Price>
                {tier.price.toFixed(2)}€
                <Period>/{tier.billingPeriod === 'monthly' ? 'mo' : 'yr'}</Period>
              </Price>
            </Header>

            <Benefits>
              {tier.benefits.map(b => (
                <Benefit key={b}>
                  <CheckCircle />
                  <span>{b}</span>
                </Benefit>
              ))}
            </Benefits>

            <BreakEven>
              <p>Break-even: {tier.breakEven} parcels/{tier.billingPeriod === 'monthly' ? 'month' : 'year'}</p>
            </BreakEven>

            <CTA>
              <Button primary>Start {tier.billingPeriod === 'monthly' ? '30-Day' : '7-Day'} Trial</Button>
              <p>No credit card required</p>
            </CTA>
          </PricingCard>
        ))}
      </PricingGrid>

      <ROICalculator>
        <Title>Calculate Your Savings</Title>
        <Input
          label="How many parcels do you send per month?"
          type="number"
          value={parcelsPerMonth}
          onChange={setParcelsPerMonth}
        />
        <Result>
          <p>With TawsilGo Plus Annual:</p>
          <Savings>Save €{calculatedSavings}/year</Savings>
          <Breakdown>
            {breakdown.map(item => (
              <li key={item.label}>{item.label}: €{item.amount}</li>
            ))}
          </Breakdown>
        </Result>
      </ROICalculator>
    </div>
  );
}
```

**Expected Impact:**
- 10-15% of active customers subscribe (500-750 members)
- **Revenue:** +€120K-€180K annually

---

## 9. Success Metrics & KPIs

### 9.1 Primary Metrics

| Metric | Current Baseline | 30-Day Target | 90-Day Target | 6-Month Target |
|--------|------------------|---------------|---------------|----------------|
| **Booking Completion Rate (BCR)** | 18-25% | 35-40% | 50-55% | 60-65% |
| **Time-to-Complete (TTC)** | 3-5 min | 2.5-3 min | 2-2.5 min | 1.5-2 min |
| **Step 3 Abandonment Rate** | 40-50% | 25-30% | 15-20% | 10-15% |
| **Average Order Value (AOV)** | €51.77 | €54-56 | €58-60 | €62-65 |
| **Monthly Revenue** | €21.5K | €35-40K | €65-75K | €110-130K |

### 9.2 Secondary Metrics

**User Behavior:**
- Back button usage: <25% of bookings (from 45%)
- Rage click incidents: <2% of sessions (from ~8% estimated)
- Field refill rate: <10% (indicates clear labels)
- Mobile completion parity: >85% (mobile BCR / desktop BCR)

**Engagement:**
- Price calculator opens: >30% of users
- Trip details modal opens: >20% of users
- "Send Again" feature usage: >15% of repeat customers

**Conversion Funnel:**
```
Target Funnel (90-Day):
Step 1 (Search & Select): 90% completion (+5%)
Step 2 (Booking Form): 65% completion (+31%)
Payment Success: 55% completion (+30%)
Overall BCR: 50-55%
```

### 9.3 Business Impact Metrics

**Revenue:**
- Monthly Recurring Revenue (subscriptions): €5K by Month 6
- Upsell attach rate: 20% average across all upsells
- Revenue per available trip capacity: +40%

**Customer Lifetime Value (CLV):**
- Non-member CLV: €204 → €300 (+47%)
- Member CLV: €461 → €600 (+30%)
- Subscription CLV: €1,013 (maintain)

**Operational:**
- Support ticket volume: -20% (reduced friction = fewer issues)
- Customs clearance success rate: >95% (with Concierge)
- Delivery failure rate: <3% (better data collection)

### 9.4 Measurement Tools

**Analytics Setup:**
```typescript
// /lib/analytics.ts

// Track booking funnel steps
export function trackBookingStep(
  step: 'search' | 'select' | 'bookingForm' | 'payment',
  data: Record<string, any>
) {
  analytics.track('Booking Step Viewed', {
    step,
    ...data,
    timestamp: new Date().toISOString()
  });
}

// Track form field interactions
export function trackFieldInteraction(
  field: string,
  action: 'focus' | 'blur' | 'change' | 'error',
  value?: any
) {
  analytics.track('Form Field Interaction', {
    field,
    action,
    value: typeof value === 'string' ? value.substring(0, 50) : value, // Truncate for privacy
    timestamp: new Date().toISOString()
  });
}

// Track conversion events
export function trackConversion(
  bookingId: string,
  details: {
    amount: number;
    currency: string;
    tripRoute: string;
    timeTaken: number; // Seconds from start to completion
  }
) {
  analytics.track('Booking Completed', {
    bookingId,
    ...details,
    timestamp: new Date().toISOString()
  });

  // Also track revenue in Google Analytics
  gtag('event', 'purchase', {
    transaction_id: bookingId,
    value: details.amount,
    currency: details.currency,
    items: [{
      item_name: `Parcel Delivery: ${details.tripRoute}`,
      price: details.amount,
      quantity: 1
    }]
  });
}
```

**Monitoring Dashboard:**
```typescript
// /app/admin/analytics/page.tsx

export default function AnalyticsDashboard() {
  const metrics = useMetrics(['bcr', 'ttc', 'aov', 'revenue']);

  return (
    <Dashboard>
      <MetricsGrid>
        <MetricCard
          title="Booking Completion Rate"
          value={metrics.bcr.current}
          target={metrics.bcr.target}
          trend={metrics.bcr.trend} // +15.3% vs last week
          format="percentage"
        />

        <MetricCard
          title="Time-to-Complete"
          value={metrics.ttc.current}
          target={metrics.ttc.target}
          trend={metrics.ttc.trend} // -32s vs last week
          format="duration"
        />

        <MetricCard
          title="Average Order Value"
          value={metrics.aov.current}
          target={metrics.aov.target}
          trend={metrics.aov.trend} // +€3.20 vs last week
          format="currency"
        />

        <MetricCard
          title="Monthly Revenue"
          value={metrics.revenue.current}
          target={metrics.revenue.target}
          trend={metrics.revenue.trend} // +€12.5K vs last month
          format="currency"
        />
      </MetricsGrid>

      <FunnelVisualization data={metrics.funnel} />

      <Heatmaps>
        <HeatmapCard title="Rage Clicks" data={metrics.rageClicks} />
        <HeatmapCard title="Dead Clicks" data={metrics.deadClicks} />
        <HeatmapCard title="Scroll Depth" data={metrics.scrollDepth} />
      </Heatmaps>
    </Dashboard>
  );
}
```

---

## 10. Implementation Roadmap

### 10.1 Phase 1: Quick Wins (Weeks 1-4)

**Week 1:**
- ✅ Show price estimates on trip cards (Step 2)
- ✅ Add smart weight defaults (2kg, 5kg, 10kg, 20kg buttons)
- ✅ Add price anchoring ("Regular €58, Your Price €51.77")

**Week 2:**
- ✅ Auto-fill sender details from user profile
- ✅ Simplify packaging to 3 options (Small/Medium/Large)
- ✅ Add inline phone validation (libphonenumber.js)

**Week 3:**
- ✅ Implement sticky price calculator fix (mobile z-index)
- ✅ Add capacity indicator with visual feedback
- ✅ Set up analytics tracking (funnel steps, field interactions)

**Week 4:**
- ✅ A/B test setup (50/50 split: current vs. optimized)
- ✅ Deploy to staging for QA
- ✅ Launch to 20% of production traffic

**Milestone:** BCR increases to 35-40% (+15-20% improvement)
**Revenue Impact:** +€210K-€305K annually

---

### 10.2 Phase 2: Conversion Optimization (Weeks 5-8)

**Week 5:**
- Reduce Step 3 to 3-4 required fields
- Build post-booking "Complete Details" flow
- Implement auto-expanding form sections

**Week 6:**
- Add "Save Draft" functionality (session storage)
- Implement real-time validation (all fields)
- Add address autocomplete (Google Places API)

**Week 7:**
- Merge Steps 1+2 (Smart Search & Select component)
- Implement instant search results
- Add trip card price estimates

**Week 8:**
- Full regression testing
- Performance optimization (bundle size, Lighthouse scores)
- Deploy to 50% of traffic (if metrics positive)

**Milestone:** BCR increases to 50-55% (+160% vs. baseline)
**Revenue Impact:** +€450K-€600K annually (cumulative)

---

### 10.3 Phase 3: Revenue Expansion (Weeks 9-12)

**Week 9:**
- Launch tiered insurance upsell (Basic/Standard/Premium/Full)
- Implement dynamic pricing (booking lead time)
- Add Customs Concierge upsell

**Week 10:**
- Implement route demand-based pricing
- Add SMS notification upsell
- Build subscription landing page

**Week 11:**
- Launch TawsilGo Plus subscription program
- Implement Stripe recurring billing
- Build member dashboard

**Week 12:**
- Full rollout to 100% of traffic (if BCR >55%)
- Monitor revenue metrics
- Begin Phase 4 planning

**Milestone:** Monthly revenue €65-75K (+200-250% vs. baseline)
**Revenue Impact:** +€720K-€900K annually (cumulative)

---

### 10.4 Phase 4: Scale Enablement (Months 4-6)

**Month 4:**
- Morocco payment methods (Cash on Delivery, Orange Money, inwi Money)
- Customs declaration integration (Morocco ADII API)
- Multi-parcel booking UI

**Month 5:**
- Business dashboard (bulk upload, CSV import)
- API partnerships (Shopify, WooCommerce plugins)
- Driver capacity recommendation engine

**Month 6:**
- Elasticsearch trip search (scalability for 10x volume)
- Database read replicas
- Redis caching layer

**Milestone:** €1.5M-€2.0M annual run rate (5-7x baseline)

---

### 10.5 Resource Allocation

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|------|---------|---------|---------|---------|-------|
| **Frontend Developer** | 4 weeks | 4 weeks | 2 weeks | 2 weeks | 12 weeks |
| **Backend Developer** | 2 weeks | 3 weeks | 4 weeks | 6 weeks | 15 weeks |
| **Product Designer** | 2 weeks | 2 weeks | 1 week | 1 week | 6 weeks |
| **Product Manager** | 4 weeks | 4 weeks | 4 weeks | 4 weeks | 16 weeks |
| **QA Engineer** | 1 week | 2 weeks | 2 weeks | 3 weeks | 8 weeks |

**Total Cost Estimate:**
- Frontend: 12 weeks × €5,000/week = €60,000
- Backend: 15 weeks × €6,000/week = €90,000
- Design: 6 weeks × €4,000/week = €24,000
- PM: 16 weeks × €5,000/week = €80,000
- QA: 8 weeks × €4,000/week = €32,000
- **Total:** **€286,000** (6-month investment)

**ROI Calculation:**
- Year 1 Revenue Increase: +€720K-€900K (mid-point: €810K)
- Investment: €286K
- **Net Profit Year 1:** €524K
- **ROI:** 183% in first year
- **Payback Period:** 4.2 months

---

## 11. Risk Management

### 11.1 Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Users confused by auto-expanding sections** | Medium | Medium | Add subtle animation + scroll hint, A/B test |
| **Removing review step reduces trust** | Medium | High | Show inline summary card, add "Review" button before payment |
| **Performance degrades on low-end devices** | Low | Medium | Implement lazy loading, reduce animations on slow devices |
| **Backend API can't handle 2x traffic** | Low | High | Add rate limiting, queue system, horizontal scaling |
| **A/B test shows no improvement** | Low | Critical | Revert to old flow, gather user feedback, iterate |
| **Stripe integration breaks** | Low | Critical | Implement fallback payment methods, rigorous testing |

### 11.2 Rollback Plan

**If BCR drops below 20% at any phase:**
1. Immediately revert to previous version (feature flag toggle)
2. Analyze session recordings (Hotjar/FullStory) for failure points
3. Conduct emergency user testing (5-10 participants)
4. Fix critical issues within 48 hours
5. Gradual re-rollout (10% → 25% → 50% → 100%)

**Feature Flag Implementation:**
```typescript
// /lib/feature-flags.ts
import { useFeatureFlag } from '@/lib/unleash';

export function useOptimizedBookingFlow() {
  const enabled = useFeatureFlag('optimized_booking_flow_v2');
  return enabled;
}

// Usage in page.tsx
export default function BookParcelPage() {
  const useOptimizedFlow = useOptimizedBookingFlow();

  if (useOptimizedFlow) {
    return <NewBookingFlow />;
  } else {
    return <CurrentBookingFlow />;
  }
}
```

### 11.3 Contingency Plans

**If Morocco Payment Methods Delayed:**
- Focus on EU-side customers (80% of current volume)
- Offer "Pay at Pickup" for Morocco-based senders (driver collects)
- Partner with local payment gateway (e.g., CMI Morocco)

**If Subscription Adoption <5%:**
- Increase benefits (e.g., 15% discount instead of 10%)
- Add free trial (30 days, no credit card)
- Target high-frequency users with personalized offers

**If Dynamic Pricing Causes Backlash:**
- Show comparison with competitors to justify pricing
- Add "Price Guarantee" badge for early bookers
- Limit surge pricing to 15% max (vs. 20% planned)

---

## 12. Appendix

### 12.1 Glossary

**BCR (Booking Completion Rate):** Percentage of users who start booking and successfully complete payment.

**TTC (Time-to-Complete):** Median time from landing on booking page to payment confirmation.

**AOV (Average Order Value):** Average revenue per completed booking.

**CLV (Customer Lifetime Value):** Total revenue expected from a customer over their entire relationship with TawsilGo.

**Progressive Disclosure:** UX pattern where complex information is revealed gradually as needed.

**Smart Defaults:** Pre-filled form values based on user profile, historical data, or ML predictions.

---

### 12.2 References

**UX Research:**
- Nielsen Norman Group: 10 Usability Heuristics
- Luke Wroblewski: Mobile First Design Principles
- Steven Hoober: Thumb Zone Research

**Pricing Psychology:**
- Cialdini, Robert: Influence: The Psychology of Persuasion
- Ariely, Dan: Predictably Irrational (anchoring effects)

**Logistics Industry:**
- Statista: European E-Commerce Logistics Market Report 2025
- DHL: Cross-Border E-Commerce Barometer 2024
- McKinsey: The Future of Last-Mile Delivery (2023)

---

### 12.3 Competitive Analysis Data

**Booking Flow Comparison (Detailed):**

| Provider | Steps | Fields | Time | Mobile UX | Price Discovery | Auth Req? |
|----------|-------|--------|------|-----------|-----------------|-----------|
| **DHL** | 6 | 15+ | 6-8 min | Poor (2/5) | Step 4 | Yes (mandatory) |
| **UPS** | 5 | 12+ | 5-7 min | Moderate (3/5) | Step 3 | Yes (after quote) |
| **Aramex** | 4 | 10+ | 4-6 min | Poor (2/5) | Step 3 | Yes (mandatory) |
| **La Poste** | 5 | 9 | 5-7 min | Moderate (3/5) | Step 2 | No (guest ok) |
| **TawsilGo (Current)** | 4 | 9 | 3-5 min | Excellent (5/5) | Step 4 | No (guest ok) |
| **TawsilGo (Optimized)** | 2 | 3-4 | 1.5-2 min | Excellent (5/5) | **Step 1** | No (guest ok) |

---

### 12.4 User Testing Script

**Pre-Test:**
1. Recruit 8-10 participants (50% diaspora, 50% business users)
2. Screen for: Sent parcel internationally in last 12 months, comfortable with mobile devices
3. Set up screen recording + think-aloud protocol

**Test Scenario:**
```
"You need to send a 10kg package from Paris to your family in Casablanca.
The package contains clothing and a smartphone (value €350).
You'd like it delivered by next weekend if possible.

Use this prototype to complete the booking."
```

**Observation Checklist:**
- [ ] Time to complete booking (goal: <2 minutes)
- [ ] Number of errors/backtracks
- [ ] Moments of confusion (pause >5 seconds)
- [ ] Reaction to price display
- [ ] Reaction to auto-expanding sections
- [ ] Completion without assistance

**Post-Test Survey:**
1. How easy was the booking process? (1-5 scale)
2. Was the price clear and transparent? (Yes/No)
3. Did you feel confident your parcel would be delivered safely? (Yes/No)
4. What would you change about this experience?

---

### 12.5 Technical Specifications

**Browser Support Matrix:**

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| iOS Safari | 14+ | ✅ Full support |
| Android Chrome | 90+ | ✅ Full support |
| IE 11 | - | ❌ Not supported |

**Performance Budgets:**

| Metric | Target | Max Allowed |
|--------|--------|-------------|
| First Contentful Paint (FCP) | <1.0s | 1.5s |
| Largest Contentful Paint (LCP) | <1.8s | 2.5s |
| Time to Interactive (TTI) | <2.5s | 3.5s |
| Cumulative Layout Shift (CLS) | <0.05 | 0.1 |
| Total Bundle Size | <500KB | 600KB |
| JavaScript Bundle | <300KB | 400KB |

---

### 12.6 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | Oct 25, 2025 | UX Team | Initial draft |
| 0.5 | Oct 26, 2025 | Product Team | Added business analysis |
| 0.8 | Oct 27, 2025 | Engineering | Technical specifications |
| 1.0 | Oct 28, 2025 | Product Lead | Final review, approved |

---

## Approval Signatures

**Product Owner:** _________________________ Date: _________

**Engineering Lead:** _________________________ Date: _________

**Design Lead:** _________________________ Date: _________

**Business Stakeholder:** _________________________ Date: _________

---

**End of Document**

*This PRD is a living document and will be updated as the project progresses. All feedback and suggestions should be submitted via the project's issue tracker or directly to the Product Manager.*
