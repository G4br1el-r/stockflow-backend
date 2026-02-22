import z from "zod";
import { emailSchema, timestampSchema } from "../../common.schema";

export const userBase = z.object({
	name: z.string().min(3).max(50).trim(),
	email: emailSchema,
});

export const createdUserSchema = userBase.extend({
	password: z.string().min(8).max(100),
});

export const loginUserSchema = z.object({
	email: emailSchema,
	password: z.string().min(8).max(100),
});

export const userSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.string(),
	createdAt: timestampSchema,
	updatedAt: timestampSchema.optional(),
});

export type User = z.infer<typeof userSchema>;
export type CreatedUser = z.infer<typeof createdUserSchema>;
