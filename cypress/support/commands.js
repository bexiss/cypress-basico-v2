Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Rodolfo')
    cy.get('#lastName').type('Belizario')
    cy.get('#email').type('rodolfobx@gmail.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
})
