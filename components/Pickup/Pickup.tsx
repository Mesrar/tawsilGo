"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { MapPin, Package, Send, Truck, Weight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const parcelFormSchema = z.object({
  departure: z.string().nonempty("Please select a departure country."),
  destination: z.string().nonempty("Please select a destination country."),
  dimensions: z.string().nonempty("Please select the format of the parcel."),
  weight: z
    .number({
      invalid_type_error: "Weight must be a number.",
    })
    .positive("Weight must be greater than 0.")
    .max(30, "Weight must not exceed 30kg."), // Adjust as per your system constraints
  sendingMode: z.string().nonempty("Please select a mode of sending."),
  deliveryMode: z.string().nonempty("Please select a delivery mode."),
});

const Pickup = () => {
  const form = useForm<z.infer<typeof parcelFormSchema>>({
    resolver: zodResolver(parcelFormSchema),
    defaultValues: {
      departure: "",
      destination: "",
      dimensions: "",
      weight: undefined,
      sendingMode: "",
      deliveryMode: "",
    },
  });

  function onSubmit(data: z.infer<typeof parcelFormSchema>) {
    toast({
      title: "Order Submitted:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      
      <div className="flex justify-center items-center  bg-gray-100 dark:bg-gray-900 p-4">
         </div>
    </>
  );
};

export default Pickup;
