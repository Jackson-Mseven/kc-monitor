import React from 'react'
import { CheckCircle } from 'lucide-react'

const StepIndicator = ({ step }: { step: number }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-12 h-0.5 mx-2 ${step > stepNumber ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepIndicator
