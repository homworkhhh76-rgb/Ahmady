V31 - Printer and invoice layout fixes
- Fixed invoice header overlap by wrapping long network names into multiple centered lines.
- Invoice/logo renderer now prioritizes the logo selected in Network Settings and keeps a compact local print copy.
- Added Settings > Printer Settings with 58mm, 80mm and A4 defaults.
- Invoice print/image/PDF actions use the saved printer size automatically.
- Print button now invokes the browser/system print command directly without the in-app preview step.
- Reworked print frame to wait for the rendered invoice image before printing to reduce blank-page failures.
- A4 keeps the invoice intentionally narrow and centered.
- Cache bumped to V31.
