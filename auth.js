import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import twitter from "next-auth/providers/twitter";


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            // authorization: {
            //     prompt: 'concent',
            //     access_type: 'offline',
            //     response_type: 'code'
            // }
        }),
        twitter({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            version: "2.0"
        })

    ]
})