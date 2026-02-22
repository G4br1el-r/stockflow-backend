import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { verifyAccessToken } from "../utils/jwt";

async function authPlugin(fastify: FastifyInstance) {
	fastify.addHook(
		"preHandler",
		async (request: FastifyRequest, reply: FastifyReply) => {
			console.log(`E ROTA PUBLICA? ${request.routeOptions.config?.isPublic}`);
			if (request.routeOptions.config?.isPublic) return;

			try {
				const token = request.headers.authorization?.split(" ")[1];

				if (!token) throw new Error("No token provided");
				verifyAccessToken(token);
			} catch (err) {
				return reply.status(401).send({
					success: false,
					error: "Invalid or expired token",
					code: "UNAUTHORIZED",
				});
			}
		},
	);
}

export default fp(authPlugin);
