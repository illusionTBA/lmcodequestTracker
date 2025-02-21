# LMCQ Tracker

> A better way to view and complete [lmcodequestacademy](https://lmcodequestacademy.com/)

## Prerequisite

- [Bun](https://bun.sh)
  > (thats it 🎉)

## Installation

After installing Bun we can use the following commands to get things up and running.

### Seeding the Local Databse

- First we need a way to actually get the data. To do this i use a local sqlite3 database thats populated from the [lmcodequestacademy](https://lmcodequestacademy.com/) problem set using their api. (This is why it's so fast ⚡ compared the the lmcodequestacademy site!)

```sh
$ bun run db:populate
```

- This will start populating the local db with problems and will take a few minutes to complete.

### Building and running the website

- Now that we've done that we can finally move to the final parts, getting the website up. The following commands will build & start the server respectively

```sh
$ bun run build && bun run start
```

- And now we're done. you can view the website locally at port 8080 `http://localhost:8080/`

## Features

[x] - Able to view problems
[x] - Fast ⚡
[ ] - Submit solutions
[ ] - User accounts
