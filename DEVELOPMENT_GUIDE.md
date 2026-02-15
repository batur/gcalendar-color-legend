# Google Calendar Color Legend Chrome Extension

## Project Overview

A Chrome extension that adds a collapsible color legend panel to Google Calendar, allowing users to assign custom names to each event color for personal reference.

---

## Feature Requirements

### Core Features

1. **Domain Restriction**: Only active on `https://calendar.google.com/*`
2. **Collapsible Menu UI**: Positioned in the left sidebar (Development Area)
3. **Custom Color Names**: Users can assign custom labels to each of the 12 event colors
4. **Persistent Storage**: Color names saved using Chrome's storage API
5. **Non-invasive**: Does not modify actual Google Calendar functionality

### Color Palette (12 Colors)

Based on Google Calendar's event colors:

| Index | Color Name (Default) | Hex Code  |
| ----- | -------------------- | --------- |
| 1     | Tomato               | `#D50000` |
| 2     | Flamingo             | `#E67C73` |
| 3     | Tangerine            | `#F4511E` |
| 4     | Banana               | `#F6BF26` |
| 5     | Sage                 | `#33B679` |
| 6     | Basil                | `#0B8043` |
| 7     | Peacock              | `#039BE5` |
| 8     | Blueberry            | `#3F51B5` |
| 9     | Grape                | `#7986CB` |
| 10    | Lavender             | `#8E24AA` |
| 11    | Graphite             | `#616161` |
| 12    | Default (Calendar)   | `#4285F4` |

---

## Technical Architecture

### Project Structure

```
calendar-extension/
├── manifest.json          # Extension manifest (v3)
├── content.js             # Content script injected into Google Calendar
├── content.css            # Styles for the legend panel
├── popup.html             # Optional: Extension popup
├── popup.js               # Optional: Popup logic
├── background.js          # Service worker (if needed)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Manifest.json (v3)

```json
{
  "manifest_version": 3,
  "name": "Calendar Color Legend",
  "version": "1.0.0",
  "description": "Add custom names to Google Calendar event colors",
  "permissions": ["storage"],
  "host_permissions": ["https://calendar.google.com/*"],
  "content_scripts": [
    {
      "matches": ["https://calendar.google.com/*"],
      "js": ["content.js"],
      "css": ["content.css"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

## UI Design Specification

### Panel Location

- **Position**: Left sidebar, below "Other calendars" section
- **Injection Point**: Inside the sidebar container (`<div role="complementary">` or similar)

### Panel States

#### Collapsed State

```
┌─────────────────────────┐
│ ▶ Color Legend          │
└─────────────────────────┘
```

#### Expanded State

```
┌─────────────────────────┐
│ ▼ Color Legend          │
├─────────────────────────┤
│ 🔴 [Work Meetings     ] │
│ 🟠 [Personal Tasks    ] │
│ 🟡 [Deadlines         ] │
│ 🟢 [Health & Fitness  ] │
│ 🔵 [Learning          ] │
│ 🟣 [Social Events     ] │
│ ⚫ [Low Priority      ] │
│ ...                     │
└─────────────────────────┘
```

### UI Components

1. **Header**: Clickable toggle with arrow indicator
2. **Color Row**: Color circle + editable text input
3. **Auto-save**: Changes saved on blur/enter

---

## Implementation Details

### Content Script Logic

```javascript
// content.js - Pseudo-code structure

class ColorLegendPanel {
  constructor() {
    this.colors = [
      /* 12 colors */
    ];
    this.isCollapsed = true;
    this.customNames = {};
  }

  async init() {
    await this.loadStoredNames();
    this.injectPanel();
    this.attachEventListeners();
  }

  async loadStoredNames() {
    // Load from chrome.storage.sync
  }

  async saveNames() {
    // Save to chrome.storage.sync
  }

  injectPanel() {
    // Find sidebar container
    // Create and insert panel HTML
  }

  togglePanel() {
    // Expand/collapse logic
  }
}
```

### CSS Styling Approach

- Match Google Calendar's design language (Material Design)
- Use CSS variables for theming
- Ensure responsive behavior
- Smooth animations for collapse/expand

### Storage Schema

```json
{
  "colorLegend": {
    "color_1": "Work Meetings",
    "color_2": "Personal Tasks",
    "color_3": "",
    "color_4": "Deadlines",
    ...
  },
  "panelCollapsed": false
}
```

---

## Development Steps

### Phase 1: Basic Setup

- [ ] Create project structure
- [ ] Set up manifest.json
- [ ] Create placeholder icons
- [ ] Test extension loads in Chrome

### Phase 2: Panel Injection

- [ ] Identify correct DOM insertion point in Google Calendar
- [ ] Create collapsible panel HTML structure
- [ ] Style panel to match Google Calendar UI
- [ ] Implement collapse/expand functionality

### Phase 3: Color Legend Feature

- [ ] Add all 12 color entries with inputs
- [ ] Implement editable text fields
- [ ] Add auto-save on input change

### Phase 4: Storage Integration

- [ ] Implement chrome.storage.sync for persistence
- [ ] Load saved names on page load
- [ ] Handle storage errors gracefully

### Phase 5: Polish & Testing

- [ ] Add smooth animations
- [ ] Test across different calendar views
- [ ] Handle Google Calendar SPA navigation
- [ ] Add error handling

---

## Challenges & Solutions

### Challenge 1: Google Calendar SPA Navigation

**Problem**: Google Calendar is a Single Page Application; content may reload without page refresh.

**Solution**: Use MutationObserver to detect DOM changes and re-inject panel if removed.

```javascript
const observer = new MutationObserver((mutations) => {
  if (!document.querySelector("#color-legend-panel")) {
    injectPanel();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
```

### Challenge 2: Finding Stable DOM Selectors

**Problem**: Google Calendar uses obfuscated class names that may change.

**Solution**:

- Use ARIA attributes (more stable): `[role="complementary"]`, `[role="navigation"]`
- Use data attributes when available
- Fallback to structural selectors

### Challenge 3: Matching Google's Design

**Problem**: Extension UI should blend with Google Calendar.

**Solution**:

- Inspect and copy CSS properties from existing Google Calendar elements
- Use similar padding, fonts, and colors
- Match hover/focus states

---

## Testing Checklist

- [ ] Extension loads on calendar.google.com
- [ ] Extension does NOT load on other domains
- [ ] Panel appears in sidebar
- [ ] Collapse/expand works smoothly
- [ ] All 12 colors display correctly
- [ ] Custom names save and persist
- [ ] Names persist after browser restart
- [ ] Works in Week, Month, Day views
- [ ] Works after navigating between dates
- [ ] No console errors
- [ ] No visual glitches

---

## Future Enhancements

1. **Export/Import**: Allow users to export/import their color legends
2. **Multiple Profiles**: Different legend sets for different use cases
3. **Color Preview on Hover**: Show events of that color when hovering
4. **Sync Across Devices**: Already supported via chrome.storage.sync
5. **Dark Mode Support**: Detect and adapt to Google Calendar's dark mode
6. **Keyboard Navigation**: Accessibility improvements

---

## Resources

- [Chrome Extension Documentation (Manifest V3)](https://developer.chrome.com/docs/extensions/mv3/)
- [Content Scripts Guide](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Google Material Design Colors](https://material.io/design/color/)

---

## Quick Start Commands

```bash
# Navigate to project
cd /Users/paxtartarica/batur/projects/calendar-extension

# After creating files, load extension in Chrome:
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the calendar-extension folder
```

---

_Document created: February 15, 2026_
