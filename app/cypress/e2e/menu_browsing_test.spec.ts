describe('Menu browsing E2E Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to Play view and see the list', () => {
    cy.get('button').contains('Play!').click();
    cy.get('.list').should('be.visible');
  });

  it('should navigate to Create view', () => {
    cy.get('button').contains('Create').click();
    cy.get('.creator-container').should('exist');
  });

  it('should navigate to Settings view', () => {
    cy.get('button').contains('Settings').click();
    cy.get('.browser-settings').should('exist');
  });

  it('should play a track in training view', () => {
    cy.get('button').contains('Play!').click();
    cy.get('.note-track .train').first().click();
    cy.get('.media-player-button').should('exist');
  });

  it('should open training view from a track', () => {
    cy.get('button').contains('Play!').click();
    cy.get('.note-track .train').first().click();
    cy.get('.game-container').should('be.visible');
  });

  it('should display correct metadata in training view', () => {
    cy.get('button').contains('Play!').click();
    cy.get('.note-track .train').first().click();
    cy.get('.metadata-item').should('exist');
  });

  it('should return to the main view from training', () => {
    cy.get('button').contains('Play!').click();
    cy.get('.note-track .train').first().click();
    cy.get('.game-container .close-button').click();
    cy.get('.menu').should('be.visible');
  });
});
