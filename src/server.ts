import Fastify from "fastify";
import "dotenv/config";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import corsPlugin from "./plugins/cors.js";
import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth-guard.js";

import { authRoutes } from "./routes/auth.js";

export type FastifyInstanceZod =
	ReturnType<typeof buildApp> extends Promise<infer T> ? T : never;

async function buildApp() {
	const fastify = Fastify({}).withTypeProvider<ZodTypeProvider>();

	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	await fastify.register(corsPlugin);

	// AUTH-GUARD
	await fastify.register(authPlugin);

	// PRISMA
	await fastify.register(prismaPlugin);

	// ROUTES
	await fastify.register(authRoutes);

	fastify.get(
		"/health",
		{
			config: { isPublic: true },
		},
		async () => {
			return {
				status: "ok",
				timestamp: new Date().toISOString(),
			};
		},
	);

	return fastify;
}

async function start() {
	try {
		const fastify = await buildApp();

		await fastify.listen({
			port: 3001,
			host: "0.0.0.0",
		});

		console.log("🚀 Servidor rodando em http://localhost:3001");
	} catch (err) {
		console.error("❌ Erro ao iniciar servidor:", err);
		process.exit(1);
	}
}

start();
