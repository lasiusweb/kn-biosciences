# Technology Stack for kn-biosciences

## Overview
This document outlines the core technologies and frameworks utilized in the kn-biosciences application.

## Programming Languages
*   **TypeScript:** The primary programming language used for both frontend and backend development (where applicable, e.g., Next.js API routes) due to its strong typing capabilities, which enhance code quality and maintainability.

## Frontend Frameworks
*   **Next.js:** A React framework for building full-stack web applications. It enables features like server-side rendering (SSR), static site generation (SSG), and API routes, providing a powerful and flexible foundation for the user interface and frontend logic.
*   **React:** The declarative JavaScript library for building user interfaces, forming the core component model for the Next.js application.

## Styling
*   **Tailwind CSS:** A utility-first CSS framework that enables rapid UI development by providing low-level utility classes directly in markup. This approach promotes consistency and efficiency in styling the application.

## Backend and Database
*   **Supabase:** An open-source Firebase alternative providing a suite of backend services including a PostgreSQL database, authentication, instant APIs, and storage. It serves as the primary backend and database solution for the kn-biosciences application, managing data persistence and user authentication.

## Third-Party Integrations
*   **Easebuzz:** Payment gateway integration for processing transactions.
*   **PayU:** Additional payment gateway integration for processing transactions.
*   **Twilio Flex:** Integration with Supabase Twilio Flex for voice calls, enhancing communication capabilities within the application.
