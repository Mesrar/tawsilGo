"use client";
import { motion } from "framer-motion";

type HeaderInfo = {
  title: string;
  subtitle: string;
  description: string;
  highlighted: string;
};

const SectionHeader = ({ headerInfo }: { headerInfo: HeaderInfo }) => {
  const { title, subtitle, description } = headerInfo;

  return (
    <>
      {/* <!-- Section Title Start --> */}
      <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <h4 className="mb-4 text-lg font-medium text-blue-600 dark:text-blue-300">
      {headerInfo.subtitle}
    </h4>
    <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
      {headerInfo.title}
      <span className="relative mx-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
        {headerInfo.highlighted}
      </span>
    </h2>
    <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
      {headerInfo.description}
    </p>
  </motion.div>

      {/* <!-- Section Title End --> */}
    </>
  );
};

export default SectionHeader;
