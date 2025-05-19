import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile",
                    // consent 화면을 별도창으로 처리 할 경우,
                    // prompt: "consent",
                    // access_type: "offline",
                    // response_type: "code"
                },
            },
        }),
    ],
    callbacks: {
        async session({ session }) {
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    useSecureCookies: false,
};

//const handler = NextAuth(authOptions);
//export { handler as GET, handler as POST };
