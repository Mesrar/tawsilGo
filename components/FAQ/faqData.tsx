import { ReactNode } from "react"
import { Truck, Package, Globe, Shield, Clock, Users, Mail, CreditCard } from "lucide-react"

type FaqItem = {
  id: number
  title: string
  content: string
  icon: ReactNode
  category?: string
}

export const faqData: FaqItem[] = [
  {
    id: 1,
    title: "How does bus-based delivery to Morocco work?",
    content: "Your package travels with verified bus drivers on regular routes from European cities to Morocco. We partner with trusted bus companies operating daily routes like Paris-Casablanca, Lyon-Marrakech, and Madrid-Tangier. You drop off your package at our pickup point, we hand it to the driver, and it's delivered door-to-door in Morocco with full tracking.",
    icon: <Truck className="h-4 w-4" />,
    category: "shipping"
  },
  {
    id: 2,
    title: "How long does delivery from Europe to Morocco take?",
    content: "Average delivery time is 3-5 days from major European cities to Morocco. Paris to Casablanca typically takes 3-4 days, while routes from Germany or Netherlands take 4-5 days. We provide real-time tracking updates throughout the journey.",
    icon: <Clock className="h-4 w-4" />,
    category: "shipping"
  },
  {
    id: 3,
    title: "What can I send to Morocco? Any customs restrictions?",
    content: "You can send gifts, documents, clothing, electronics, and most personal items. Moroccan customs prohibits weapons, drugs, alcohol, and pork products. Items valued over €40 may require customs declaration. We recommend keeping receipts for electronics and valuable items.",
    icon: <Package className="h-4 w-4" />,
    category: "shipping"
  },
  {
    id: 4,
    title: "Can I ship gifts for Eid or Ramadan?",
    content: "Absolutely! We offer priority Eid shipping to ensure your gifts arrive before the celebration. During Ramadan and Eid periods, we recommend booking 10-14 days in advance due to high demand. Traditional Moroccan pastries, clothing, and gift items are welcome (no perishables).",
    icon: <Package className="h-4 w-4" />,
    category: "shipping"
  },
  {
    id: 5,
    title: "Is my package insured during transit?",
    content: "All shipments include complimentary insurance coverage up to €500. For valuable items like electronics, jewelry, or important documents, we offer premium insurance up to €5,000 for a small additional fee.",
    icon: <Shield className="h-4 w-4" />,
    category: "security"
  },
  {
    id: 6,
    title: "How are bus drivers verified?",
    content: "We only partner with licensed bus companies with established European-Morocco routes. All drivers undergo background checks, have valid commercial driver licenses, and are trained in package handling. Our bus partners have been operating Morocco routes for 10+ years.",
    icon: <Globe className="h-4 w-4" />,
    category: "security"
  },
  {
    id: 7,
    title: "What payment methods do you accept?",
    content: "We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay. You can see prices in both EUR and MAD (Moroccan Dirham). All transactions are processed securely through Stripe with 3D Secure authentication.",
    icon: <CreditCard className="h-4 w-4" />,
    category: "payment"
  },
  {
    id: 8,
    title: "How can I contact customer support?",
    content: "Reach our multilingual support team (French, Arabic, English) via WhatsApp at +33 XX XXX XXXX, email at support@tawsilgo.com, or in-app chat. We're available 7 days a week, 9 AM - 9 PM CET. Average response time is under 2 hours.",
    icon: <Mail className="h-4 w-4" />,
    category: "support"
  },
  {
    id: 9,
    title: "Where can I track my package?",
    content: "Once your package is collected, you'll receive a tracking number via SMS and email. Track in real-time through our mobile app or website. You'll get updates when the bus departs Europe, crosses into Morocco, clears customs, and arrives at the destination city.",
    icon: <Truck className="h-4 w-4" />,
    category: "shipping"
  }
]

export const getCategoryFaqs = (category: string) => {
  return faqData.filter(faq => faq.category === category)
}

export default faqData
