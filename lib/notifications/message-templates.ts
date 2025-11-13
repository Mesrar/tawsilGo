import type {
  NotificationTrigger,
  NotificationTemplate,
  NotificationLanguage,
  NotificationChannel,
} from "@/types/notification";

/**
 * Multi-Language Message Templates
 *
 * Supports 4 languages:
 * - EN (English) - Default, international customers
 * - FR (French) - France, Belgium, Morocco French speakers
 * - AR (Arabic) - Morocco, Algeria
 * - ES (Spanish) - Spain
 *
 * Template variables use {{variableName}} syntax
 * Available variables: See NotificationTemplateData in types/notification.ts
 */

type TemplateKey = `${NotificationTrigger}_${NotificationChannel}_${NotificationLanguage}`;

/**
 * SMS Templates (160 characters max for single message)
 */
const SMS_TEMPLATES: Record<string, string> = {
  // 1. BOOKING_CONFIRMED
  "BOOKING_CONFIRMED_SMS_en":
    "✅ Booking confirmed! Track {{trackingNumber}} at {{trackingUrl}}. Est. delivery: {{estimatedDeliveryDate}}. - TawsilGo",
  "BOOKING_CONFIRMED_SMS_fr":
    "✅ Réservation confirmée! Suivez {{trackingNumber}} sur {{trackingUrl}}. Livraison prévue: {{estimatedDeliveryDate}}. - TawsilGo",
  "BOOKING_CONFIRMED_SMS_ar":
    "✅ تم تأكيد الحجز! تتبع {{trackingNumber}} على {{trackingUrl}}. التسليم المتوقع: {{estimatedDeliveryDate}} - ترانسالام",
  "BOOKING_CONFIRMED_SMS_es":
    "✅ Reserva confirmada! Rastrea {{trackingNumber}} en {{trackingUrl}}. Entrega estimada: {{estimatedDeliveryDate}}. - TawsilGo",

  // 2. PICKUP_SCHEDULED
  "PICKUP_SCHEDULED_SMS_en":
    "📦 Pickup scheduled for {{trackingNumber}} on {{estimatedDeliveryDate}}. Track progress: {{trackingUrl}}",
  "PICKUP_SCHEDULED_SMS_fr":
    "📦 Enlèvement prévu pour {{trackingNumber}} le {{estimatedDeliveryDate}}. Suivez: {{trackingUrl}}",
  "PICKUP_SCHEDULED_SMS_ar":
    "📦 تم جدولة الاستلام ل {{trackingNumber}} في {{estimatedDeliveryDate}}. التتبع: {{trackingUrl}}",
  "PICKUP_SCHEDULED_SMS_es":
    "📦 Recogida programada para {{trackingNumber}} el {{estimatedDeliveryDate}}. Rastrea: {{trackingUrl}}",

  // 3. IN_TRANSIT
  "IN_TRANSIT_SMS_en":
    "🚌 {{trackingNumber}} is in transit from {{origin}}! Currently at {{currentLocation}}. Track: {{trackingUrl}}",
  "IN_TRANSIT_SMS_fr":
    "🚌 {{trackingNumber}} en transit depuis {{origin}}! Actuellement à {{currentLocation}}. Suivez: {{trackingUrl}}",
  "IN_TRANSIT_SMS_ar":
    "🚌 {{trackingNumber}} في الطريق من {{origin}}! حاليا في {{currentLocation}}. التتبع: {{trackingUrl}}",
  "IN_TRANSIT_SMS_es":
    "🚌 {{trackingNumber}} en tránsito desde {{origin}}! Actualmente en {{currentLocation}}. Rastrea: {{trackingUrl}}",

  // 5. CUSTOMS_SUBMITTED
  "CUSTOMS_SUBMITTED_SMS_en":
    "🛃 {{trackingNumber}} submitted to customs. Clearance typically takes 6-48h. We'll notify you when cleared. {{trackingUrl}}",
  "CUSTOMS_SUBMITTED_SMS_fr":
    "🛃 {{trackingNumber}} soumis à la douane. Dédouanement: 6-48h. Notification à la libération. {{trackingUrl}}",
  "CUSTOMS_SUBMITTED_SMS_ar":
    "🛃 {{trackingNumber}} تم تقديمه للجمارك. التخليص عادة 6-48 ساعة. سنخطرك عند الإفراج. {{trackingUrl}}",
  "CUSTOMS_SUBMITTED_SMS_es":
    "🛃 {{trackingNumber}} enviado a aduanas. Despacho: 6-48h. Te notificaremos cuando se despache. {{trackingUrl}}",

  // 6. DUTY_PAYMENT_REQUIRED
  "DUTY_PAYMENT_REQUIRED_SMS_en":
    "⚠️ ACTION REQUIRED: {{trackingNumber}} needs duty payment ({{dutyCurrency}}{{dutyAmount}}). Pay now: {{dutyPaymentUrl}}. Deadline: 30 days.",
  "DUTY_PAYMENT_REQUIRED_SMS_fr":
    "⚠️ ACTION REQUISE: {{trackingNumber}} nécessite paiement des droits ({{dutyCurrency}}{{dutyAmount}}). Payer: {{dutyPaymentUrl}}. Délai: 30j.",
  "DUTY_PAYMENT_REQUIRED_SMS_ar":
    "⚠️ مطلوب إجراء: {{trackingNumber}} يحتاج دفع الرسوم ({{dutyCurrency}}{{dutyAmount}}). ادفع الآن: {{dutyPaymentUrl}}. المهلة: 30 يوم.",
  "DUTY_PAYMENT_REQUIRED_SMS_es":
    "⚠️ ACCIÓN REQUERIDA: {{trackingNumber}} necesita pago de derechos ({{dutyCurrency}}{{dutyAmount}}). Pagar: {{dutyPaymentUrl}}. Plazo: 30 días.",

  // 7. CUSTOMS_CLEARED
  "CUSTOMS_CLEARED_SMS_en":
    "✅ {{trackingNumber}} cleared customs! Your package will arrive by {{estimatedDeliveryDate}}. {{trackingUrl}}",
  "CUSTOMS_CLEARED_SMS_fr":
    "✅ {{trackingNumber}} dédouané! Livraison prévue le {{estimatedDeliveryDate}}. {{trackingUrl}}",
  "CUSTOMS_CLEARED_SMS_ar":
    "✅ {{trackingNumber}} تم تخليصه من الجمارك! سيصل طردك بحلول {{estimatedDeliveryDate}}. {{trackingUrl}}",
  "CUSTOMS_CLEARED_SMS_es":
    "✅ {{trackingNumber}} despachado! Tu paquete llegará el {{estimatedDeliveryDate}}. {{trackingUrl}}",

  // 8. OUT_FOR_DELIVERY
  "OUT_FOR_DELIVERY_SMS_en":
    "🚚 {{trackingNumber}} out for delivery TODAY! Your driver is {{driverName}}. Track live: {{trackingUrl}}",
  "OUT_FOR_DELIVERY_SMS_fr":
    "🚚 {{trackingNumber}} en livraison AUJOURD'HUI! Chauffeur: {{driverName}}. Suivez en direct: {{trackingUrl}}",
  "OUT_FOR_DELIVERY_SMS_ar":
    "🚚 {{trackingNumber}} في طريقه للتسليم اليوم! السائق: {{driverName}}. التتبع المباشر: {{trackingUrl}}",
  "OUT_FOR_DELIVERY_SMS_es":
    "🚚 {{trackingNumber}} en reparto HOY! Tu conductor: {{driverName}}. Rastrea en vivo: {{trackingUrl}}",

  // 9. DELIVERY_WINDOW
  "DELIVERY_WINDOW_SMS_en":
    "⏰ {{driverName}} will arrive in 30 minutes with {{trackingNumber}}! Delivery window: {{deliveryWindow}}. Call: {{driverPhone}}",
  "DELIVERY_WINDOW_SMS_fr":
    "⏰ {{driverName}} arrivera dans 30 min avec {{trackingNumber}}! Fenêtre: {{deliveryWindow}}. Appeler: {{driverPhone}}",
  "DELIVERY_WINDOW_SMS_ar":
    "⏰ {{driverName}} سيصل في 30 دقيقة مع {{trackingNumber}}! نافذة التسليم: {{deliveryWindow}}. اتصل: {{driverPhone}}",
  "DELIVERY_WINDOW_SMS_es":
    "⏰ {{driverName}} llegará en 30 min con {{trackingNumber}}! Ventana: {{deliveryWindow}}. Llamar: {{driverPhone}}",

  // 10. DELIVERED
  "DELIVERED_SMS_en":
    "✅ {{trackingNumber}} delivered! Rate your experience: {{trackingUrl}}. Book again & save 10%!",
  "DELIVERED_SMS_fr":
    "✅ {{trackingNumber}} livré! Notez votre expérience: {{trackingUrl}}. Réservez à nouveau, -10%!",
  "DELIVERED_SMS_ar":
    "✅ تم تسليم {{trackingNumber}}! قيم تجربتك: {{trackingUrl}}. احجز مرة أخرى ووفر 10%!",
  "DELIVERED_SMS_es":
    "✅ {{trackingNumber}} entregado! Califica tu experiencia: {{trackingUrl}}. ¡Reserva de nuevo y ahorra 10%!",

  // 11. DELAY_ALERT
  "DELAY_ALERT_SMS_en":
    "⚠️ {{trackingNumber}} delayed due to {{delayReason}}. New ETA: {{newEstimatedDate}}. We'll keep you updated. {{trackingUrl}}",
  "DELAY_ALERT_SMS_fr":
    "⚠️ {{trackingNumber}} retardé: {{delayReason}}. Nouvelle date: {{newEstimatedDate}}. Mises à jour continues. {{trackingUrl}}",
  "DELAY_ALERT_SMS_ar":
    "⚠️ تأخير {{trackingNumber}} بسبب {{delayReason}}. الموعد الجديد: {{newEstimatedDate}}. سنبقيك على اطلاع. {{trackingUrl}}",
  "DELAY_ALERT_SMS_es":
    "⚠️ {{trackingNumber}} retrasado por {{delayReason}}. Nueva fecha: {{newEstimatedDate}}. Te mantendremos informado. {{trackingUrl}}",

  // 12. CUSTOMS_HOLD
  "CUSTOMS_HOLD_SMS_en":
    "⚠️ ACTION REQUIRED: {{trackingNumber}} held at customs. Upload documents now: {{customsDocumentsUrl}}. Need help? {{supportUrl}}",
  "CUSTOMS_HOLD_SMS_fr":
    "⚠️ ACTION REQUISE: {{trackingNumber}} retenu en douane. Téléversez documents: {{customsDocumentsUrl}}. Aide: {{supportUrl}}",
  "CUSTOMS_HOLD_SMS_ar":
    "⚠️ مطلوب إجراء: {{trackingNumber}} محتجز في الجمارك. قم بتحميل المستندات: {{customsDocumentsUrl}}. مساعدة: {{supportUrl}}",
  "CUSTOMS_HOLD_SMS_es":
    "⚠️ ACCIÓN REQUERIDA: {{trackingNumber}} retenido en aduanas. Sube documentos: {{customsDocumentsUrl}}. Ayuda: {{supportUrl}}",
};

