import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { useSignup } from "@/hooks/useAuth";

const createAccountSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type CreateAccountData = z.infer<typeof createAccountSchema>;

export function CreateAccountPage() {
  const navigate = useNavigate();
  const signup = useSignup();
  const [selectedRole, setSelectedRole] = useState<"owner" | "vet" | "gig">("owner");

  const form = useForm<CreateAccountData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: CreateAccountData) => {
    try {
      await signup.mutateAsync({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: selectedRole,
      });
      if (selectedRole === "owner") {
        navigate("/owner/onboarding/pet-type");
      } else if (selectedRole === "vet") {
        navigate("/vet/onboarding/credentials");
      } else {
        navigate("/gig/onboarding/services");
      }
    } catch {
      // Error shown via signup.error
    }
  };

  const roles = [
    { value: "owner" as const, label: "Pet Parent", emoji: "🐾" },
    { value: "vet" as const, label: "Veterinarian", emoji: "🩺" },
    { value: "gig" as const, label: "Pet Buddy", emoji: "💛" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <PawPrint className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join Pet OS in under a minute</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={cn(
                    "rounded-lg border-2 p-3 text-center transition-all",
                    selectedRole === role.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="block text-xl">{role.emoji}</span>
                  <span className="mt-1 block text-xs font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
            <Input placeholder="Your name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
            <Input type="email" placeholder="you@example.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
            <Input type="tel" placeholder="+1 (555) 000-0000" {...form.register("phone")} />
            {form.formState.errors.phone && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
            <Input type="password" placeholder="At least 8 characters" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Confirm Password</label>
            <Input type="password" placeholder="Repeat your password" {...form.register("confirmPassword")} />
            {form.formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Error */}
          {signup.error && (
            <div className="rounded-lg bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{signup.error.message}</p>
            </div>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full" size="lg" disabled={signup.isPending}>
            {signup.isPending ? "Creating account..." : "Next"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
