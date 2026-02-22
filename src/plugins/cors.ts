import fp from "fastify-plugin";
import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

function parseOrigins(value?: string) {
	return new Set(
		(value ?? "http://localhost:3000")
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean),
	);
}

async function corsPlugin(fastify: FastifyInstance) {
	const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS);

	await fastify.register(cors, {
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (origin === "null") return callback(null, false);
			if (allowedOrigins.has(origin)) return callback(null, true);
			return callback(null, false);
		},
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
		exposedHeaders: ["X-Total-Count", "X-Page"],
		credentials: true,
		maxAge: 86400,
	});
}

export default fp(corsPlugin);
