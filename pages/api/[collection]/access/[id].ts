import handler from "@payloadcms/next-payload/dist/handlers/[collection]/access/[id]";

export default handler;

export const config = {
	api: {
		externalResolver: true,
	},
};
