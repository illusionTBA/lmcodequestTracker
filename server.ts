import Elysia, { t } from "elysia";
// import cron, { Patterns } from "@elysiajs/cron";
import { getProblem, filterProblems, insertUser, getuser } from "./db/db";
import { staticPlugin } from "@elysiajs/static";
import type { Auth } from "./shared/auth";
const server = new Elysia()
  .use(
    staticPlugin({
      assets: "dist",
      prefix: "/",
    })
  )
  // .get("/api/correct", async (query: { uid }) => {}, {
  //   query: t.Object({
  //     uid: t.String(),
  //   }),
  // })
  .get(
    "/api/problems",
    async ({ query: { difficulty, points, year } }) => {
      const problems = await filterProblems(difficulty, points, year);

      return new Response(JSON.stringify(problems), {
        headers: {
          "content-type": "application/json",
          "cache-control": "public, max-age=300",
        },
      });
    },
    {
      query: t.Object({
        difficulty: t.Optional(t.String()),
        points: t.Optional(t.Number()),
        year: t.Optional(t.Number()),
      }),
    }
  )

  .get(
    "/api/problem",
    async ({ query: { slug, uid } }) => {
      console.log(slug, uid);
      if (!slug) {
        return { error: "missing slug" };
      }
      const problem = await getProblem(slug);
      console.log(`Got problem ${slug} from DB...`);
      return new Response(JSON.stringify(problem), {
        headers: {
          "content-type": "application/json",
          "cache-control": "public, max-age=300",
        },
      });
    },
    {
      query: t.Object({
        slug: t.Optional(t.String()),
        uid: t.Optional(t.String()),
      }),
    }
  )
  // TODO: Get the user's data such as problems completed, etc. from LMCQ & store it IN the db fast, we also need some way to update it but im blanking out
  .post(
    "/api/auth/login",
    async ({ body: { username, password }, cookie: { refresh, session } }) => {
      if (!username || !password) {
        return new Response(
          JSON.stringify({ error: "Please fill in all fields" }),
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
      }

      const res = await fetch(`https://lmcodequestacademy.com/api/auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          confirmPassword: password,
          rememberMe: true,
          showPassword: true,
        }),
      });
      const data = (await res.json()) as Auth;
      console.log(data);
      session.value = data.tokens.accessToken;
      refresh.value = data.tokens.refreshToken;

      const user = await getuser(data.user.id);
      if (!user) {
        await insertUser(
          data.user.id,
          data.user.firstName,
          data.user.lastName,
          data.user.fullName,
          data.user.email,
          data.user.data.DOMJudgeTeamID,
          data.user.data.DOMJudgeToken,
          data.user.data.DOMJudgeUserID
        );
        console.log(`Inserted user ${data.user.fullName} into the database...`);
      }

      return new Response(JSON.stringify(data), {
        headers: {
          "content-type": "application/json",
          "cache-control": "public, max-age=300",
        },
      });
    },
    {
      body: t.Object({
        username: t.Optional(t.String()),
        password: t.Optional(t.String()),
      }),
      cookie: t.Object({
        session: t.Optional(t.String()),
        refresh: t.Optional(t.String()),
      }),
    }
  )

  .listen(8080);

console.log(`Server started, ${server.server?.url}`);
