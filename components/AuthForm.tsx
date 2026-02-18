"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.actions"

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3).max(50) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(4).max(50),
  })
}

const AuthForm = ({ type }: { type: FormType}) => {
  const router = useRouter();

  const formSchema = authFormSchema(type)

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if(type === 'sign-up') {
        // Sign up logic
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success) {
          toast.error(result?.message)
          return;
        }

        toast.success("Account created successfully. Please sign in")
        router.push('/sign-in')
      } else {
        const { email, password } = values;

        // Use signInWithEmailAndPassword for sign-in
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredentials.user.getIdToken();

        if(!idToken) {
          toast.error("Sign in failed. Please try again")
          return;
        }

        await signIn({
          email,
          idToken,
        })

        toast.success("Sign in successfully")
        router.push('/')
      }
    } catch (error: unknown) {
      const code = error && typeof error === "object" && "code" in error
        ? (error as { code: string }).code
        : ""
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Incorrect password", {
          description: "The password you entered is wrong. Please try again or use “Forgot password” to reset it.",
        })
      } else if (code === "auth/user-not-found") {
        toast.error("No account found", {
          description: "There’s no account with this email. Please sign up first.",
        })
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many attempts", {
          description: "This account is temporarily locked. Try again later or reset your password.",
        })
      } else if (code === "auth/invalid-email") {
        toast.error("Invalid email", {
          description: "Please enter a valid email address.",
        })
      } else {
        console.error(error)
        toast.error("Something went wrong", {
          description: "Please check your details and try again.",
        })
      }
    }
  }
  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center ">
          <Image
            src="/logo.svg"
            alt="logo"
            width={38}
            height={32}
          />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

          <h3>Practice job interview with AI</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Username"
                  placeholder="Enter your name"
                />
              )}
                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />

              <Button className="btn uppercase" type="submit">{isSignIn ? 'Sign in' : 'Create an Account '}</Button>
            </form>
          </Form>

          <p>
            {isSignIn ? 'No account yet?' : 'have an account already?'}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className="font-bold text-user-primary ml-1"
            >
              {!isSignIn ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
      </div>
    </div>
  )
}

export default AuthForm
