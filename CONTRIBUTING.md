# Contributing to SafetySync.AI

Thank you for your interest in contributing to SafetySync.AI! This document provides guidelines for contributing to the project.

## Development Setup

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `npm install`
3. **Set up environment variables** using `.env.example` as a template
4. **Set up the database**: `npm run db:push`
5. **Start development server**: `npm run dev`

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Follow strict type checking
- Use proper type definitions in `shared/schema.ts`

### React Components
- Use functional components with hooks
- Follow the component structure in `client/src/components/`
- Use React Hook Form with Zod validation for forms
- Implement proper loading and error states

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design for all components
- Use the established blue gradient theme

### Database
- Use Drizzle ORM for all database operations
- Define schemas in `shared/schema.ts`
- Use the storage interface in `server/storage.ts`
- Run `npm run db:push` for schema changes

## Commit Guidelines

### Commit Message Format
```
type(scope): brief description

Detailed explanation if needed
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add JWT token refresh functionality
fix(dashboard): resolve employee count display issue
docs(readme): update installation instructions
```

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the code style guidelines
3. **Test thoroughly** including edge cases
4. **Update documentation** if needed
5. **Submit a pull request** with:
   - Clear description of changes
   - Screenshots for UI changes
   - Test results
   - Breaking changes (if any)

## Testing Guidelines

### Frontend Testing
- Test user interactions and edge cases
- Verify responsive design across devices
- Test authentication flows
- Validate form submissions and error handling

### Backend Testing
- Test API endpoints with various inputs
- Verify database operations
- Test authentication and authorization
- Check error handling and edge cases

### Integration Testing
- Test complete user workflows
- Verify AI document processing
- Test email automation features
- Validate certificate generation

## Architecture Guidelines

### Frontend Architecture
- Follow the established component structure
- Use TanStack Query for server state management
- Implement proper error boundaries
- Follow React best practices

### Backend Architecture
- Keep routes thin, business logic in services
- Use the storage interface for database operations
- Implement proper error handling
- Follow Express.js best practices

### Database Design
- Use proper foreign keys and constraints
- Implement data validation at schema level
- Consider performance implications
- Document schema changes

## Security Considerations

- **Never commit sensitive data** (API keys, passwords, etc.)
- **Validate all user inputs** on both client and server
- **Use parameterized queries** to prevent SQL injection
- **Implement proper authentication** and authorization
- **Follow security best practices** for handling user data

## Performance Guidelines

- **Optimize database queries** using proper indexing
- **Implement caching** where appropriate
- **Minimize bundle size** by code splitting
- **Use lazy loading** for components and routes
- **Monitor performance** and address bottlenecks

## Documentation

- **Update README.md** for significant changes
- **Document new features** with usage examples
- **Update API documentation** for backend changes
- **Include inline comments** for complex logic
- **Maintain changelog** for version releases

## Feature Flag Usage

- **Use LaunchDarkly** for new feature rollouts
- **Implement gradual rollouts** for major features
- **Test with feature flags** before full deployment
- **Clean up old flags** after feature stabilization

## AI Integration Guidelines

- **Use OpenAI responsibly** with proper error handling
- **Implement fallback mechanisms** for AI failures
- **Monitor AI usage** and costs
- **Test AI features** thoroughly with various inputs
- **Document AI prompts** and expected outputs

## Email System Guidelines

- **Use Brevo API** for all email communications
- **Implement proper templates** with fallbacks
- **Test email delivery** in development
- **Handle email failures** gracefully
- **Maintain email templates** for consistency

## Questions and Support

For questions about contributing:
- Review existing issues and pull requests
- Check the project documentation
- Contact the maintainers for guidance

## Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Help maintain a welcoming environment
- Follow project guidelines and standards

Thank you for contributing to SafetySync.AI!