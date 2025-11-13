import { motion } from "framer-motion"
import { ReactNode } from "react"
import { ChevronDown } from "lucide-react"

type FaqData = {
  activeFaq: number
  id: number
  handleFaqToggle: (id: number) => void
  title: string
  content: string
  icon: ReactNode
}

const FAQItem = ({ faqData }: { faqData: FaqData }) => {
  const { activeFaq, id, handleFaqToggle, title, content, icon } = faqData
  
  const isActive = activeFaq === id

  return (
    <motion.div
      className="border-b border-gray-100 last:border-0 dark:border-gray-800"
      initial={false}
      animate={{ backgroundColor: isActive ? "hsl(var(--background-secondary))" : "transparent" }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={() => handleFaqToggle(id)}
        className="flex w-full min-h-[64px] cursor-pointer items-start justify-between gap-3 p-4 text-left transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
        aria-expanded={isActive}
        aria-controls={`faq-content-${id}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white">
            {icon}
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        
        <motion.div
          className="ml-2 flex-shrink-0 mt-1"
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>
      
      <motion.div
        id={`faq-content-${id}`}
        initial={false}
        animate={{ 
          height: isActive ? "auto" : 0,
          opacity: isActive ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 dark:text-gray-300">
          <div className="space-y-2 border-l-2 border-blue-500 pl-3 text-sm">
            {content.split('\n').map((text, index) => (
              <p key={index} className="leading-relaxed">{text}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FAQItem