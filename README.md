# ScholarStream

ScholarStream is a student-centric PDF toolkit designed to enhance the study experience. It allows users to import, view, and interact with PDF documents, offering features like a searchable document library, AI-powered content suggestions, and study aids.

## Core Features:

*   **PDF Import**: Import PDFs from your device. (Cloud storage integration like Google Drive, Dropbox, or iCloud are planned).
*   **Document Library**: A clear list view of your documents, showing thumbnails, file size, and "Last opened" metadata for easy navigation and sorting.
*   **PDF Viewing**:
    *   Single-page and continuous scroll viewing modes.
    *   Night mode toggle for comfortable reading in low light.
    *   Reader mode for a distraction-free experience.
*   **Snip Tool (Mocked)**: A button to simulate selecting a page region to save as a PNG.
*   **AI-Powered Content Suggestion**: Based on the content of the current document, the app suggests similar PDFs and learning materials from the web. Users can refine these suggestions with their own queries.
*   **Navigation and Study Aids (Mocked/Local State)**:
    *   Full-text search within a document.
    *   Bookmarking functionality.
    *   A "Study Notes" sidebar for custom annotations.
*   **Content Sharing (Mocked)**: Share annotated PDF or snips via email or WhatsApp (simulated).

## Tech Stack

*   **Frontend**: Next.js (App Router), React, TypeScript
*   **UI**: ShadCN UI components, Tailwind CSS
*   **AI**: Genkit (with Google AI/Gemini models)
*   **Styling**:
    *   Primary color: Deep indigo (#4B0082)
    *   Background color: Very light grayish-blue (#F0F8FF)
    *   Accent color: Soft lavender (#E6E6FA)
    *   Body text: 'Inter' (sans-serif)
    *   Headline: 'Space Grotesk' (sans-serif)

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn

### Setup

1.  **Clone the repository (if applicable) or ensure you have the project files.**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables:**
    *   Create a `.env` file in the root of the project.
    *   You will need to add your Google AI API key for Genkit features:
        ```env
        GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
        ```
    *   You can obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    The application uses two development servers: one for the Next.js app and one for Genkit.

    *   **Next.js App:**
        ```bash
        npm run dev
        # or
        yarn dev
        ```
        This will typically start the Next.js app on `http://localhost:9002`.

    *   **Genkit Developer UI (for AI flows):**
        In a separate terminal, run:
        ```bash
        npm run genkit:dev
        # or
        yarn genkit:dev
        ```
        This will start the Genkit Developer UI, usually on `http://localhost:4000`, where you can inspect and test your AI flows.

5.  Open your browser to `http://localhost:9002` to see the ScholarStream application.

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure Highlights

*   `src/app/`: Next.js App Router pages.
*   `src/components/`: Reusable React components.
    *   `src/components/ui/`: ShadCN UI components.
    *   `src/components/document/`: Components related to document display and library.
    *   `src/components/viewer/`: Components specific to the PDF viewing interface.
*   `src/ai/`: Genkit related files.
    *   `src/ai/flows/`: Genkit flow definitions.
*   `src/constants/`: Mock data and other constants.
*   `src/lib/`: Utility functions.
*   `src/hooks/`: Custom React hooks.
*   `src/types/`: TypeScript type definitions.
*   `public/`: Static assets.
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `next.config.ts`: Next.js configuration.

## Known Limitations / Future Work

*   Many features currently rely on mock data and simulated actions (e.g., PDF import, snip tool, sharing, persistent bookmarks/notes). Backend integration (e.g., Firebase) is needed for full functionality.
*   Actual PDF rendering is not implemented; the viewer shows mock content.
*   Cloud storage integrations for PDF import are planned.
*   Full-text search, bookmarking, and study notes need to be connected to a persistent storage and the actual document content.
