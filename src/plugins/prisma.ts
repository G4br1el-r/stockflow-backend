import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { prisma } from "../lib/prisma";

async function prismaPlugin(fastify: FastifyInstance) {
	fastify.decorate("prisma", prisma);

	fastify.addHook("onClose", async (instance) => {
		await instance.prisma.$disconnect();
	});
}

export default fp(prismaPlugin);
