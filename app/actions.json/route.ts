import { ACTIONS_CORS_HEADERS, ActionsJson, createActionHeaders } from "@solana/actions";


const headers = createActionHeaders();

export const GET = async()=>{

    const payload : ActionsJson ={
        rules: [
            {
                pathPattern: "/play/*",
                apiPath: "/api/action/play/*"
            },
            // idempotent rule as the fallback
            {
                pathPattern: "/api/actions/play/**",
                apiPath: "/api/actions/play/**",
            },
        ]
    } ;

    return Response.json(payload, {
        headers
    })
}

export const OPTIONS = GET;