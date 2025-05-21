import { Component, OnInit, ChangeDetectorRef, HostListener, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { DarkModeService } from '../services/dark-mode.service';
import { ModalService, ModalType } from '../services/modal-service';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  // logo = signal( 'assets/mobile.svg');
  isMobile = signal(false);
  taskService = inject(TaskService)
  darkModeService = inject(DarkModeService);
  modalService = inject(ModalService)
  darkModeEnabled = this.darkModeService.darkMode();  
  isBoardEmpy = false
  activeBoard = ''
  showMenu = false;

  constructor(private cdr: ChangeDetectorRef) {
    // effect(()=> {
    //   this.darkModeEnabled = this.darkModeService.darkMode();
    //  if(window.innerWidth >= 425) {
    //   this.logo.set(this.darkModeService.darkMode() == true ? 'assets/logo-light.svg' : 'assets/logo-dark.svg');
    // this.taskService.data().map(board=> {
    //   if(board.name == this.taskService.activeBoard()) {
    //     this.isBoardEmpy = board.columns.length == 0
    //   }
    // })
    //  }
    
    // })
    
  }

  ngOnInit(): void {
    this.taskService.activeBoard$.subscribe((data)=> this.activeBoard = data)
    this.taskService.data().map(board=> {
      if(board.name == this.taskService.activeBoard()) {
        this.isBoardEmpy = board.columns.length == 0
      }
    })
   
   
    // this.checkScreenSize();
  
    console.log(this.taskService.activeBoard$$.getValue())
    console.log(this.isMobile)
   
    console.log(this.isBoardEmpy)
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(): void {
  //   this.checkScreenSize();
  // }

  // private checkScreenSize(): void {
  //   console.log(window.innerWidth)
    
  //   if(window.innerWidth <= 425) {
  //     this.isMobile.set(true);
  //     // this.logo.set('assets/logo-mobile.svg')
  //   }
  //   this.cdr.detectChanges();
  // }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    console.log(this.showMenu)
  }

  openEditModal(type: ModalType) {
    this.modalService.modalConfig.set({
      title: 'Edit Board',
      message: '',
      name: type,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Add Task',
      showCancelButton: true,
      showConfirmButton: true,
      data: {
        name: this.activeBoard,
        columns: this.taskService.data().find(board => board.name == this.activeBoard)?.columns ?? [],
        tasks: (this.taskService.data().find(board => board.name == this.activeBoard)?.columns.map(column => column.tasks).flat().filter(task => task !== undefined) ?? []),
        index: this.taskService.data().findIndex(board => board.name == this.activeBoard),
      }
    })
    this.modalService.isOpen.set(true);
    this.toggleMenu()
  }
  openDeleteModal(type: ModalType) {
    this.modalService.modalConfig.set({
      title: 'Delete this Board?',
      message: '',
      name: type,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Add Task',
      showCancelButton: true,
      showConfirmButton: true,
      data: {
        name: this.activeBoard,
        columns: this.taskService.data().find(board => board.name == this.activeBoard)?.columns ?? [],
        tasks: (this.taskService.data().find(board => board.name == this.activeBoard)?.columns.map(column => column.tasks).flat().filter(task => task !== undefined) ?? []),
        index: this.taskService.data().findIndex(board => board.name == this.activeBoard),
      }
    })
    this.modalService.isOpen.set(true);
    this.toggleMenu()
  }

  openAddTaskModal(type: ModalType) {
    this.modalService.modalConfig.set({
      title: 'Add New Task',
      message: '',
      name: type,
      data: {
        name: this.activeBoard,
        columns: this.taskService.data().find(board => board.name == this.activeBoard)?.columns ?? [],
        tasks: (this.taskService.data().find(board => board.name == this.activeBoard)?.columns.map(column => column.tasks).flat().filter(task => task !== undefined) ?? []),
        index: this.taskService.data().findIndex(board => board.name == this.activeBoard),
      }
    })
    this.modalService.isOpen.set(true)
  }

  toggleSideBar() {
    this.darkModeService.showSideBar.update((prev)=> !prev)
  }
}

