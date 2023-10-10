import { useState } from 'react'

const BlogForm = ({ createBlog, blogFormRef }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id='title'
            type='text'
            value={newTitle}
            name='Title'
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id='author'
            type='text'
            value={newAuthor}
            name='Author'
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id='url'
            type='text'
            value={newUrl}
            name='Url'
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type='submit' id='create'>create</button>
      </form>
    </div>
  )
}

export default BlogForm