# Calendar Color Legend

A Chrome extension that adds a collapsible color legend panel to Google Calendar, allowing you to assign custom names to each event color for personal reference.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)

## Features

- 🎨 **Custom Color Names**: Assign personal labels to all 11 Google Calendar event colors
- 📁 **Collapsible Panel**: Clean, space-saving UI that integrates with Google Calendar's sidebar
- 💾 **Persistent Storage**: Your custom names are saved locally on your device
- 🎯 **Domain-Specific**: Only activates on Google Calendar
- 🌙 **Dark Mode Support**: Adapts to Google Calendar's theme

## Screenshot

![Screenshot of the Color Legend Panel in Google Calendar](./assets/Screenshot%202026-02-16%20at%2001.28.34.png)

## Installation

### From Source (Developer Mode)

1. **Clone or download** this repository

2. **Generate icons** (required):
   - Open `icons/generate-icons.html` in your browser
   - Download all three icon files (16x16, 48x48, 128x128)
   - Save them to the `icons/` folder

3. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the `calendar-extension` folder

4. **Visit Google Calendar**:
   - Go to [https://calendar.google.com](https://calendar.google.com)
   - Look for the "Color Legend" panel in the left sidebar

## Usage

1. **Expand/Collapse**: Click on the "Color Legend" header to toggle the panel
2. **Add Custom Names**: Click on any text field and type your custom label
3. **Auto-Save**: Changes are saved automatically when you click away or press Enter
4. **Persistent**: Your labels are saved locally and persist across browser restarts

## File Structure

```
calendar-extension/
├── manifest.json      # Extension configuration
├── content.js         # Main logic
├── content.css        # Styles
├── icons/
│   ├── icon16.png     # 16x16 icon
│   ├── icon48.png     # 48x48 icon
│   └── icon128.png    # 128x128 icon
└── README.md
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**:
  - `storage` - For saving custom color names
- **Host Permissions**:
  - `https://calendar.google.com/*` - Only runs on Google Calendar

## Development

### Prerequisites

- Google Chrome
- Basic knowledge of JavaScript/CSS

### Making Changes

1. Edit the files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload Google Calendar to see changes

### Debugging

- Open Chrome DevTools on Google Calendar (`F12` or `Cmd+Option+I`)
- Check the Console tab for logs prefixed with "Calendar Color Legend:"
- Inspect the panel element with ID `#ccl-color-legend-panel`

## Known Limitations

- Google Calendar's DOM structure may change with updates, potentially requiring selector adjustments
- The panel position depends on finding the sidebar container

## Contributing

Feel free to submit issues or pull requests for:

- Bug fixes
- UI improvements
- Additional features

## License

MIT License - feel free to use and modify as needed.

---

Made with ❤️ for better calendar organization
