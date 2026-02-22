import {
	loginUserRouteOptions,
	refreshTokenRouteOptions,
	registerUserRouteOptions,
} from "../schemas/auth/user/user.routes.options";
import { FastifyInstanceZod } from "../server";
import bcrypt from "bcryptjs";
import {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} from "../utils/jwt";

export async function authRoutes(fastify: FastifyInstanceZod) {
	fastify.post(
		"/auth/register",
		registerUserRouteOptions,
		async (request, reply) => {
			const { email, name, password } = request.body;

			const existingEmail = await fastify.prisma.user.findUnique({
				where: { email },
			});

			if (existingEmail) {
				return reply.status(409).send({
					success: false,
					error: "E-mail já registrado",
					code: "EMAIL_ALREADY_EXISTS",
				});
			}

			const passwordHash = await bcrypt.hash(password, 10);

			const userCreated = await fastify.prisma.user.create({
				data: { name, email, passwordHash },
				select: { id: true, email: true, role: true, createdAt: true },
			});

			return reply.status(201).send({ success: true, userCreated });
		},
	);

	fastify.post("/auth/login", loginUserRouteOptions, async (request, reply) => {
		const { email, password } = request.body;

		const userRegister = await fastify.prisma.user.findUnique({
			where: { email },
		});

		if (!userRegister) {
			return reply.status(401).send({
				success: false,
				error: "Credenciais inválidas",
				code: "INVALID_CREDENTIALS",
			});
		}

		const passwordMatch = await bcrypt.compare(
			password,
			userRegister.passwordHash,
		);

		if (!passwordMatch) {
			return reply.status(401).send({
				success: false,
				error: "Credenciais inválidas",
				code: "INVALID_CREDENTIALS",
			});
		}

		const accessToken = signAccessToken({
			sub: userRegister.id,
			role: userRegister.role,
		});

		const refreshToken = signRefreshToken({
			sub: userRegister.id,
			role: userRegister.role,
		});

		return reply
			.status(200)
			.send({ accessToken, refreshToken, name: userRegister.name });
	});

	fastify.post(
		"/auth/refresh",
		{
			config: { isPublic: true },
		},
		async (request, reply) => {
			try {
				const { refreshToken } = request.body as { refreshToken: string };

				const payload = verifyRefreshToken(refreshToken) as {
					sub: string;
					role?: string;
				};

				const accessToken = signAccessToken({
					sub: payload.sub,
					role: payload.role,
				});

				return reply.send({ accessToken });
			} catch {
				return reply.status(401).send({
					success: false,
					error: "Refresh token inválido ou expirado",
					code: "UNAUTHORIZED",
				});
			}
		},
	);
}
