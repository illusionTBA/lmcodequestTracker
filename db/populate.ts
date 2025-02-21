import { db } from "./db";

const insertProblem = db.prepare(
  `INSERT INTO problems ( lmid, title, slug, tags, active, difficulty, points, year, description, domjudgeID ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`
);

const res = await fetch(
  "https://lmcodequestacademy.com/api/quest/get-problems",
  {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      difficulty: 0,
      filter: "",
      limit: 300,
      offset: 0,
      status: "%",
    }),
  }
);

const data = await res.json();

for (const problem of data.problems) {
  const response = await fetch(
    `https://lmcodequestacademy.com/api/quest/get-problem?slug=${problem.slug}`
  );

  const problemData = await response.json();

  insertProblem.run(
    problemData.id,
    problemData.title,
    problemData.slug,
    JSON.stringify(problemData.tags),
    problemData.active,
    JSON.stringify(problem.difficulty),
    problemData.points,
    parseInt(problemData.year),
    problemData.description,
    problemData.domjudgeID
  );
  console.log(`Inserted ${problemData.title} into the database...`);
  await Bun.sleep(300);
}
