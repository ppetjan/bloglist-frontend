Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBloglistUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBloglistUser')).token}`
    }
  })
  cy.visit('http://localhost:5173')
})

Cypress.Commands.add('createUser', ({ username, password }) => {
  const user = {
    username: username,
    password: password
  }
  cy.request('POST', 'http://localhost:3003/api/users', user)
})

