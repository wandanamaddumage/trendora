"use client"

import { getNestedError } from "@/utils/form"
import React, { InputHTMLAttributes, ReactNode } from "react"
import { Controller, useFormContext } from "react-hook-form"

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  name: string
  icon?: ReactNode
}

const InputText: React.FC<InputTextProps> = ({
  label,
  helperText,
  className = "",
  name,
  icon,
  ...props
}) => {
  const { control, formState } = useFormContext()
  const error = getNestedError(formState.errors, name)

  return (
    <div className="flex flex-col gap-1 relative">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <div className="relative">
              <input
                {...field}
                {...props}
                className={`relative block w-full appearance-none rounded-md border border-linegrey px-3 py-[0.625rem] text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                  error ? "border-red-500" : "border-gray-300"
                } ${className} ${icon ? "pr-10" : ""}`} // add padding if icon exists
              />
              {icon && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{icon}</div>}
            </div>

            {(error || helperText) && (
              <span className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
                {error || helperText}
              </span>
            )}
          </>
        )}
      />
    </div>
  )
}

export default InputText
