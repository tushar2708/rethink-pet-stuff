import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding breed catalog...");
  await seedBreeds();
  console.log("Seeding health plan templates...");
  await seedHealthTemplates();
  console.log("Seed complete.");
}

async function seedBreeds() {
  await prisma.breedCatalog.deleteMany();

  const breeds = [
    ...[
      "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", "Bulldog",
      "Poodle", "Beagle", "Rottweiler", "Dachshund", "Yorkshire Terrier",
      "Boxer", "Siberian Husky", "Great Dane", "Doberman", "Shih Tzu",
      "Pomeranian", "Chihuahua", "Border Collie", "Australian Shepherd", "Cocker Spaniel",
      "Cavalier King Charles Spaniel", "Pug", "Maltese", "Bernese Mountain Dog", "Samoyed",
      "Akita", "Dalmatian", "Pit Bull Terrier", "Corgi", "Lhasa Apso",
      "Indie", "Mixed Breed", "Schnauzer", "Bichon Frise", "Havanese",
      "English Springer Spaniel", "Weimaraner", "Whippet", "Shetland Sheepdog", "Basset Hound",
      "Newfoundland", "Jack Russell Terrier", "Cane Corso", "Vizsla", "Papillon",
      "Brussels Griffon", "Irish Setter", "Bloodhound", "Saint Bernard", "Collie",
    ].map((name, i) => ({ petType: "dog" as const, name, isCommon: i < 15, sortOrder: i })),

    ...[
      "Persian", "Indie", "Cross Mixed Breed", "Domestic Short Hair", "Domestic Medium Hair",
      "Domestic Long Hair", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
      "Bengal", "Abyssinian", "Sphynx", "Scottish Fold", "Birman",
      "Russian Blue", "Norwegian Forest Cat", "Himalayan", "Burmese", "Exotic Shorthair",
      "Turkish Angora", "American Shorthair", "Tonkinese", "Manx", "Devon Rex",
      "Oriental Shorthair", "Cornish Rex", "Somali", "Balinese", "Singapura",
    ].map((name, i) => ({ petType: "cat" as const, name, isCommon: i < 10, sortOrder: i })),

    ...[
      "Budgerigar (Budgie)", "Cockatiel", "Lovebird", "Parrot (Indian Ringneck)",
      "Macaw", "African Grey", "Cockatoo", "Conure", "Finch",
      "Canary", "Parakeet", "Lorikeet", "Mynah", "Pigeon", "Dove",
    ].map((name, i) => ({ petType: "bird" as const, name, isCommon: i < 5, sortOrder: i })),

    ...[
      "Syrian (Golden)", "Dwarf Campbell", "Dwarf Winter White", "Roborovski",
      "Chinese", "Teddy Bear", "Fancy", "Black Bear", "Panda", "European",
    ].map((name, i) => ({ petType: "hamster" as const, name, isCommon: i < 5, sortOrder: i })),
  ];

  await prisma.breedCatalog.createMany({ data: breeds });
  console.log(`  Created ${breeds.length} breeds`);
}