/**
 * EMAIL Templates (with subject lines)
 */
const EMAIL_TEMPLATES: Record<string, { subject: string; body: string }> = {
  // 1. BOOKING_CONFIRMED
  "BOOKING_CONFIRMED_EMAIL_en": {
    subject: "Booking Confirmed - {{trackingNumber}} | TawsilGo",
    body: `
Hi {{userName}},

Thank you for choosing TawsilGo! Your booking has been confirmed.

**Tracking Number:** {{trackingNumber}}
**Origin:** {{origin}}
**Destination:** {{destination}}
**Estimated Delivery:** {{estimatedDeliveryDate}}

**What happens next?**
1. Your package will be picked up within 24 hours
2. It will travel via our secure bus network through Europe to Morocco
3. You'll receive SMS updates at every major checkpoint
4. We'll notify you 30 minutes before delivery

**Track Your Package:** {{trackingUrl}}

**Need Help?**
Our support team is available 24/7 at {{supportUrl}}

Safe travels,
The TawsilGo Team
    `,
  },

  "BOOKING_CONFIRMED_EMAIL_fr": {
    subject: "Réservation Confirmée - {{trackingNumber}} | TawsilGo",
    body: `
Bonjour {{userName}},

Merci d'avoir choisi TawsilGo! Votre réservation est confirmée.

**Numéro de suivi:** {{trackingNumber}}
**Origine:** {{origin}}
**Destination:** {{destination}}
**Livraison estimée:** {{estimatedDeliveryDate}}

**Prochaines étapes:**
1. Enlèvement dans les 24 heures
2. Transport sécurisé par notre réseau d'autocars Europe-Maroc
3. Notifications SMS à chaque point de contrôle
4. Alerte 30 min avant livraison

**Suivez votre colis:** {{trackingUrl}}

**Besoin d'aide?**
Support 24/7 disponible sur {{supportUrl}}

Bon voyage,
L'équipe TawsilGo
    `,
  },

  "BOOKING_CONFIRMED_EMAIL_ar": {
    subject: "تم تأكيد الحجز - {{trackingNumber}} | ترانسالام",
    body: `
مرحبا {{userName}}،

شكرا لاختيارك ترانسالام! تم تأكيد حجزك.

**رقم التتبع:** {{trackingNumber}}
**المنشأ:** {{origin}}
**الوجهة:** {{destination}}
**التسليم المتوقع:** {{estimatedDeliveryDate}}

**ماذا بعد؟**
1. سيتم استلام طردك خلال 24 ساعة
2. سينتقل عبر شبكة الحافلات الآمنة من أوروبا إلى المغرب
3. ستتلقى تحديثات SMS في كل نقطة تفتيش رئيسية
4. سنخطرك قبل 30 دقيقة من التسليم

**تتبع طردك:** {{trackingUrl}}

**تحتاج مساعدة؟**
فريق الدعم متاح 24/7 على {{supportUrl}}

رحلة آمنة،
فريق ترانسالام
    `,
  },

  "BOOKING_CONFIRMED_EMAIL_es": {
    subject: "Reserva Confirmada - {{trackingNumber}} | TawsilGo",
    body: `
Hola {{userName}},

¡Gracias por elegir TawsilGo! Tu reserva ha sido confirmada.

**Número de seguimiento:** {{trackingNumber}}
**Origen:** {{origin}}
**Destino:** {{destination}}
**Entrega estimada:** {{estimatedDeliveryDate}}

**¿Qué sigue?**
1. Tu paquete será recogido en 24 horas
2. Viajará por nuestra red segura de autobuses Europa-Marruecos
3. Recibirás actualizaciones SMS en cada punto de control
4. Te notificaremos 30 min antes de la entrega

**Rastrea tu paquete:** {{trackingUrl}}

**¿Necesitas ayuda?**
Soporte 24/7 disponible en {{supportUrl}}

Buen viaje,
El equipo TawsilGo
    `,
  },

  // 6. DUTY_PAYMENT_REQUIRED (Critical - full template)
  "DUTY_PAYMENT_REQUIRED_EMAIL_en": {
    subject: "Action Required: Customs Duty Payment - {{trackingNumber}}",
    body: `
Hi {{userName}},

Your package {{trackingNumber}} has cleared Morocco customs inspection and requires duty payment before release.

**Duty Breakdown:**
- Item Value: {{dutyCurrency}}{{dutyAmount}}
- Customs Duty: Calculated by Morocco customs
- VAT (20%): Applied to dutiable value
- **Total Due: {{dutyCurrency}}{{dutyAmount}}**

**Pay Now to Avoid Delays:**
{{dutyPaymentUrl}}

**Payment Options:**
1. **Pay via TawsilGo** (Recommended) - Instant processing, +€5 fee, package released in 4 hours
2. **Pay at Customs** - 2-5 day delay, must visit customs office in person

**Important:**
- Unpaid packages are held for 30 days, then returned to sender
- You will be charged return shipping fees (€25-40)
- Pay promptly to receive your package on time

**Questions about duty calculation?**
Use our duty calculator: {{trackingUrl}}
Contact customs support: {{supportUrl}}?topic=customs

The TawsilGo Team
    `,
  },

  // 10. DELIVERED (with rating prompt)
  "DELIVERED_EMAIL_en": {
    subject: "Package Delivered - Rate Your Experience | {{trackingNumber}}",
    body: `
Hi {{userName}},

Great news! Your package {{trackingNumber}} was delivered successfully.

**Delivery Details:**
- Delivered by: {{driverName}}
- Delivered at: {{lastUpdateTime}}
- Delivery photo: {{deliveryPhotoUrl}}

**How was your experience?**
Your feedback helps us improve and reward top-performing drivers.

Rate your delivery (takes 30 seconds):
{{trackingUrl}}

**Ship again and save 10%!**
Book your next shipment and automatically receive a 10% discount.

**Need to report an issue?**
Package damaged or missing items? File a claim within 48 hours:
{{supportUrl}}

Thank you for choosing TawsilGo!

P.S. Share your tracking page with friends - they'll get 15% off their first shipment!
    `,
  },
};

