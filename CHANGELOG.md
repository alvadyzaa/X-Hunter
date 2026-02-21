# Changelog

All notable changes to this project will be documented in this file.



### Added
- **Core AI Upgrade**: Powered the entire application with the new **Google Gemini 2.0 Flash (`gemini-2.0-flash`)** model for faster and more accurate viral hook generation and analysis.
- **Gemini API Key Checker**: Added an integrated tool in the Settings page to test API keys for validity and `gemini-2.0-flash` quota status, helping you manage "Too Many Requests" errors.
- **Dynamic Greeting**: Implemented a dashboard greeting that adjusts automatically based on the user's local timezone.
- **Text Analysis**: Enabled full text analysis functionality for drafting and trending tweets, scoring them on emotional impact, hook strength, and topic saturation.
- **Responsive Layout**: Added a collapsible sidebar menu for a better experience on mobile and tablet devices.

### Changed
- **Rebranding**: Renamed the application from "Pre-Tweet AI" to "X-Hunter" across the UI and codebase.
- **UI Streamlining**: Removed unused user and notification icons to declutter the top navigation bar.
- **Navigation Updates**: Activated the "New Analysis" button and the "Analyze" sidebar menu link to ensure smooth user flow.
- **Settings Persistence**: API key input in Settings now reliably saves to and loads from the browser's local storage.
- **Dashboard Polish**: Cleaned up the dashboard interface by removing the old purple circular icon for a more unified look.
