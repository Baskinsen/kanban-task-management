import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { EmptyBoardComponent } from '../empty-board/empty-board.component';
import { BoardColumnComponent } from '../board-column/board-column.component';
import { Board } from '../services/task.type';
import { DarkModeService, } from '../services/dark-mode.service';
import { ModalService, ModalType } from '../services/modal-service';

@Component({
  selector: 'app-board',
  imports: [EmptyBoardComponent, BoardColumnComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit{
  taskService = inject(TaskService);
  darkModeService = inject(DarkModeService);
  modalService = inject(ModalService);
  activeBoard = this.taskService.activeBoard$$.getValue();
  currentBoard: Board = {
    name: '',
    columns: [
      
    ]
  }

  constructor() {
      // console.log('working')
      // this.taskService.getBoardByName().subscribe((data) => {
      //   this.currentBoard = { name: data?.name ?? '', columns: data?.columns ?? [] };
      //   console.log(this.currentBoard)
      //   console.log(this.taskService.data())
      //    // this.TaskService.setActiveBoard(data);
      //  })
  
  }

  ngOnInit() {
    this.taskService.getBoardByName().subscribe((data)=> {
      this.currentBoard = { name: data?.name ?? '', columns: data?.columns ?? [] };
      console.log(this.currentBoard)
      // this.TaskService.setActiveBoard(data);
    })
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
    // this.toggleMenu()
  }

 }
