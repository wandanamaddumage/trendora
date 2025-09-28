'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useAppDispatch } from '@/store/hooks'
import { setCredentials } from '@/store/slices/auth'
import { useRegisterMutation } from '@/store/api/splits/auth'

import InputText from "@/components/input-fields/input-text"
import { SignupFormValues, signupSchema } from "./schema"

const SignupForm = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [register, { isLoading: isSigningUp }] = useRegisterMutation()

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      contact: "",
      password: "",
      confirmPassword:""
    },
  })

  const { handleSubmit, reset } = methods

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const result = await register({
        first_name: data.fname,
        last_name: data.lname,
        email: data.email,
        contact: data.contact,
        password: data.password,
        password_confirmation: data.confirmPassword,
      }).unwrap()
      
      dispatch(setCredentials({ user: result.user, token: result.token }))
      toast.success("Account created successfully!")
      router.push("/")
      reset()
    } catch (error: any) {
      toast.error(error?.data?.message || "Signup failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign up to Trendora
          </p>
        </div>

        <FormProvider {...methods}>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <InputText name="fname" label="First Name" placeholder="First Name" />
              <InputText name="lname" label="Last Name" placeholder="Last Name" />
            </div>

            <InputText name="email" label="Email" type="email" placeholder="Email address" />
            <InputText name="contact" label="Contact Number" placeholder="Contact Number" />
            <InputText
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              }
            />
            <InputText
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                icon={
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center"
                    >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                }
            />

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSigningUp ? "Signing up..." : "Sign Up with Trendora"}
            </button>
          </form>
        </FormProvider>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupForm
