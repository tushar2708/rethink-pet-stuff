import { useState, useEffect } from "react";
import { useAddPetStore } from "@/stores/addPetStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { ADD_PET_STEPS } from "@/features/owner/pets/addPetConfig";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/cn";

interface Breed {
  id: string;
  name: string;
  common?: boolean;
}

export function AddPetBreed() {
  const { data, setStepData } = useAddPetStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: ADD_PET_STEPS,
    basePath: "/owner/pets/add",
    storeData: data,
    setStepData,
  });

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [search, setSearch] = useState("");
  const [customBreed, setCustomBreed] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const result = await apiFetch<Breed[]>(
          `/breeds?petType=${data.petType || "dog"}`
        );
        setBreeds(result || []);
      } catch (error) {
        console.error("Failed to fetch breeds:", error);
      }
    };

    fetchBreeds();
  }, [data.petType]);

  const selectedBreed = form.watch("breed");

  const filteredBreeds = breeds.filter((breed) =>
    breed.name.toLowerCase().includes(search.toLowerCase())
  );

  const commonBreeds = filteredBreeds.filter((b) => b.common);
  const otherBreeds = filteredBreeds.filter((b) => !b.common);

  return (
    <StepWrapper
      title="Which breed?"
      description="This tunes the risks we watch for."
      onNext={() => next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-4">
        <Input
          placeholder="Search breeds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {commonBreeds.length > 0 && (
            <>
              {commonBreeds.map((breed) => (
                <button
                  key={breed.id}
                  onClick={() => {
                    form.setValue("breed", breed.name);
                    setCustomBreed(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b transition-all",
                    selectedBreed === breed.name && "bg-primary/5 font-medium"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        selectedBreed === breed.name
                          ? "border-primary"
                          : "border-border"
                      )}
                    >
                      {selectedBreed === breed.name && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span>{breed.name}</span>
                  </div>
                </button>
              ))}
              {otherBreeds.length > 0 && (
                <div className="px-4 py-2 text-xs text-muted-foreground font-medium">
                  Other breeds
                </div>
              )}
            </>
          )}

          {otherBreeds.map((breed) => (
            <button
              key={breed.id}
              onClick={() => {
                form.setValue("breed", breed.name);
                setCustomBreed(false);
              }}
              className={cn(
                "w-full text-left px-4 py-3 border-b transition-all",
                selectedBreed === breed.name && "bg-primary/5 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    selectedBreed === breed.name ? "border-primary" : "border-border"
                  )}
                >
                  {selectedBreed === breed.name && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span>{breed.name}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setCustomBreed(!customBreed)}
          className="w-full px-4 py-2 text-sm text-primary hover:underline text-left"
        >
          My breed isn&apos;t listed
        </button>

        {customBreed && (
          <Input
            placeholder="Enter your breed"
            value={selectedBreed || ""}
            onChange={(e) => form.setValue("breed", e.target.value)}
            className="w-full"
          />
        )}
      </div>
    </StepWrapper>
  );
}
