import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png"
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.username = user.username;
      return session;
    },
  },
});
