import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-dark-mode-toggle',
  imports: [CommonModule],
  templateUrl: './dark-mode-toggle.component.html',
  styleUrl: './dark-mode-toggle.component.css'
})
export class DarkModeToggleComponent {
  darkModeService = inject(DarkModeService);

  constructor() {
    // Initialize the theme based on the current state
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      this.darkModeService.darkMode.set(true);
    } else {
      this.darkModeService.darkMode.set(false);
    }
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode(); 
    console.log(this.darkModeService.darkMode())
  }
}
