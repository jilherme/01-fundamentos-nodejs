import fs from "node:fs/promises"

// using type="module" in package.json, we can't use __dirname
const databasePath = new URL("../db.json", import.meta.url)
// if we don't specify the path, it will be created where the script is running

export class Database {
  #database = {}
  // # is a private property

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    const data = this.#database[table] ?? []

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }
}
