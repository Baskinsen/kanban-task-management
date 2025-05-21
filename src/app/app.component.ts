import { Component, OnInit, effect, inject, ChangeDetectorRef, HostListener, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { TaskService } from './services/task.service';
import { DarkModeService } from './services/dark-mode.service';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './services/modal-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'task-management-app';
  data: any;
taskService = inject(TaskService)
darkModeService = inject(DarkModeService);
modalService = inject(ModalService)
changeDetectorRef = inject(ChangeDetectorRef)
darkModeEnabled = this.darkModeService.darkMode();
navShown = this.darkModeService.showSideBar();
  constructor(private http: HttpClient) {
    effect(() => {
      this.navShown= this.darkModeService.showSideBar()
      this.darkModeEnabled = this.darkModeService.darkMode();
       
      this.darkModeEnabled = this.darkModeService.darkMode();
     if(window.innerWidth >= 425) {
      this.darkModeService.logo.set(this.darkModeService.darkMode() == true ? 'assets/logo-light.svg' : 'assets/logo-dark.svg');
   
     }
      
    })
  }

  ngOnInit(): void {
   
    this.taskService.getData()
    this.checkScreenSize()
  }

 @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    console.log(window.innerWidth)
    
    if(window.innerWidth <= 425) {
      this.darkModeService.isMobile.set(true);
      this.darkModeService.logo.set('assets/logo-mobile.svg')
      this.darkModeService.showSideBar.update(false)
    }
    this.changeDetectorRef.detectChanges();
  }

toggleSidebar() {
    this.darkModeService.showSideBar.update(() => true);
    console.log(this.darkModeService.showSideBar())
  }
}

