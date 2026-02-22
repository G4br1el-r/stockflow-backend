import { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma/client.js";

declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
		accessSign: (payload: object, options?: object) => string;
		refreshSign: (payload: object, options?: object) => string;
	}

	interface FastifyRequest {
		accessVerify: () => string | JwtPayload;
		refreshVerify: (options?: {
			extractToken?: (req: FastifyRequest) => string;
		}) => string | JwtPayload;
	}

	interface FastifyContextConfig {
		isPublic?: boolean;
	}
}
