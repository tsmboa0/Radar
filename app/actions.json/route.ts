
import { createActionHeaders, type ActionsJson } from "@solana/actions";

export const GET = async () => {
  console.log("Inside actions.json...");
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/play",
        apiPath: "/api/action/play",
      },
      {
        pathPattern: "/play/**",
        apiPath: "/api/action/play/**",
      },
    ],
  };

  return new Response(JSON.stringify(payload), {
    headers: createActionHeaders(),
  });
};

export const OPTIONS = GET;
