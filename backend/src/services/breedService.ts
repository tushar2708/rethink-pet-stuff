import { prisma } from "../config/db";
import type { BreedQuery } from "../schemas/breedSchemas";

export async function getBreeds(query: BreedQuery) {
  return prisma.breedCatalog.findMany({
    where: { petType: query.petType },
    orderBy: [{ isCommon: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}
