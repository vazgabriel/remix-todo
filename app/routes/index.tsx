import { useEffect, useRef } from 'react'
import { json, redirect } from '@remix-run/node'
import { Check, Checks } from 'tabler-icons-react'
import type { ActionFunction } from '@remix-run/node'
import { ActionIcon, Box, Button, Card, Text, TextInput } from '@mantine/core'
import { Form, useFetcher, useLoaderData, useTransition } from '@remix-run/react'

import { completeTodo, createTodo, getTodos } from '../../services/todo'
import type { Todo } from '../../services/todo'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()

  switch (request.method) {
    case 'POST': {
      const description = form.get('description')
      if (!description || typeof description !== 'string') {
        return json({ message: 'Description is required and must be a string' })
      }

      createTodo(description)
      break
    }
    case 'PUT': {
      const id = form.get('id')
      if (!id || typeof id !== 'string') {
        return json({ message: 'ID is required and must be a string' })
      }

      completeTodo(Number(id))
      break
    }
  }

  return redirect('/')
}

export function loader() {
  return json(getTodos())
}

export default function Index() {
  const todos = useLoaderData<Todo[]>()
  const transition = useTransition()

  const formRef = useRef<HTMLFormElement>(null)

  const isAdding = transition.submission?.method === 'POST'

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset()
    }
  }, [isAdding])

  return (
    <Box sx={{ padding: '80px' }}>
      <Card
        shadow='sm'
        sx={{
          gap: '32px',
          margin: 'auto',
          display: 'flex',
          maxWidth: '500px',
          flexDirection: 'column',
        }}
      >
        <Form ref={formRef} method='post'>
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <TextInput
              placeholder='Clean the dishes'
              label='Task'
              radius='lg'
              size='md'
              name='description'
              sx={{ flexGrow: 1 }}
              required
            />
            <Button type='submit' radius='xl' size='md' loading={isAdding}>
              Submit
            </Button>
          </Box>
        </Form>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} {...todo} />
          ))}
        </Box>
      </Card>
    </Box>
  )
}

function TodoItem(todo: Todo) {
  const fetcher = useFetcher()
  const isCompleting =
    fetcher.submission?.method === 'PUT' &&
    fetcher.submission.formData.get('id') === String(todo.id)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Text
        sx={{
          flexGrow: 1,
          ...(todo.done && { textDecoration: 'line-through' }),
        }}
      >
        {todo.description}
      </Text>
      <fetcher.Form method='put'>
        <input type='hidden' name='id' value={todo.id} />
        <ActionIcon type='submit' loading={isCompleting}>
          {todo.done ? <Checks /> : <Check />}
        </ActionIcon>
      </fetcher.Form>
    </Box>
  )
}
