import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PawPrint, Stethoscope, Briefcase } from "lucide-react";
import type { Variants } from "framer-motion";

import { PortalCard } from "@/components/shared/PortalCard";

const roles = [
  {
    title: "Pet Owner",
    description: "Find trusted vets and pet care providers for your furry friends",
    icon: <PawPrint className="h-8 w-8" />,
    href: "/owner/onboarding/about-you",
    color: "text-amber-500",
  },
  {
    title: "Veterinarian",
    description: "Expand your practice and connect with pet owners nearby",
    icon: <Stethoscope className="h-8 w-8" />,
    href: "/vet/onboarding/personal-info",
    color: "text-blue-500",
  },
  {
    title: "Gig Worker",
    description: "Find flexible work as a dog walker, pet sitter, or groomer",
    icon: <Briefcase className="h-8 w-8" />,
    href: "/gig/onboarding/personal-info",
    color: "text-orange-500",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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

export function RoleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-foreground">How will you use PetStuff?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose the role that best describes you
        </p>
      </motion.div>

      {/* Role Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {roles.map((role) => (
          <motion.div
            key={role.title}
            variants={itemVariants}
            onClick={() => navigate(role.href)}
            className="cursor-pointer"
          >
            <PortalCard
              title={role.title}
              description={role.description}
              icon={role.icon}
              href={role.href}
              color={role.color}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
