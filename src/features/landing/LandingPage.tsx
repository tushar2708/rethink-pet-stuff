import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PawPrint, Stethoscope, Briefcase } from "lucide-react";
import type { Variants } from "framer-motion";

import { PortalCard } from "@/components/shared/PortalCard";

export function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

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
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-24 lg:py-32">
        {/* Decorative background elements */}
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
            Connect with veterinarians, pet sitters, dog walkers, and more. PetStuff brings
            together everything you need to care for your furry friends.
          </p>
        </motion.div>
      </section>

      {/* Portal Cards Section */}
      <section className="relative z-10 px-4 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Pet Owner Card */}
            <motion.div variants={itemVariants}>
              <PortalCard
                title="Pet Owner"
                description="Find trusted vets and pet care providers for your furry friends"
                icon={<PawPrint className="h-8 w-8" />}
                href="/owner/onboarding/about-you"
                color="text-amber-500"
              />
            </motion.div>

            {/* Veterinarian Card */}
            <motion.div variants={itemVariants}>
              <PortalCard
                title="Veterinarian"
                description="Expand your practice and connect with pet owners nearby"
                icon={<Stethoscope className="h-8 w-8" />}
                href="/vet/onboarding/personal-info"
                color="text-blue-500"
              />
            </motion.div>

            {/* Gig Worker Card */}
            <motion.div variants={itemVariants}>
              <PortalCard
                title="Gig Worker"
                description="Find flexible work as a dog walker, pet sitter, or groomer"
                icon={<Briefcase className="h-8 w-8" />}
                href="/gig/onboarding/personal-info"
                color="text-orange-500"
              />
            </motion.div>
          </motion.div>

          {/* Sign In Link */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
