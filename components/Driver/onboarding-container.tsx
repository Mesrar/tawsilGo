// app/driver/onboarding/components/onboarding-container.tsx
export function OnboardingContainer({ children }: { children: React.ReactNode }) {
    return (
      <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
      <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          {children}
        </div>
      </div>
      </section>
    )
  }