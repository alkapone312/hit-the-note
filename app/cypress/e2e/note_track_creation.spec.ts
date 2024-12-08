describe('Track creation E2E test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add a note when clicking on the score container in Create view', () => {
    cy.get('button').contains('Create').click();
    cy.get('#app > main > div > div.score-container').click(300, 300, {force: true});
    cy.get('#app > main > div > div.score-container.note-scale > div > div').should('exist');
  });

  it('should remove a note when clicking the delete button', () => {
    cy.get('button').contains('Create').click();
    cy.get('#app > main > div > div.score-container').click(300, 300, {force: true});
    cy.get('#app > main > div > div.score-container.note-scale > div > div').should('exist');
    cy.get('#app > main > div > div.score-container.note-scale > div > div').click()
    cy.get('#app > main > div > div.popup-container.note-editor > div > div.utils-part > button.danger-button').click();
    cy.get('#app > main > div > div.score-container.note-scale > div > div').should('not.exist');
  });

  it('should export the track with the correct filename and extension', () => {
    cy.get('button').contains('Create').click();
    cy.get('#app > main > div > div.controls > div.note-scale-controls > button').click()
    cy.get('#app > main > div > div.popup-container.more-popup > div.settings-inputs > input:nth-child(1)').clear()
    cy.get('#app > main > div > div.popup-container.more-popup > div.settings-inputs > input:nth-child(1)').type('my-track');
    cy.get('#app > main > div > div.popup-container.more-popup > button:nth-child(10)').click();
    cy.readFile('cypress/downloads/my-track.htn').should('exist');
  });

  it('should return to the main menu after creating a track', () => {
    cy.get('button').contains('Create').click();
    cy.get('#app > main > div > button').click();
    cy.get('.menu').should('be.visible');
  });
});