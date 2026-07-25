import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score === 0) return { score: 0, label: "", color: "" };
  if (score <= 2) return { score: 1, label: "Weak", color: "bg-destructive" };
  if (score <= 4) return { score: 2, label: "Good", color: "bg-yellow-500" };
  return { score: 3, label: "Strong", color: "bg-green-500" };
}

export function SignupPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState({
    score: 0,
    label: "",
    color: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  React.useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength({ score: 0, label: "", color: "" });
    }
  }, [password]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement real signup
      console.log("Signup attempt:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Join PetStuff and connect with pet care
        </p>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            {...register("fullName")}
            disabled={isLoading}
            className={cn(
              errors.fullName && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            disabled={isLoading}
            className={cn(
              errors.email && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
            className={cn(
              errors.password && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full bg-muted-foreground/20 transition-colors",
                      i <= passwordStrength.score && passwordStrength.color
                    )}
                  />
                ))}
              </div>
              {passwordStrength.label && (
                <p className="text-xs text-muted-foreground">
                  Password strength: <span className="font-medium">{passwordStrength.label}</span>
                </p>
              )}
            </div>
          )}

          {/* Password Requirements */}
          <div className="space-y-1 pt-2">
            <p className="text-xs text-muted-foreground">Must include:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className={password.length >= 8 ? "text-green-600" : ""}>
                ✓ At least 8 characters
              </li>
              <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                ✓ An uppercase letter
              </li>
              <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>
                ✓ A lowercase letter
              </li>
              <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                ✓ A number
              </li>
            </ul>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            disabled={isLoading}
            className={cn(
              errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Sign Up Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Google Sign-Up Button */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        className="w-full"
        onClick={() => {
          // TODO: Implement Google OAuth
          console.log("Google sign-up clicked");
        }}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
