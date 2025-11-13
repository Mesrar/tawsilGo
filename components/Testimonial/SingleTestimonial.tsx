import { Testimonial } from "@/types/testimonial";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./testimonial.module.css";

// Importing modern stroke-based SVG icon from Heroicons
import { StarIcon, QuoteIcon } from "./icons";

const SingleTestimonial = ({ review }: { review: Testimonial }) => {
  const { name, designation, image, content } = review;
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="testimonial-card rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 dark:border dark:border-gray-800 h-full flex flex-col"
    >
      {/* Quote icon for visual interest */}
      <div className="text-primary-500 dark:text-primary-400 mb-4">
        <QuoteIcon className="w-8 h-8" />
      </div>
      
      {/* Testimonial content */}
      <p className="text-base text-gray-700 dark:text-gray-300 mb-6 flex-grow leading-relaxed">
        {content}
      </p>
      
      {/* Author information with improved layout */}
      <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image 
            src={image} 
            alt={name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-lg text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {designation}
          </p>
        </div>
        <div className="ml-auto flex text-amber-400">
          <StarIcon className="w-5 h-5" />
          <StarIcon className="w-5 h-5" />
          <StarIcon className="w-5 h-5" />
          <StarIcon className="w-5 h-5" />
          <StarIcon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default SingleTestimonial;
