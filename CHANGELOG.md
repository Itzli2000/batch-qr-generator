## 1.0.0 (2025-05-03)

##### New Features

* **prepare-release:**
  *  automate staging, committing, and pushing changes during release preparation (7193055d)
  *  add version bumping logic to prepare-release script (130f3047)
* **Chore:**  add release preparation script and update package.json with new scripts and dependencies (b9540c20)
*  add LICENSE file, update README with project details, and bump version to 1.0.0 (a8957f4f)
* **BatchQRCode:**
  *  update title and header to reflect batch processing capabilities; refactor batch QR code logic into a custom hook (2f90780c)
  *  integrate JSZip for batch QR code downloads with progress indicator (89116725)
  *  enhance CSV upload with error handling and display data in a table format (7b9eb8b7)
  *  implement batch QR code generation from CSV files and integrate into main application (598ddd2e)
* **CSVProcessor:**  add CSV upload functionality for bulk QR code generation and implement file validation (ff503692)
* **QRCodeGenerator:**
  *  implement download functionality for QR codes with format selection (3a9afbdb)
  *  add QR code generation component with customizable options and integrate Radix UI select and slider components (44a37f0e)
* **index:**  update favicon and title; add new logo for QR Generator (0b7d7451)
* **Project:**  add initial project setup with Tailwind CSS, Radix UI components, and QR code generation functionality (bc89811c)

##### Bug Fixes

* **prepare-release:**  correct version bumping command to use predefined release types (82611467)

##### Code Style Changes

* **QRCodeGenerator:**  enhance layout and styling for improved user experience; update initial configuration values (464cf849)

