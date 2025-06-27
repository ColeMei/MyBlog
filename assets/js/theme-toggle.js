/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes with an elegant moon/sun slider
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

  // Apply theme to document
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
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
    this.applyTheme(newTheme);
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
    // Apply initial theme
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
        this.applyTheme(e.matches ? 'light' : 'dark');
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