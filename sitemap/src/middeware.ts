import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
	onBeforeResponse:[
		(event) => {
			if (event.request.method === "OPTIONS" ) {
				event.response.headers.set("Access-Control-Allow-Origin", "*")
			}
		}
	]
})