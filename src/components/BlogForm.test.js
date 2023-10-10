import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('Creating a new blog via BlogForm works', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const toggleVisibility = () => {
    return
  }

  const mockRef = {
    current: {
      toggleVisibility
    }
  }

  render(<BlogForm createBlog={createBlog} blogFormRef={mockRef} />)

  const input = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(input[0], 'Component Testing')
  await user.type(input[1], 'Component Tester')
  await user.type(input[2], 'url.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls[0][0].title).toBe('Component Testing')
  expect(createBlog.mock.calls[0][0].author).toBe('Component Tester')
  expect(createBlog.mock.calls[0][0].url).toBe('url.com')
  expect(createBlog.mock.calls).toHaveLength(1)
})