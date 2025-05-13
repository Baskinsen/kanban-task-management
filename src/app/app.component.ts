import { Component, OnInit, effect, inject } from '@angular/core';
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
darkModeEnabled = this.darkModeService.darkMode();
navShown = this.darkModeService.showSideBar();
  constructor(private http: HttpClient) {
    effect(() => {
      this.navShown= this.darkModeService.showSideBar()
      this.darkModeEnabled = this.darkModeService.darkMode();
      
    })
  }

  ngOnInit(): void {
   
    this.taskService.getData()
  }

toggleSidebar() {
    this.darkModeService.showSideBar.update(() => true);
    console.log(this.darkModeService.showSideBar())
  }
}

