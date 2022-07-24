import Database from 'better-sqlite3'
const db = Database('todo')

export type Todo = {
  id: number
  description: string
  done: boolean
}

export function createTodo(description: string) {
  db.prepare('INSERT INTO todo(description) VALUES (?)').run(description)
}

export function getTodos(): Todo[] {
  return db
    .prepare('SELECT * FROM todo ORDER BY done ASC')
    .all()
    .map((r) => ({ ...r, done: r.done === 1 }))
}

export function completeTodo(id: number) {
  return db.prepare('UPDATE todo SET done = 1 WHERE id = ?').run(id)
}
