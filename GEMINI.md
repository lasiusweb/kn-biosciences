# Project Overview: kn-biosciences

This is a Next.js application, bootstrapped with `create-next-app`, designed for an e-commerce platform, likely for bio-science related products. It leverages React for building user interfaces and integrates with Supabase for backend services, including order management. The application features a secure checkout flow with payment processing capabilities through Easebuzz, and includes a placeholder for future PayU integration.

## Technologies Used:
*   **Frontend Framework:** Next.js (with React)
*   **Styling:** Tailwind CSS
*   **Backend/Database:** Supabase
*   **Payment Gateway:** Easebuzz (with PayU as a planned integration)
*   **Language:** TypeScript, JavaScript

## Building and Running:

To get started with the project, ensure you have Node.js and npm/yarn/pnpm/bun installed.

### Available Scripts:
*   `npm run dev`: Starts the development server on `http://localhost:3000`.
*   `npm run build`: Compiles the application for production deployment.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Runs ESLint to identify and report on patterns in code.
*   `npm run test`: Executes unit and integration tests using Jest and React Testing Library.

### Environment Variables:
The project uses environment variables, configured in `.env.local` (local development) and `.env.example` (template). Key variables include:
*   `EASEBUZZ_MERCHANT_KEY`
*   `EASEBUZZ_SALT`
*   `EASEBUZZ_ENV`
*   `NEXT_PUBLIC_BASE_URL` (for payment redirects)

## Development Conventions:

### Code Style:
*   **Linting:** ESLint is configured to maintain code quality and consistency.
*   **Formatting:** PostCSS with Tailwind CSS is used for styling.

### Testing:
*   **Unit/Integration Tests:** Jest is configured as the testing framework, with `@testing-library/react` for React component testing. Test files typically follow the `.test.ts` or `.test.tsx` naming convention.

### Project Structure:
*   **`src/app/`:** Contains Next.js application pages and API routes.
*   **`src/lib/`:** Houses utility functions, Supabase client, and integration services (e.g., `easebuzz.ts`, `payment.ts`).
*   **Path Aliases:** The project uses `@/*` to refer to the `src/` directory, simplifying imports.