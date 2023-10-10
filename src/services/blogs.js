import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getBlog = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
  } catch {
    return null
  }
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  try {
    const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
    return response.data
  } catch {
    return null
  }
}

const update = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  return response.data
}

export default {
  getAll,
  getBlog,
  create,
  update,
  remove,
  setToken
}