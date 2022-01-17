import { AuthRoles } from '../support/commands';

describe('Viewing a resident', () => {
  describe('As a user in the Childrens group', () => {
    it('should redirect from the timeline when the current user does not have access to them because they are in the wrong user group', () => {
      cy.visitAs(
        `/people/${Cypress.env('ADULT_RECORD_PERSON_ID')}`,
        AuthRoles.ChildrensGroup
      );

      cy.location('pathname').should(
        'eq',
        `/people/${Cypress.env('ADULT_RECORD_PERSON_ID')}/details`
      );
    });

    it('should show a list of records when the current user has access to them because they are in the correct user group', () => {
      cy.visitAs(
        `/people/${Cypress.env('CHILDREN_RECORD_PERSON_ID')}`,
        AuthRoles.ChildrensGroup
      );

      cy.get('.lbh-timeline');
    });

    it('should allow allocation of workers against child residents', () => {
      cy.visitAs(
        `/people/${Cypress.env('CHILDREN_RECORD_PERSON_ID')}/allocations`,
        AuthRoles.ChildrensGroup
      );

      cy.contains('Allocate someone else');
    });
  });

  describe('As a user in the Childrens Unrestricted group', () => {
    it('should show records of a restricted child resident', () => {
      cy.visitAs(
        `/people/${Cypress.env('CHILDREN_RESTRICTED_RECORD_PERSON_ID')}`,
        AuthRoles.ChildrensUnrestrictedGroup
      );

      cy.contains('No events to show');
    });
  });

  describe('As a user in the Adults group', () => {
    it('should redirect from the timeline when the current user does not have access to them because they are in the wrong user group', () => {
      cy.visitAs(
        `/people/${Cypress.env('CHILDREN_RECORD_PERSON_ID')}`,
        AuthRoles.AdultsGroup
      );

      cy.location('pathname').should(
        'eq',
        `/people/${Cypress.env('CHILDREN_RECORD_PERSON_ID')}/details`
      );
    });

    it('should show a list of records when the current user has access to them because they are in the correct user group', () => {
      cy.visitAs(
        `/people/${Cypress.env('ADULT_RECORD_PERSON_ID')}`,
        AuthRoles.AdultsGroup
      );

      cy.get('.lbh-timeline');
    });

    it('should redirect from timeline of a restricted adult resident', () => {
      cy.visitAs(
        `/people/${Cypress.env('ADULT_RESTRICTED_RECORD_PERSON_ID')}`,
        AuthRoles.AdultsAllocatorGroup
      );

      cy.location('pathname').should(
        'eq',
        `/people/${Cypress.env('ADULT_RESTRICTED_RECORD_PERSON_ID')}/details`
      );
    });
  });

  describe('As a user in the Adults Allocators group', () => {
    it('should allow allocation of workers against adult residents', () => {
      cy.visitAs(
        `/people/${Cypress.env('ADULT_RECORD_PERSON_ID')}/allocations`,
        AuthRoles.AdultsAllocatorGroup
      );

      cy.contains('Allocate someone else');
    });
  });

  describe('As a user in the Adults Unrestricted group', () => {
    it('should show records of a restricted adult resident', () => {
      cy.visitAs(
        `/people/${Cypress.env('ADULT_RESTRICTED_RECORD_PERSON_ID')}`,
        AuthRoles.AdultsUnrestrictedGroup
      );

      cy.get('.lbh-timeline');
    });
  });

  describe('As a user in the Admin group', () => {
    it('should redirect from timeline of a restricted resident', () => {
      cy.visitAs(
        `/people/${Cypress.env('ADULT_RESTRICTED_RECORD_PERSON_ID')}`,
        AuthRoles.AdultsAllocatorGroup
      );

      cy.location('pathname').should(
        'eq',
        `/people/${Cypress.env('ADULT_RESTRICTED_RECORD_PERSON_ID')}/details`
      );
    });
  });
});
