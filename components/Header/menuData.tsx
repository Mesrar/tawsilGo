import { Menu } from "@/types/menu";

export const getMenuData = (t: (key: string) => string): Menu[] => [
  {
    id: 1,
    title: t('home'),
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: t('services'),
    newTab: false,
    submenu: [
      {
        id: 21,
        title: t('individualShipping'),
        newTab: false,
        path: "/services/individual-shipping",
      },
      {
        id: 22,
        title: t('businessSolutions'),
        newTab: false,
        path: "/services/business-solutions",
      },
      {
        id: 23,
        title: t('routeCoverage'),
        newTab: false,
        path: "/services/route-coverage",
      },
      {
        id: 24,
        title: t('howItWorks'),
        newTab: false,
        path: "/services/how-it-works",
      },
      {
        id: 25,
        title: t('specializedServices'),
        newTab: false,
        path: "/services/specialized",
      },
    ],
  },
  {
    id: 3,
    title: t('pricing'),
    newTab: false,
    path: "/pricing",
  },
  {
    id: 4,
    title: t('tracking'),
    newTab: false,
    path: "/tracking",
  },
  {
    id: 5,
    title: t('support'),
    newTab: false,
    path: "/support",
  },
];

// Keep backward compatibility - default export with English
const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Services",
    newTab: false,
    submenu: [
      {
        id: 21,
        title: "Individual Shipping",
        newTab: false,
        path: "/services/individual-shipping",
      },
      {
        id: 22,
        title: "Business Solutions",
        newTab: false,
        path: "/services/business-solutions",
      },
      {
        id: 23,
        title: "Route Coverage",
        newTab: false,
        path: "/services/route-coverage",
      },
      {
        id: 24,
        title: "How It Works",
        newTab: false,
        path: "/services/how-it-works",
      },
      {
        id: 25,
        title: "Specialized Services",
        newTab: false,
        path: "/services/specialized",
      },
    ],
  },
  {
    id: 3,
    title: "Pricing",
    newTab: false,
    path: "/pricing",
  },
  {
    id: 4,
    title: "Tracking",
    newTab: false,
    path: "/tracking",
  },
  {
    id: 5,
    title: "Support",
    newTab: false,
    path: "/support",
  },
];

export default menuData;
