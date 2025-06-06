import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {

  darkMode = signal<boolean>(false);
  showSideBar = signal<boolean>(true);
  isMobile = signal(false)
  logo = signal( 'assets/mobile.svg');


  constructor() {

    if(localStorage.getItem('darkMode') === 'true') {
        this.darkMode.update(()=> true)
        document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
        this.darkMode.update(()=> window.matchMedia('prefers-color-scheme:dark').matches ? true : false)
        document.documentElement.setAttribute('data-bs-theme', 'light')
    }
   
    console.log(this.darkMode())
    this.darkMode() === true ? document.documentElement.setAttribute('data-bs-theme', 'dark') : document.documentElement.setAttribute('data-bs-theme', 'light')

  }


  toggleDarkMode(): void {
    this.darkMode.update((value) => !value); 
    if (this.darkMode()) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('darkMode', 'false')
    }
  }
}