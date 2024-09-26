import { createActionHeaders, type ActionsJson } from "@solana/actions";

export const GET = async () => {
  console.log("Inside actions.json...");
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/play/",
        apiPath: "/api/action/play",
      },
      {
        pathPattern: "/play/**",
        apiPath: "/api/action/play/**",
      },
    ],
  };

//   // Add CORS headers with wildcard
  const headers = new Headers(createActionHeaders());
  headers.set('Access-Control-Allow-Origin', '*');  // Allow access from any origin
  headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');    // Allow necessary methods
//   headers.set('Access-Control-Allow-Headers', 'Content-Type');   // Allow specific headers

  return new Response(JSON.stringify(payload), {
    headers: createActionHeaders(),
  });
};

export const OPTIONS = GET;
