/**
 * Calendar Color Legend Extension
 * Adds a collapsible color legend panel to Google Calendar
 */

(function () {
  "use strict";

  // Google Calendar event colors
  const CALENDAR_COLORS = [
    { id: "color_1", name: "Tomato", hex: "#D50000" },
    { id: "color_2", name: "Flamingo", hex: "#E67C73" },
    { id: "color_3", name: "Tangerine", hex: "#F4511E" },
    { id: "color_4", name: "Banana", hex: "#F6BF26" },
    { id: "color_5", name: "Sage", hex: "#33B679" },
    { id: "color_6", name: "Basil", hex: "#0B8043" },
    { id: "color_7", name: "Peacock", hex: "#039BE5" },
    { id: "color_8", name: "Blueberry", hex: "#3F51B5" },
    { id: "color_9", name: "Grape", hex: "#7986CB" },
    { id: "color_10", name: "Lavender", hex: "#8E24AA" },
    { id: "color_11", name: "Graphite", hex: "#616161" },
  ];

  const STORAGE_KEY = "colorLegendData";
  const PANEL_STATE_KEY = "panelCollapsed";
  const PANEL_ID = "ccl-color-legend-panel";
  const REPLACE_ATTRS = ["data-text", "aria-label", "data-tooltip", "title"];
  const REPLACE_SELECTOR = REPLACE_ATTRS.map((a) => `[${a}]`).join(", ");

  // Map default color names to color IDs for lookup
  const DEFAULT_NAME_TO_ID = {};
  CALENDAR_COLORS.forEach((c) => {
    DEFAULT_NAME_TO_ID[c.name.toLowerCase()] = c.id;
  });

  class ColorLegendPanel {
    constructor() {
      this.customNames = {};
      this.isCollapsed = true;
      this.panel = null;
      this.initialized = false;
    }

    async init() {
      if (this.initialized) return;

      try {
        await this.waitForSidebar();
      } catch {
        return;
      }

      await this.loadStoredData();
      this.injectPanel();
      this.setupObserver();

      this.initialized = true;
      console.log("Calendar Color Legend: Initialized");
    }

    /**
     * Wait for the sidebar with timeout (30s max)
     */
    waitForSidebar() {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
          const sidebar = this.findSidebarContainer();
          if (sidebar) {
            resolve(sidebar);
          } else if (++attempts >= 60) {
            console.error("Calendar Color Legend: Sidebar not found after 30s");
            reject(new Error("Sidebar not found"));
          } else {
            setTimeout(check, 500);
          }
        };
        check();
      });
    }

    /**
     * Find the h1 "Drawer" element and return its parent
     */
    findSidebarContainer() {
      for (const h1 of document.querySelectorAll("h1")) {
        if (h1.textContent.trim() === "Drawer" && h1.parentElement) {
          return h1.parentElement;
        }
      }
      return null;
    }

    async loadStoredData() {
      try {
        const result = await chrome.storage.sync.get([
          STORAGE_KEY,
          PANEL_STATE_KEY,
        ]);
        this.customNames = result[STORAGE_KEY] || {};
        this.isCollapsed = result[PANEL_STATE_KEY] ?? true;
      } catch (error) {
        console.warn(
          "Calendar Color Legend: Failed to load stored data",
          error,
        );
        this.customNames = {};
        this.isCollapsed = true;
      }
    }

    /**
     * Persist a key-value pair to chrome.storage.sync
     */
    async saveToStorage(key, value) {
      try {
        await chrome.storage.sync.set({ [key]: value });
      } catch (error) {
        console.error(`Calendar Color Legend: Failed to save ${key}`, error);
      }
    }

    createPanelHTML() {
      const lastIndex = CALENDAR_COLORS.length - 1;
      const colorRows = CALENDAR_COLORS.map((color, i) => {
        const savedName = this.customNames[color.id] || "";
        return `
          <div class="ccl-color-row ${i === lastIndex ? "ccl-last-row" : ""}" data-color-id="${color.id}">
            <span class="ccl-color-dot" style="background-color: ${color.hex};" title="${color.name}" data-ccl-ignore></span>
            <input type="text" class="ccl-color-input" placeholder="${color.name}"
              value="${this.escapeHtml(savedName)}" data-color-id="${color.id}" maxlength="30" />
          </div>`;
      }).join("");

      return `
        <div id="${PANEL_ID}" class="ccl-panel ${this.isCollapsed ? "ccl-collapsed" : ""}">
          <div class="ccl-header">
            <span class="ccl-toggle-icon">${this.isCollapsed ? "▶" : "▼"}</span>
            <span class="ccl-title">Color Legend</span>
            <button class="ccl-restore-btn" title="Restore defaults">↺</button>
          </div>
          <div class="ccl-content">${colorRows}</div>
        </div>`;
    }

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }

    injectPanel() {
      document.getElementById(PANEL_ID)?.remove();

      const sidebar = this.findSidebarContainer();
      if (!sidebar) return;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = this.createPanelHTML();
      this.panel = wrapper.firstElementChild;

      sidebar.appendChild(this.panel);
      this.attachEventListeners();
    }

    attachEventListeners() {
      if (!this.panel) return;

      this.panel
        .querySelector(".ccl-header")
        .addEventListener("click", () => this.togglePanel());

      this.panel
        .querySelector(".ccl-restore-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation();
          this.restoreDefaults();
        });

      this.panel.querySelectorAll(".ccl-color-input").forEach((input) => {
        input.addEventListener("blur", (e) => this.handleInputChange(e));
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") e.target.blur();
        });
        input.addEventListener("click", (e) => e.stopPropagation());
      });
    }

    handleInputChange(event) {
      const { colorId } = event.target.dataset;
      const value = event.target.value.trim();

      if (value) {
        this.customNames[colorId] = value;
      } else {
        delete this.customNames[colorId];
      }

      this.saveToStorage(STORAGE_KEY, this.customNames);
      this.showSavedIndicator(event.target);
    }

    async restoreDefaults() {
      if (!confirm("Clear all custom color names?")) return;

      this.customNames = {};
      await this.saveToStorage(STORAGE_KEY, this.customNames);

      this.panel.querySelectorAll(".ccl-color-input").forEach((input) => {
        input.value = "";
      });
    }

    showSavedIndicator(input) {
      const row = input.closest(".ccl-color-row");
      if (!row) return;

      row.querySelector(".ccl-saved-indicator")?.remove();

      const indicator = document.createElement("span");
      indicator.className = "ccl-saved-indicator";
      indicator.textContent = "✓ Saved";
      row.appendChild(indicator);

      requestAnimationFrame(() => indicator.classList.add("ccl-show"));

      setTimeout(() => {
        indicator.classList.remove("ccl-show");
        setTimeout(() => indicator.remove(), 200);
      }, 1500);
    }

    togglePanel() {
      this.isCollapsed = !this.isCollapsed;
      this.panel.classList.toggle("ccl-collapsed", this.isCollapsed);
      this.panel.querySelector(".ccl-toggle-icon").textContent = this
        .isCollapsed
        ? "▶"
        : "▼";
      this.saveToStorage(PANEL_STATE_KEY, this.isCollapsed);
    }

    /**
     * Replace matching color-name attributes on an element
     */
    replaceAttrsOn(el) {
      if (el.hasAttribute?.("data-ccl-ignore")) return;
      for (const attr of REPLACE_ATTRS) {
        const value = el.getAttribute?.(attr);
        if (!value) continue;
        const colorId = DEFAULT_NAME_TO_ID[value.trim().toLowerCase()];
        if (colorId && this.customNames[colorId]) {
          el.setAttribute(attr, this.customNames[colorId]);
        }
      }
    }

    /**
     * Single MutationObserver: SPA re-injection + color name replacement
     */
    setupObserver() {
      let replacing = false;
      let replaceTimer = null;
      let panelCheckTimer = null;
      let pendingNodes = new Set();

      const doReplace = () => {
        if (replacing) return;
        if (Object.keys(this.customNames).length === 0) {
          pendingNodes.clear();
          return;
        }
        replacing = true;

        const nodes = pendingNodes;
        pendingNodes = new Set();

        for (const node of nodes) {
          if (!document.body.contains(node)) continue;
          if (node.closest?.("#" + PANEL_ID)) continue;

          this.replaceAttrsOn(node);

          if (node.querySelectorAll) {
            node.querySelectorAll(REPLACE_SELECTOR).forEach((el) => {
              if (!el.closest("#" + PANEL_ID)) this.replaceAttrsOn(el);
            });
          }
        }

        replacing = false;
      };

      const observer = new MutationObserver((mutations) => {
        if (replacing) return;

        for (const mutation of mutations) {
          if (mutation.type === "attributes") {
            pendingNodes.add(mutation.target);
          } else {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                pendingNodes.add(node);
              }
            }
          }
        }

        if (pendingNodes.size > 0) {
          clearTimeout(replaceTimer);
          replaceTimer = setTimeout(doReplace, 100);
        }

        clearTimeout(panelCheckTimer);
        panelCheckTimer = setTimeout(() => {
          if (!document.getElementById(PANEL_ID)) this.injectPanel();
        }, 1000);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: REPLACE_ATTRS,
      });
    }
  }

  // document_idle guarantees DOM is ready
  const panel = new ColorLegendPanel();
  panel.init();
})();
