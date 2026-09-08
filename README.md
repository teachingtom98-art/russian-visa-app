# Russian Visa Planner & Preparation Workspace

## Project Overview
The Russian Visa Planner & Preparation Workspace is a local-first web application designed to help users prepare for a Russian Visa. Whether for tourism, business, work, study, private visits, transit, or electronic visas, this application provides an independent document organizer to speed up, simplify, and clarify the application process.

The application offers an interactive checklist with document pre-checks and generates a standardized package (in a `.ZIP` file or local folder) containing all the required documents and a summary, ready for final submission.

## Key Features
* **Interactive Checklists**: Select a visa category (Tourist, Business, Work, Student, Private, E-Visa, Transit) to load a tailored checklist of required documents.
* **Local-First Architecture**: All files (images, PDFs, documents) are stored locally in your browser using IndexedDB. No files are uploaded to any external server, ensuring complete data privacy.
* **Standardized Package Bundler**: Export all your attached documents into an organized `.ZIP` folder with standardized file names and a printable checklist summary HTML.
* **Save & Restore State**: Save your application progress locally or download a lightweight JSON backup to resume preparation on another device.
* **Dark & Light Themes**: Accessible and modern UI built with custom CSS properties for theme toggling.
* **Interactive Walkthrough**: Built-in tour to help new users quickly understand the features of the workspace.

## Prerequisites
Since this is a client-side only web application built with vanilla web technologies, there are no strict runtime requirements (like Node.js or Python) for the app itself to function.

* A modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari).
* *(Optional)* A local static file server (e.g., Python `http.server`, `npx serve`, or VS Code Live Server) to run the application optimally and avoid browser strict CORS policies for local files.

## Installation & Setup
To run the project locally on your machine, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Run a local web server**:
   You can use Python or Node.js to quickly serve the directory.

   *Using Python 3:*
   ```bash
   python3 -m http.server 8000
   ```

   *Using Node.js (serve):*
   ```bash
   npx serve .
   ```

3. **Open the application**:
   Open your browser and navigate to `http://localhost:8000` (or the port specified by your local server).

## Usage Instructions
1. **Start a New Plan**: Click "Start New Plan" to select your Visa Category, Applicant Name, Citizenship, and Number of Entries.
2. **Follow the Checklist**: Review the required documents. Click on each requirement for official guidance and consular specifications.
3. **Attach Files**: Drop files directly onto the checklist or click "Attach File" to upload PDFs, JPGs, or PNGs. (All files stay in your browser).
4. **Save Progress**: Click "Save Progress" to save your session locally, or "Export State (.JSON)" to back up your progress to a file.
5. **Export Package**: Once all documents are attached and verified, click "Export Package (.ZIP)" to download your bundle. This bundle includes standardized file names and a summary sheet.

## Folder Structure
```text
.
├── app.js            # Core application logic, IndexedDB storage, JSZip export, UI interactions.
├── index.html        # Main HTML layout, navigation, and modal structures.
├── styles.css        # Custom styling, dark/light themes, layout, and responsive design.
├── exemplar_passport_photo.jpg # Sample image used for document verification guidelines.
└── *.md              # Project documentation and planning files (e.g. Russian visa checklist app.md).
```
