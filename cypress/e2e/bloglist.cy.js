describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.createUser({ username: 'User1', password: 'Password1' })
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('User1')
      cy.get('#password').type('Password1')
      cy.get('#login-button').click()
      cy.contains('Logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('User1')
      cy.get('#password').type('incorrectPassword1')
      cy.get('#login-button').click()
      cy.contains('Log in to application')
      cy.contains('Incorrect password or username')
    })
  })

  describe('When logged in', function() {
    beforeEach(function () {
      cy.login({ username: 'User1', password: 'Password1' })
    })

    it('A blog can be created', function() {
      cy.contains('create a new blog').click()
      cy.get('#title').type('Blog by Cypress')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('url.com')
      cy.get('#create').click()

      cy.contains('Succesfully added a new blog')
      cy.contains('Blog by Cypress, Cypress')
    })
  })

  describe('When a user is logged in and and has created a blog', function() {
    beforeEach(function () {
      cy.login({ username: 'User1', password: 'Password1' })
      cy.createBlog({ title: 'Blog by Cypress', author: 'Cypress', url: 'cypress.io' })
    })

    it('A blog can be liked', function() {
      cy.contains('show').click()
      cy.contains('Likes 0')
      cy.contains('like').click()
      cy.contains('Liked blog: Blog by Cypress')
      cy.contains('Likes 1')
    })

    it('A blog can be deleted by the user who submitted it', function() {
      cy.contains('show').click()
      cy.contains('remove').click()
      cy.contains('Succesfully removed blog: Blog by Cypress')
      cy.contains('Blog by Cypress, Cypress').should('not.exist')
    })
  })

  describe('When a user is logged in and the database contains blogs from a different user', function() {
    beforeEach(function () {
      cy.login({ username: 'User1', password: 'Password1' })
      cy.createBlog({ title: 'Blog by User One', author: 'User1', url: 'user1.com' })
      cy.contains('log out').click()

      cy.createUser({ username: 'User2', password: 'Password2' })
      cy.login({ username: 'User2', password: 'Password2' })
    })

    it('Only the person who submitted a blog can see the delete button', function() {
      cy.contains('Blog by User One, User1').contains('show').click()
      cy.contains('remove').should('not.exist')
    })
  })
})