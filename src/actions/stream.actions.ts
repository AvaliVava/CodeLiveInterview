"use server";  
// Marks this file as a Next.js "Server Action" file.
// Everything here runs only on the server (never on the client browser).

import { currentUser } from "@clerk/nextjs/server";  
// Imports Clerk's helper function to get details of the currently logged-in user (server-side).

import { StreamClient } from "@stream-io/node-sdk";  
// Imports the Stream SDK, which allows the app to communicate with Stream’s backend services.

export const streamTokenProvider = async () => {  
  // Defines an asynchronous function that will generate and return a Stream user token.

  const user = await currentUser();  
  // Fetches the current user's information from Clerk authentication.

  if (!user) throw new Error("User not authenticated");  
  // If no user is logged in, throw an error — token generation requires authentication.

  const streamClient = new StreamClient(  
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,  
    process.env.STREAM_SECRET_KEY!  
  );  
  // Creates a new Stream client instance using your Stream API credentials stored in environment variables.
  // The exclamation mark (!) tells TypeScript that these values are definitely defined.

  const token = streamClient.generateUserToken({ user_id: user.id });  
  // Generates a Stream user token linked to the current user's Clerk ID.
  // This token lets the user securely access Stream services (chat, video, etc.).

  return token;  
  // Returns the generated token so it can be used on the frontend.
};
