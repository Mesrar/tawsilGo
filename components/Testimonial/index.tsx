"use client";
import SectionHeader from "../Common/SectionHeader";
import { motion } from "framer-motion";
import { testimonialData } from "./testimonialData";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

// Animation variants for smooth transitions
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const Testimonial = () => {
  // Transform testimonialData to match AnimatedTestimonials format
  const transformedTestimonials = testimonialData.map((review) => ({
    quote: review.content,
    name: review.name,
    designation: review.designation,
    src: review.image,
  }));

  return (
    <section className="py-10 px-4 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Section Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-8 text-center"
        >
          <SectionHeader
            headerInfo={{
              title: `TESTIMONIALS`,
              subtitle: `Client's Testimonials`,
              description: `What our clients say about our services.`,
            }}
          />
        </motion.div>

        {/* Animated Testimonials */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-4"
        >
          <AnimatedTestimonials
            testimonials={transformedTestimonials}
            autoplay={true}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
