import { createActionHeaders, type ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/play",
        apiPath: "/api/action/play",
      },
      // idempotent rule as the fallback
    //   {
    //     pathPattern: "/api/action/play/**",
    //     apiPath: "/api/action/play/**",
    //   },
    ],
  };

  return Response.json(payload, {
    headers: createActionHeaders(),
  });
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;