/**
 * PUSH Notification Templates (shorter, mobile-optimized)
 */
const PUSH_TEMPLATES: Record<string, { title: string; body: string }> = {
  "BOOKING_CONFIRMED_PUSH_en": {
    title: "Booking Confirmed ✅",
    body: "{{trackingNumber}} confirmed. Est. delivery: {{estimatedDeliveryDate}}",
  },

  "IN_TRANSIT_PUSH_en": {
    title: "Package In Transit 🚌",
    body: "{{trackingNumber}} departed {{origin}}. Currently at {{currentLocation}}",
  },

  "DUTY_PAYMENT_REQUIRED_PUSH_en": {
    title: "Action Required: Duty Payment ⚠️",
    body: "{{trackingNumber}} needs {{dutyCurrency}}{{dutyAmount}} customs duty. Tap to pay.",
  },

  "OUT_FOR_DELIVERY_PUSH_en": {
    title: "Out for Delivery Today! 🚚",
    body: "{{driverName}} is delivering {{trackingNumber}} today. Track live now.",
  },

  "DELIVERY_WINDOW_PUSH_en": {
    title: "Arriving in 30 Minutes ⏰",
    body: "{{driverName}} will arrive soon with {{trackingNumber}}",
  },

  "DELIVERED_PUSH_en": {
    title: "Package Delivered ✅",
    body: "{{trackingNumber}} delivered! Tap to rate your experience.",
  },

  "DELAY_ALERT_PUSH_en": {
    title: "Delivery Delay Alert ⚠️",
    body: "{{trackingNumber}} delayed: {{delayReason}}. New ETA: {{newEstimatedDate}}",
  },

  "CUSTOMS_HOLD_PUSH_en": {
    title: "Action Required: Customs Hold ⚠️",
    body: "{{trackingNumber}} needs documents uploaded. Tap to upload now.",
  },
};

