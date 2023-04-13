describe('login', () => {
	it('should login with correct credentials', () => {
		cy.visit('example URL');
		cy.get('input[name="user"]').type('email example');
		cy.get('input[name="password"]').type('password example');
		cy.get('button[type="submit"]').click();

		cy.url().should('include', 'Success URL');
	});
});
