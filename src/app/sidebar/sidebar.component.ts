import { Component, OnInit, inject, signal, effect, Input, ChangeDetectorRef, HostListener,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { DarkModeService } from '../services/dark-mode.service';
import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';
import { RouterModule } from '@angular/router';
import { ModalService } from '../services/modal-service';
import { ModalType } from '../services/modal-service';
import { single } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, DarkModeToggleComponent, RouterModule,],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  darkModeService = inject(DarkModeService)
  taskService = inject(TaskService)
  modalService = inject(ModalService)
  boards= signal<string[]>([])
  numberOfBoards: number = 0;
  activeBoard: string = ''
  cdr = inject(ChangeDetectorRef)
  isMobile = signal(false)
  
  constructor() {
    console.log(this.taskService.activeBoard)
    console.log(this.darkModeService.showSideBar())

    effect(() => {
    console.log(this.darkModeService.darkMode())
    this.boards.set(this.taskService.getBoardNames())
    })
   
  }


  ngOnInit(): void {
    this.taskService.activeBoard$.subscribe((data)=> {
      this.activeBoard = data
    })
 this.taskService.getNumberOfBoards().subscribe((data)=> {
      this.numberOfBoards = data;
      console.log(this.numberOfBoards)
    }
    )
    
}

  setActiveBoard (boardName:string) {
    this.taskService.activeBoard$$.next(boardName)
    this.taskService.setActiveBoard(boardName);
    if(this.darkModeService.isMobile())this.darkModeService.showSideBar.update((prev)=> false)
  }

  toggleSidebar() {
    this.darkModeService.showSideBar.update(() => false);
    console.log(this.darkModeService.showSideBar())
  }

  openModal(type: ModalType) {
 
    this.modalService.modalConfig.set({
      title: 'Add Board',
      message: 'Are you sure you want to add a new board?',
      name: type,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Add Board',
      showCancelButton: true,
      showConfirmButton: true,
    })
    this.modalService.isOpen.set(true);

  }


  ngOnDestroy(): void {
    this.taskService.activeBoard$$.complete();
    // this.taskService.getNumberOfBoards().unsubscribe();
    // this.boards.complete();
    // this.isMobile.complete();
  
  }
}