/**
 * Template Registry
 * Combines all templates into a searchable structure
 */
export const MESSAGE_TEMPLATE_REGISTRY: NotificationTemplate[] = [
  // SMS Templates
  ...Object.entries(SMS_TEMPLATES).map(([key, body]) => {
    const [trigger, channel, language] = key.split("_");
    return {
      trigger: trigger as NotificationTrigger,
      channel: channel as NotificationChannel,
      language: language as NotificationLanguage,
      body,
    };
  }),

  // Email Templates
  ...Object.entries(EMAIL_TEMPLATES).map(([key, { subject, body }]) => {
    const [trigger, channel, language] = key.split("_");
    return {
      trigger: trigger as NotificationTrigger,
      channel: channel as NotificationChannel,
      language: language as NotificationLanguage,
      subject,
      body,
    };
  }),

  // Push Templates
  ...Object.entries(PUSH_TEMPLATES).map(([key, { title, body }]) => {
    const [trigger, channel, language] = key.split("_");
    return {
      trigger: trigger as NotificationTrigger,
      channel: channel as NotificationChannel,
      language: language as NotificationLanguage,
      subject: title, // Using subject field for push notification title
      body,
    };
  }),
];

/**
 * Get Template by Trigger, Channel, and Language
 */
export function getTemplate(
  trigger: NotificationTrigger,
  channel: NotificationChannel,
  language: NotificationLanguage = "en"
): NotificationTemplate | undefined {
  return MESSAGE_TEMPLATE_REGISTRY.find(
    (template) =>
      template.trigger === trigger &&
      template.channel === channel &&
      template.language === language
  );
}

/**
 * Render Template with Data
 * Replaces {{variableName}} placeholders with actual values
 */
export function renderTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key]?.toString() || match;
  });
}
