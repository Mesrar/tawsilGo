import { motion } from "framer-motion"
import Image from "next/image"
import { FeatureTab } from "@/types/featureTab"

const FeaturesTabItem = ({ featureTab }: { featureTab: FeatureTab }) => {
  const { title, description, image, list, stats } = featureTab

  return (
    <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16 xl:gap-24">
      {/* Text Content */}
      <div className="w-full lg:w-1/2">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl xl:text-5xl"
        >
          {title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-lg text-gray-600 dark:text-gray-300"
        >
          {description}
        </motion.p>

        {/* Feature List */}
        <div className="space-y-6">
          {list?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="flex gap-4 rounded-xl p-4 transition-all hover:bg-white hover:shadow-lg dark:hover:bg-gray-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-2"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-850"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Image Container */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full lg:w-1/2"
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain dark:hidden"
          />
          <Image
            src={image}
            alt={title}
            fill
            className="hidden object-contain dark:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent" />
        </div>
      </motion.div>
    </div>
  )
}

export default FeaturesTabItem