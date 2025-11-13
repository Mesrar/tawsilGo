import React from "react";
import { Feature } from "@/types/feature";
import Image from "next/image";
import { motion } from "framer-motion";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, description, badge, progress } = feature

  return (
    <>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-850"
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-blue-600 to-green-600 px-3 py-1 text-xs font-medium text-white">
          {badge}
        </span>
      )}

      <div className="relative mb-6 h-16 w-16">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 opacity-10 transition-all group-hover:opacity-20" />
        <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-green-600 shadow-lg">
          {icon}
        </div>
      </div>

      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mb-6 text-gray-600 dark:text-gray-300">{description}</p>

      {progress && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{progress}%</span>
        </div>
      )}

      <div className="absolute inset-0 -z-10 opacity-0 transition-all group-hover:opacity-100">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/5 to-green-600/5" />
      </div>
    </motion.div>
    </>
  );
};

export default SingleFeature;
