import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PawPrint, Stethoscope, Heart } from "lucide-react";
import type { Variants } from "framer-motion";

import { Button } from "@/components/ui/button";

export function LandingPage() {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Top Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 sm:px-10">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <PawPrint className="h-6 w-6 text-amber-500" />
          PetStuff
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/onboarding/create-account">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Join as a Vet</span>
              <span className="sm:hidden">Vet</span>
            </Button>
          </Link>
          <Link to="/onboarding/create-account">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Join as a Pet Buddy</span>
              <span className="sm:hidden">Pet Buddy</span>
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Everything your pet needs,{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              one place
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Find trusted veterinarians, pet sitters, dog walkers, and groomers — all in one platform.
          </p>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-10"
          >
            <Link to="/onboarding/create-account">
              <Button size="lg" className="px-8 text-base">
                <PawPrint className="mr-2 h-5 w-5" />
                Get Started — It's Free
              </Button>
            </Link>
          </motion.div>

          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
