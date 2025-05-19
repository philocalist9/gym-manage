This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Gym Management System Features

### Trainer Dashboard - Client Workout Plans

The Trainer Dashboard includes a comprehensive workout planning system for clients:

#### Creating Client Workout Plans

1. **Access the Workout Plans Page**
   - Navigate to the Trainer Dashboard > Workouts section
   - Click on "Create Client Plan" button

2. **Select a Client**
   - Choose from the dropdown of assigned clients
   - Clients become available after being assigned or scheduling an appointment

3. **Create a Weekly Plan**
   - Set a plan name and date range
   - Add exercises for each day of the week
   - For each exercise, specify:
     - Exercise name
     - Sets & reps
     - Rest time between sets
     - Optional notes for form guidance

4. **View Client Plans**
   - Access all created plans via the "View Client Plans" button
   - Plans are organized by client
   - Expand/collapse functionality to easily navigate multiple plans

#### Workout Templates

The system also offers workout templates that can be reused:

1. **Create Templates**
   - Use the "Add Template" button to create reusable workout formats
   - Templates include exercise lists with detailed instructions
   - Categorize by workout type and difficulty level

2. **Browse & Filter Templates**
   - Search for specific templates by name or description
   - Filter by workout type (Weight Loss, Muscle Gain, etc.)
   - Filter by difficulty level (Beginner, Intermediate, Advanced)

3. **View Template Details**
   - Click "View Details" to see complete workout information
   - Details include all exercises, sets/reps, and notes
