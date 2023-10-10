import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, removeBlog, likeAndUpdateBlog, user }) => {
  const [showInfo, setShowInfo] = useState(false)

  const blogStyle = {
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    margin: 5
  }

  const blogInfo = (blog) => (
    <div className='blogInfo'>
      <a href={blog.url}>{blog.url}</a>
      <br/>
      Likes {blog.likes}
      <button onClick={() => likeAndUpdateBlog(blog)}>like</button>
      <br/>
      {blog.user.name}
      {user.username === blog.user.username
        ?
        <>
          <br/>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </>
        : null}
    </div>
  )

  return (
    <div style={blogStyle}>
      {blog.title}, {blog.author}
      <button onClick={() => setShowInfo(!showInfo)}>
        {showInfo === true ? 'hide' : 'show'}
      </button>
      {showInfo === true
        ? blogInfo(blog)
        : null
      }
    </div>
  )
}

/*
Disabled for testing

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeAndUpdateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired
}
*/

export default Blog