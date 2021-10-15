import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import jwt, { decode } from "jsonwebtoken";
import { GraphQLClient, gql } from "graphql-request";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const endpoint = "https://creative-caiman-82.hasura.app/v1/graphql";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": process.env.HASURAADMIN,
  },
});
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  // database: process.env.DATABASE_URL,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    encode: async ({ secret, token, maxAge }) => {
      console.log("TOKEN ", token);
      const jwtClaims = {
        sub: token?.id?.toString() || token.sub,
        name: token.name,
        email: token.email,
        image: token.picture || token.image,
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-role": "user",
          "x-hasura-default-role": "user",
          "x-hasura-user-id": token?.id?.toString() || token.sub,
        },
      };

      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: "HS256" });
      return encodedToken;
    },
    decode: async ({ secret, token, maxAge }) => {
      const decodedToken = jwt.verify(token, secret, { algorithms: ["HS256"] });
      return decodedToken;
    },
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn(user, account, profile) { return true },
    // async redirect(url, baseUrl) { return baseUrl },
    async session(session, user) {
      const encodedToken = jwt.sign(user, process.env.SECRET, {
        algorithm: "HS256",
      });
      session.id = user?.id?.toString();
      session.token = encodedToken;
      session.user = {
        id: user?.id?.toString() || user.sub,
        email: user.email,
        image: user.image,
        name: user.name,
      };
      return Promise.resolve(session);
    },
    async jwt(token, user, account, profile, isNewUser) {
      const isUserSignedIn = user ? true : false;
      if (isUserSignedIn) {
        token.id = user.id;
        // store this in postgress
        const mutation = gql`
          mutation (
            $avatar: String
            $name: String!
            $id: String!
            $email: String
          ) {
            insert_users_one(
              object: { avatar: $avatar, email: $email, id: $id, name: $name }
            ) {
              avatar
              created_at
              email
              id
              name
            }
          }
        `;
        try {
          await graphQLClient.request(mutation, {
            name: user.name,
            email: user.email,
            id: user.id.toString(),
            avatar: user.image,
          });
        } catch (e) {
          console.log("API FAILED");
          console.log(e);
        }
      }
      return Promise.resolve(token);
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: "dark",

  // Enable debug messages in the console if you are having problems
  debug: false,
});
