import { twMerge } from "tailwind-merge"
import { CheckIcon, TruckIcon, PackageIcon, ClockIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type StepProps = {
  id: number
  isLast?: boolean
  currentStep: number
  title: string
  description?: string
  status?: "pending" | "in-transit" | "delayed" | "completed"
}

export function Step({ id, isLast = false, currentStep, title, description, status }: StepProps) {
  const isActive = currentStep === id - 1
  const isPast = currentStep > id - 1
  const progressWidth = isActive ? "w-1/2" : isPast ? "w-full" : "w-0"
  const isDelayed = status === "delayed"

  const statusColors = {
    completed: "bg-green-500 border-green-600",
    active: "bg-blue-500 border-blue-600",
    delayed: "bg-amber-500 border-amber-600",
    pending: "bg-gray-200 border-gray-300",
  }

  const getStatusColor = () => {
    if (isPast) return statusColors.completed
    if (isActive) return isDelayed ? statusColors.delayed : statusColors.active
    return statusColors.pending
  }

  const getStepIcon = () => {
    if (isPast) return <CheckIcon className="w-4 h-4 text-white" />
    if (isActive) {
      switch (status) {
        case "in-transit": return <TruckIcon className="w-4 h-4 text-white animate-bounce" />
        case "delayed": return <ClockIcon className="w-4 h-4 text-white" />
        default: return <PackageIcon className="w-4 h-4 text-white" />
      }
    }
    return <span className="text-sm font-medium text-gray-500">{id}</span>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex flex-col items-center relative"
            role="progressbar"
            aria-valuenow={isPast ? 100 : isActive ? 50 : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Shipping step: ${title}`}
          >
            <div className={twMerge(
              "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
              getStatusColor(),
              isActive && "ring-4 ring-blue-200",
              isDelayed && "ring-4 ring-amber-200"
            )}>
              {getStepIcon()}
            </div>
            
            {!isLast && (
              <div className="w-full h-1 mt-4 bg-gray-100">
                <div className={twMerge(
                  "h-1 transition-all duration-500 ease-out",
                  isPast ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-200",
                  progressWidth
                )} />
              </div>
            )}
          </div>
        </TooltipTrigger>
        
        <TooltipContent side="bottom" className="max-w-[200px]">
          <div className="space-y-1">
            <h4 className="font-semibold text-gray-50">{title}</h4>
            {description && <p className="text-sm text-gray-600">{description}</p>}
            {status === "delayed" && (
              <p className="text-xs text-amber-600">Delay: Estimated +2 hours</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}