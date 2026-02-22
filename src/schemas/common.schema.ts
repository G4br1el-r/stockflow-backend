import { z } from "zod";

export const uuidSchema = z.object({ id: z.uuid() });

export const timestampSchema = z.iso.datetime();

export const emailSchema = z.email().lowercase().trim();
