import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type Feature = {
  id: number;
  icon: ReactNode;
  title: string;
  description: string;
  badge: ReactNode,
  progress: number
};
