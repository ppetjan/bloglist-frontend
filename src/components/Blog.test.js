import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog  from './Blog'

describe('<Blog />', () => {
  let container
  let user
  let blog
  let mockHandler

  beforeEach(() => {
    mockHandler = jest.fn()
    user = {
      name: 'Test User',
      username: 'testuser'
    }
    blog = {
      title: 'Component testing',
      author: 'Component tester',
      url: 'url.com',
      likes: 5,
      user: user
    }
    container = render(<Blog blog={blog} likeAndUpdateBlog={mockHandler} user={user}/>).container
  })

  test('renders blog title and author', () => {
    screen.getByText('Component testing, Component tester')
  })

  test('renders blog info', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const div = container.querySelector('.blogInfo')
    expect(div).toHaveTextContent('url.com')
    expect(div).toHaveTextContent('Test User')
    expect(div).toHaveTextContent('Likes 5')
  })

  test('clicking like button calls event handler', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})