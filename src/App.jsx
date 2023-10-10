import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [currentTimeout, setCurrentTimeout] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('Logged in', false)
    }
    catch (exception) {
      setNotification('Incorrect password or username', true)
      setPassword('')
    }
  }

  const handleLogout = async () => {
    window.localStorage.clear()
    setUser(null)
    setNotification('Logged out', false)
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <Notification/>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            id='password'
            type='password'
            value={password}
            name='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type='submit'>login</button>
      </form>
    </div>
  )

  const setNotification = (message, error) => {
    setNotificationMessage(message)
    setError(error)

    if (currentTimeout) clearTimeout(currentTimeout)
    setCurrentTimeout(setTimeout(() => {
      setNotificationMessage(null)
    }, 5000))
  }

  const Notification = () => {
    if (notificationMessage === null) return null

    const notificationStyle = {
      color: error ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }

    return (
      <div style={notificationStyle}>
        {notificationMessage}
      </div>
    )
  }

  const createBlog = async (blog) => {
    const newBlog = await blogService.create(blog)
    if (newBlog === null) {
      setNotification('Failed to create a new blog, make sure all the fields are filled in correctly', true)
    } else {
      newBlog.user = user
      setBlogs(blogs.concat(newBlog))
      setNotification('Succesfully added a new blog', false)
    }
  }

  const removeBlog = async (blogToBeRemoved) => {
    if (!window.confirm(`Remove blog: ${blogToBeRemoved.title}?`)) return
    const response = await blogService.remove(blogToBeRemoved)
    if (response === null) {
      setNotification(`Unable to remove blog: ${blogToBeRemoved.title}`)
      setError(true)
    } else {
      setBlogs(blogs.filter(blog => blog.id !== blogToBeRemoved.id))
      setNotification(`Succesfully removed blog: ${blogToBeRemoved.title}`)
    }
  }

  const likeAndUpdateBlog = async (likedBlog) => {
    likedBlog.likes += 1
    blogService.update(likedBlog)
    setNotification(`Liked blog: ${likedBlog.title}`)
  }

  const blogFormRef = useRef()

  if (!user) return loginForm()

  return (
    <div>
      <h2>Blogs</h2>
      <Notification/>
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>
          log out
        </button>
      </div>
      <Togglable buttonLabel={'create a new blog'} ref={blogFormRef}>
        <BlogForm createBlog={createBlog} blogFormRef={blogFormRef}/>
      </Togglable>
      {blogs.sort((a, b) => a.likes < b.likes ? 1 : b.likes < a.likes ? -1 : 0).map(blog =>
        <Blog key={blog.id} blog={blog} user={user}
          likeAndUpdateBlog={likeAndUpdateBlog} removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App