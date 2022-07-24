const db = require('better-sqlite3')('todo')

db.prepare(`
  CREATE TABLE IF NOT EXISTS todo(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    done INTEGER
  )
`).run()
db.close()
