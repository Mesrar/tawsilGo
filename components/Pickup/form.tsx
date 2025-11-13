"use client"
import { Step } from "./step"
import { useState } from "react"
import { type FieldName, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StepThree } from "./step-three"
import { parcelFormSchema, type ParcelFormSchema } from "@/lib/schema"
import { StepOne } from "./step-one"
import { StepTwo } from "./step-two"
import Resume from "./resume"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Our Services",
    description: "Select which service you're interested in",
    component: <StepOne />,
    fields: ["interestedService"],
  },
  {
    id: 2,
    title: "Parcel Details",
    description: "Provide details about your parcel",
    component: <StepTwo />,
    fields: ["departure", "destination", "dimensions", "weight", "sendingMode", "deliveryMode"],
  },
  {
    id: 3,
    title: "Contact Information",
    description: "Enter sender and receiver details",
    component: <StepThree />,
    fields: [
      "senderDetails.name",
      "senderDetails.email",
      "senderDetails.phone",
      "senderDetails.address",
      "receiverDetails.name",
      "receiverDetails.email",
      "receiverDetails.phone",
      "receiverDetails.address",
    ],
  },
  {
    id: 4,
    title: "Review & Submit",
    component: <Resume />,
    description: "Verify your information and submit request",
    isLast: true,
  },
]

export function MainForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const methods = useForm<ParcelFormSchema>({
    resolver: zodResolver(parcelFormSchema),
    mode: "onBlur",
  })

  const { data: session } = useSession() as { data: { accessToken?: string } | null }

  const progress = ((currentStep + 1) / steps.length) * 100

  async function onSubmit(data: ParcelFormSchema) {
    setIsSubmitting(true)
    try {
      const token = session?.accessToken
      if (!token) {
        throw new Error("Authentication required. Please login.")
      }
      
      const response = await fetch("http://localhost:8080/parcel/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Submission failed. Please try again.")
      }

      setShowSuccess(true)
      methods.reset()
      setTimeout(() => setCurrentStep(0), 3000)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function nextStep() {
    const fields = steps[currentStep].fields
    const isValid = await methods.trigger(fields as FieldName<ParcelFormSchema>[] as any, {
      shouldFocus: true,
    })

    if (!isValid) return

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (currentStep === steps.length - 1) {
      await methods.handleSubmit(onSubmit)()
    }
  }

  function previousStep() {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (showSuccess) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-10 text-center">
        <CardHeader>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">
            Quote Request Submitted!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            We've received your request and will contact you within 24-48 hours.
          </p>
          <Button className="mt-6" onClick={() => setShowSuccess(false)}>
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">
          Get a Project Quote
        </CardTitle>
        <CardDescription className="text-center text-lg">
          Complete the form below for your Europe-Morocco parcel delivery quote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form className="space-y-8">
            <div className="mb-6 space-y-4">
              
              <div className="flex justify-between gap-4 flex-wrap">
                {steps.map((step, index) => (
                  <Step
                    key={step.id}
                    id={step.id}
                    isLast={step.isLast}
                    currentStep={currentStep}
                    title={step.title}
                    
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-primary">
                  Step {currentStep + 1}: {steps[currentStep].title}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {steps[currentStep].description}
                </p>
              </div>

              {steps[currentStep].component}

              <div className="flex justify-between mt-8 gap-4">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}

                <div className="flex-1" />

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={methods.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Submit Quote Request
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}