import { z } from "zod";

export const matchingschema = z.object({
    resumeId: z.string().min(1),
    jobDescriptionId: z.string().min(1),
});