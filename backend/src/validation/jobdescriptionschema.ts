import { z } from "zod";

export const jobdescriptionschema = z.object({
    title: z.string().min(2).max(150),
    description: z.string().min(20),
});