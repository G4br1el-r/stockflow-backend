import {
	createUserBodySchema,
	loginUserBodySchema,
	refresTokenBodySchema,
} from "./user.routes.schema";

export const registerUserRouteOptions = {
	config: { isPublic: true },
	schema: {
		body: createUserBodySchema,
	},
};

export const loginUserRouteOptions = {
	config: { isPublic: true },
	schema: {
		body: loginUserBodySchema,
	},
};

export const refreshTokenRouteOptions = {
	config: { isPublic: true },
	schema: {
		body: refresTokenBodySchema,
	},
};
