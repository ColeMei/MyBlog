/**
 * Theme Toggle Functionality
 * Root-override of the fork's theme-toggle.js. Adds a short-lived
 * `theme-transitioning` class on <html> around a switch so the universal
 * transition rule in _userstyles.scss only animates actual theme changes,
 * never page load, hovers, or unrelated animations.
 */

class ThemeToggle {
  constructor() {
    this.theme = this.getStoredTheme() || this.getPreferredTheme();
    this.init();
  }

  // Get theme from localStorage
  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  // Set theme to localStorage
  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  // Get user's preferred theme from system
  getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // Apply theme to document; animate=true wraps the change in a transition window
  applyTheme(theme, animate = false) {
    const root = document.documentElement;

    if (animate) {
      root.classList.add('theme-transitioning');
      clearTimeout(this._transitionTimer);
      this._transitionTimer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 400);
    }

    root.setAttribute('data-theme', theme);
    this.theme = theme;
    this.setStoredTheme(theme);

    // Update checkbox state
    const checkbox = document.querySelector('.theme-toggle input');
    if (checkbox) {
      checkbox.checked = theme === 'light';
    }
  }

  // Toggle between themes
  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme, true);
  }

  // Create elegant slider toggle switch HTML
  createToggleSwitch() {
    const container = document.createElement('div');
    container.className = 'theme-toggle-container';

    container.innerHTML = `
      <label class="theme-toggle" title="Toggle between light and dark theme">
        <input type="checkbox" ${this.theme === 'light' ? 'checked' : ''}>
        <span class="theme-slider"></span>
        <span class="sr-only">Toggle theme</span>
      </label>
    `;

    const checkbox = container.querySelector('input');
    checkbox.addEventListener('change', () => {
      this.toggleTheme();
    });

    // Handle keyboard navigation
    checkbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    return container;
  }

  // Initialize theme system
  init() {
    // Apply initial theme (no transition window on first paint)
    this.applyTheme(this.theme);

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.addToggleSwitch();
      });
    } else {
      this.addToggleSwitch();
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? 'light' : 'dark', true);
      }
    });
  }

  // Add toggle switch to page
  addToggleSwitch() {
    const toggleSwitch = this.createToggleSwitch();
    document.body.appendChild(toggleSwitch);
  }
}

// Initialize theme toggle when script loads
new ThemeToggle();
