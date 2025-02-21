import { Database } from "bun:sqlite";
import type { Problem } from "../shared/types";
export const db = new Database("data.db", { create: true });
db.exec(`
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lmid TEXT,
            title TEXT,
            slug TEXT,
            tags TEXT,
            active BOOLEAN,
            difficulty TEXT,
            points INTEGER,
            year INTEGER,
            description TEXT,
            domjudgeID TEXT
        )
`);

db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lmid TEXT,
            firstName TEXT,
            lastName TEXT,
            fullName TEXT,
            email TEXT,
            correct TEXT,
            DOMJudgeTeamID TEXT,
            DOMJudgeToken TEXT,
            DOMJudgeUserID TEXT
        )
    `);

export const insertUser = async (
  lmid: string,
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  DOMJudgeTeamID: string,
  DOMJudgeToken: string,
  DOMJudgeUserID: string
) => {
  db.prepare(
    `INSERT INTO users ( lmid, firstName, lastName, fullName, email, DOMJudgeTeamID, DOMJudgeToken, DOMJudgeUserID ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )`
  ).run(
    lmid,
    firstName,
    lastName,
    fullName,
    email,
    DOMJudgeTeamID,
    DOMJudgeToken,
    DOMJudgeUserID
  );
};

// export const insertCorrect = async (lmid: string) => {
//   db.prepare(`INSERT INTO problems ( lmid, correct ) VALUES ( ?, ? )`).run(
//     lmid,
//     correct
//   );
// };

export const getuser = async (uid: string) => {
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(uid);
  return user;
};

export const getProblems = async () => {
  // use the database to get the problems
  const problems = db.prepare(`SELECT * FROM problems`).all();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return problems.map((p: any) => {
    return {
      id: p.id,
      lmid: p.lmid,
      title: p.title,
      slug: p.slug,
      tags: JSON.parse(p.tags),
      active: p.active,
      difficulty: JSON.parse(p.difficulty),
      points: p.points,
      year: p.year,
      description: p.description,
      domjudgeID: p.domjudgeID,
    };
  }) as Problem[];
};

export const getProblem = async (slug: string) => {
  const problem = db.prepare(`SELECT * FROM problems WHERE slug = ?`).get(slug);
  return {
    // @ts-expect-error too lazy
    id: problem.id,
    // @ts-expect-error too lazy
    lmid: problem.lmid,
    // @ts-expect-error too lazy
    title: problem.title,
    // @ts-expect-error too lazy
    slug: problem.slug,
    // @ts-expect-error too lazy
    tags: JSON.parse(problem.tags),
    // @ts-expect-error too lazy
    active: problem.active,
    // @ts-expect-error too lazy
    difficulty: JSON.parse(problem.difficulty),
    // @ts-expect-error too lazy
    points: problem.points,
    // @ts-expect-error too lazy
    year: problem.year,
    // @ts-expect-error too lazy
    description: problem.description,
    // @ts-expect-error too lazy
    domjudgeID: problem.domjudgeID,
  } as Problem;
};

export const filterProblems = async (
  difficulty?: string,
  points?: number,
  year?: number
) => {
  let query = `SELECT * FROM problems`;
  let isAND = false;
  if (difficulty) {
    query += ` WHERE JSON_EXTRACT(difficulty, '$.name') = '${difficulty}'`;
    if (!isAND) {
      isAND = true;
    }
  }

  if (points) {
    query += isAND ? ` AND points >= ${points}` : ` WHERE points >= ${points}`;
    if (!isAND) {
      isAND = true;
    }
  }

  if (year) {
    query += isAND ? ` AND year = ${year}` : ` WHERE year = ${year}`;
  }
  console.log(query);
  const problems = db.prepare(query).all();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return problems.map((p: any) => {
    return {
      id: p.id,
      lmid: p.lmid,
      title: p.title,
      slug: p.slug,
      tags: JSON.parse(p.tags),
      active: p.active,
      difficulty: JSON.parse(p.difficulty),
      points: p.points,
      year: p.year,
      description: p.description,
      domjudgeID: p.domjudgeID,
    };
  }) as Problem[];
};