async function seedHealthTemplates() {
  await prisma.healthPlanTemplate.deleteMany();

  const templates = [
    // DOG — puppy
    { petType: "dog" as const, name: "DHPP dose 1", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "puppy", recommendedAgeWeeks: 8, sortOrder: 1 },
    { petType: "dog" as const, name: "Bordetella", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "puppy", recommendedAgeWeeks: 8, sortOrder: 2 },
    { petType: "dog" as const, name: "DHPP dose 2", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "puppy", recommendedAgeWeeks: 12, sortOrder: 3 },
    { petType: "dog" as const, name: "DHPP dose 3", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "puppy", recommendedAgeWeeks: 16, sortOrder: 4 },
    { petType: "dog" as const, name: "Rabies", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "puppy", recommendedAgeWeeks: 16, sortOrder: 5 },
    { petType: "dog" as const, name: "Leptospirosis dose 1", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "puppy", recommendedAgeWeeks: 12, sortOrder: 6 },
    { petType: "dog" as const, name: "Leptospirosis dose 2", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "puppy", recommendedAgeWeeks: 16, sortOrder: 7 },
    // DOG — on_repeat
    { petType: "dog" as const, name: "Deworming", category: "deworming", triggerType: "age", triggerCondition: {}, lifeStage: "on_repeat", repeatIntervalWeeks: 4, description: "Monthly until 6 months, then every 3 months.", sortOrder: 1 },
    { petType: "dog" as const, name: "Flea and tick control", category: "procedure", triggerType: "age", triggerCondition: {}, lifeStage: "on_repeat", repeatIntervalWeeks: 4, description: "Monthly.", sortOrder: 2 },
    // DOG — first_year
    { petType: "dog" as const, name: "First annual booster (DHPP)", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 52, sortOrder: 1 },
    { petType: "dog" as const, name: "First annual booster (rabies)", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 52, sortOrder: 2 },
    { petType: "dog" as const, name: "Annual vet check", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 52, sortOrder: 3 },
    // DOG — adult
    { petType: "dog" as const, name: "Annual booster", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "adult", recommendedAgeWeeks: 104, description: "Yearly from here on.", sortOrder: 1 },
    // DOG — senior
    { petType: "dog" as const, name: "Twice-yearly senior check", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "senior", recommendedAgeWeeks: 364, description: "From age 7. Bloodwork, weight, kidneys.", sortOrder: 1 },
    // DOG — procedure
    { petType: "dog" as const, name: "Neutering", category: "procedure", triggerType: "age", triggerCondition: {}, lifeStage: "puppy", recommendedAgeWeeks: 26, description: "Recommended around 6 months.", sortOrder: 10 },
    // DOG — lifetime_watch
    { petType: "dog" as const, name: "Hip dysplasia watch", category: "checkup", triggerType: "breed", triggerCondition: { breed: ["Golden Retriever", "German Shepherd", "Labrador Retriever", "Rottweiler", "Great Dane"] }, lifeStage: "lifetime_watch", description: "Large breeds are predisposed. Watch for limping, difficulty rising.", sortOrder: 1 },
    { petType: "dog" as const, name: "Brachycephalic airway watch", category: "checkup", triggerType: "breed", triggerCondition: { breed: ["French Bulldog", "Bulldog", "Pug", "Shih Tzu", "Pomeranian"] }, lifeStage: "lifetime_watch", description: "Flat-faced breeds. Watch for labored breathing, especially in heat.", sortOrder: 2 },

    // CAT — kitten
    { petType: "cat" as const, name: "FVRCP dose 1", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "kitten", recommendedAgeWeeks: 8, sortOrder: 1 },
    { petType: "cat" as const, name: "FeLV test + dose 1", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "kitten", recommendedAgeWeeks: 8, sortOrder: 2 },
    { petType: "cat" as const, name: "FVRCP dose 2", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "kitten", recommendedAgeWeeks: 12, sortOrder: 3 },
    { petType: "cat" as const, name: "Rabies (ARV)", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "kitten", recommendedAgeWeeks: 12, sortOrder: 4 },
    { petType: "cat" as const, name: "FeLV dose 2", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "kitten", recommendedAgeWeeks: 12, sortOrder: 5 },
    { petType: "cat" as const, name: "FVRCP dose 3", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "kitten", recommendedAgeWeeks: 16, sortOrder: 6 },
    // CAT — on_repeat
    { petType: "cat" as const, name: "Deworming", category: "deworming", triggerType: "age", triggerCondition: {}, lifeStage: "on_repeat", repeatIntervalWeeks: 4, description: "Monthly until 6 months, then every 3 months.", sortOrder: 1 },
    { petType: "cat" as const, name: "Flea and tick control", category: "procedure", triggerType: "age", triggerCondition: {}, lifeStage: "on_repeat", repeatIntervalWeeks: 4, description: "Monthly.", sortOrder: 2 },
    // CAT — first_year
    { petType: "cat" as const, name: "First annual booster (FVRCP)", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 52, sortOrder: 1 },
    { petType: "cat" as const, name: "First annual booster (rabies)", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 52, sortOrder: 2 },
    { petType: "cat" as const, name: "Annual vet check", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 52, sortOrder: 3 },
    { petType: "cat" as const, name: "Keep FeLV booster yearly", category: "vaccination", triggerType: "lifestyle", triggerCondition: { lifestyle: "outdoor" }, lifeStage: "first_year", recommendedAgeWeeks: 52, description: "Outdoor cats stay at risk. Yearly FeLV protects them.", sortOrder: 4 },
    // CAT — adult
    { petType: "cat" as const, name: "Annual booster", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "adult", recommendedAgeWeeks: 104, description: "Yearly from here on.", sortOrder: 1 },
    // CAT — senior
    { petType: "cat" as const, name: "Twice-yearly senior check", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "senior", recommendedAgeWeeks: 364, description: "From age 7. Bloodwork, weight, kidneys.", sortOrder: 1 },
    // CAT — procedure
    { petType: "cat" as const, name: "Neutering", category: "procedure", triggerType: "age", triggerCondition: {}, lifeStage: "kitten", recommendedAgeWeeks: 20, description: "Recommended around 5 months.", sortOrder: 10 },
    // CAT — lifetime_watch
    { petType: "cat" as const, name: "Urinary blockage (FLUTD) watch", category: "checkup", triggerType: "gender", triggerCondition: { gender: "male" }, lifeStage: "lifetime_watch", description: "Straining with little urine is an emergency. Wet food, healthy weight, and an extra litter box lower the risk.", sortOrder: 1 },
    { petType: "cat" as const, name: "Hypertrophic cardiomyopathy watch", category: "checkup", triggerType: "breed", triggerCondition: { breed: ["Maine Coon", "Ragdoll", "British Shorthair", "Sphynx", "Persian"] }, lifeStage: "lifetime_watch", description: "Predisposed breeds. Annual heart screening recommended.", sortOrder: 2 },

    // BIRD
    { petType: "bird" as const, name: "Avian vet wellness check", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 2, description: "Initial check-up within first 2 weeks.", sortOrder: 1 },
    { petType: "bird" as const, name: "Psittacosis test", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 2, sortOrder: 2 },
    { petType: "bird" as const, name: "Polyoma virus vaccination", category: "vaccination", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 5, sortOrder: 3 },
    { petType: "bird" as const, name: "Annual avian wellness exam", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "adult", recommendedAgeWeeks: 52, description: "Yearly health check.", sortOrder: 1 },
    { petType: "bird" as const, name: "Beak and nail trim", category: "procedure", triggerType: "age", triggerCondition: {}, lifeStage: "on_repeat", repeatIntervalWeeks: 12, description: "Every 3 months as needed.", sortOrder: 1 },
    { petType: "bird" as const, name: "Feather plucking watch", category: "checkup", triggerType: "breed", triggerCondition: { breed: ["African Grey", "Cockatoo", "Macaw"] }, lifeStage: "lifetime_watch", description: "Stress-prone species. Ensure enrichment and socialization.", sortOrder: 1 },

    // HAMSTER
    { petType: "hamster" as const, name: "Initial vet wellness check", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "first_year", recommendedAgeWeeks: 1, description: "Within first week of bringing home.", sortOrder: 1 },
    { petType: "hamster" as const, name: "Dental check", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "on_repeat", repeatIntervalWeeks: 26, description: "Every 6 months. Overgrown teeth are common.", sortOrder: 1 },
    { petType: "hamster" as const, name: "Annual wellness exam", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "adult", recommendedAgeWeeks: 52, sortOrder: 1 },
    { petType: "hamster" as const, name: "Wet tail watch", category: "checkup", triggerType: "age", triggerCondition: {}, lifeStage: "lifetime_watch", description: "Especially in young hamsters. Diarrhea + lethargy = emergency.", sortOrder: 1 },
  ];

  await prisma.healthPlanTemplate.createMany({ data: templates });
  console.log(`  Created ${templates.length} health plan templates`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
