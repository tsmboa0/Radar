import { ACTIONS_CORS_HEADERS, createActionHeaders, type ActionsJson } from "@solana/actions";

export const GET = async (req:Request) => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/play",
        apiPath: "/api/action/play",
      }
    ],
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};


export const OPTIONS = GET; 