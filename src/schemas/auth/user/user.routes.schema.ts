import z from "zod";
import { createdUserSchema, loginUserSchema } from "./user.schema";

export const createUserBodySchema = createdUserSchema;
export const loginUserBodySchema = loginUserSchema;
export const refresTokenBodySchema = z.object({ refreshToken: z.string() });
