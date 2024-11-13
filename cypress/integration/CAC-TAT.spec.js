/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {

    beforeEach(function () {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function () {
        const longText = 'Estou com um problema no meu pedido, teste... teste... teste... teste... teste... teste... teste... teste... teste... teste... teste... teste... teste...'
        cy.get('#firstName').type('Rodolfo')
        cy.get('#lastName').type('Belizario')
        cy.get('#email').type('rodolfobx@gmail.com')
        cy.get('#phone').type('1934661010')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    //Cenario de e-mail com erro
    it('erro ao submeter o formulário com um email com formatação inválida', function () {
        const longText = 'Estou com um problema no meu pedido, teste... teste... teste... teste... teste... teste... teste... teste... teste... teste... teste... teste... teste...'
        cy.get('#firstName').type('Rodolfo')
        cy.get('#lastName').type('Belizario')
        cy.get('#email').type('rodolfobx@gmail,com')
        cy.get('#phone').type('1934661010')
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    //Cenario que tenta incluir letras no campo telefone
    it('Campo telefone continua vazio quando preenchido com valor não-numérico', function () {
        cy.get('#phone')
            .type('abcdefjh')
            .should('have.value', '')
    })

    //Cenario torna o número obrigatorio, mas não preenche e retorna erro
    it('Erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#firstName').type('Rodolfo')
        cy.get('#lastName').type('Belizario')
        cy.get('#email').type('rodolfobx@gmail.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    //Cenario preenche todos os campos e depois limpa todos os campos que foram preenchidos
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        const campos = [
            { id: '#firstName', valor: 'Rodolfo' },
            { id: '#lastName', valor: 'Belizario' },
            { id: '#email', valor: 'rodolfobx@gmail.com' },
            { id: '#phone', valor: '1934661010' },
            { id: '#open-text-area', valor: 'teste' }
        ]

        campos.forEach(campo => {
            cy.get(campo.id)
                .type(campo.valor)
                .should('have.value', campo.valor)
                .clear()
                .should('have.value', '')

        })
    })

    //Cenario que apenas clica para enviar sem preencher nenhum campo
    it('erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

    })

    //Cenario que costumiza os campos mandatorios em "commands", preenche tudo e envia  
    it('envia o formulário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    //Exercicio com Contains no lugar de get para o "button" enviar
    it('Exercicio 8 "contains"', function () {
        cy.get('#firstName').type('Rodolfo')
        cy.get('#lastName').type('Belizario')
        cy.get('#email').type('rodolfobx@gmail.com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    //Exercicio de seleção do "produto"
    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#firstName').type('Rodolfo')
        cy.get('#lastName').type('Belizario')
        cy.get('#email').type('rodolfobx@gmail.com')
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })


    //Exercicio de seleção radio
    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"')
            .check()
            .should('have.value', 'feedback')
    })

    //Exercio extra wrap e each
    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })


    //Marca ambos checkboxes, depois desmarca o último
    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    //Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#phone-checkbox').check()
            .should('be.checked')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    //Seleciona um arquivo da pasta fixtures
    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    //Seleciona um arquivo simulando um drag-and-drop
    it('seleciona um arquivo simulando um drag - and - drop', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')

            })
    })

    //Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    //verifica que a política de privacidade abre em outra aba sem a necessidade de um clique
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    //Acessa a página da política de privacidade removendo o target e então clicando no link
    it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        cy.url().should('include', '/privacy.html')
    
        // Verifica se o título "CAC TAT - Política de privacidade" está visível na nova página
        cy.contains('h1', 'CAC TAT - Política de privacidade').should('be.visible')
    })
    
    //Testa a página da política de privacidade de forma independente
    it('testa a página da política de privacidade de forma independente', function () {
        // Visita a página da política de privacidade diretamente
        cy.visit('./src/privacy.html')
    
        // Verifica se o título "CAC TAT - Política de privacidade" está visível na página
        cy.contains('h1', 'CAC TAT - Política de privacidade').should('be.visible')
    
        // Opcional: verifica um trecho específico do texto
        cy.contains('Não salvamos dados submetidos no formulário da aplicação CAC TAT.').should('be.visible')
    })
    
})