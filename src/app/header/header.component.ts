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
  isMobile = signal(false);
  taskService = inject(TaskService)
  darkModeService = inject(DarkModeService);
  modalService = inject(ModalService)
  darkModeEnabled = this.darkModeService.darkMode();  
  isBoardEmpy = false
  activeBoard = ''
  showMenu = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.taskService.activeBoard$.subscribe((data)=> this.activeBoard = data)
    this.taskService.data().map(board=> {
      if(board.name == this.taskService.activeBoard()) {
        this.isBoardEmpy = board.columns.length == 0
      }
    })
   
  
    console.log(this.taskService.activeBoard$$.getValue())
    console.log(this.isMobile)
   
    console.log(this.isBoardEmpy)
  }


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

  ngOnDestroy(): void {
    this.taskService.activeBoard$$.complete();
    this.cdr.detach(); 
  }
}

