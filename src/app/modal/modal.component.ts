import { Component, inject, Input, Output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../services/dark-mode.service';
import { ModalService, ModalType } from '../services/modal-service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { AddBoardComponent } from '../add-board/add-board.component';
import { EditBoardComponent } from '../edit-board/edit-board.component';
import { DeleteBoardComponent } from '../delete-board/delete-board.component';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
// import { DarkModeService } from '../services/dark-mode.service';
import { TaskService } from '../services/task.service';
import { ModalData } from '../services/modal-service';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, AddTaskComponent, AddBoardComponent, EditBoardComponent, DeleteBoardComponent, DeleteTaskComponent, EditTaskComponent, TaskDetailsComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  darkModeService = inject(DarkModeService)
  modalService = inject(ModalService)
  config = this.modalService.modalConfig()
  showMenu = false
  darkModeEnabled = this.darkModeService.darkMode();  
  

  constructor() {
    effect(() => {
      this.config = this.modalService.modalConfig()
      this.darkModeEnabled = this.darkModeService.darkMode();

    })
    console.log(this.config)
  }

  isEditOrDetails() {
    return this.config?.name.toLocaleLowerCase().includes('details')
  }

  openMenu() {
    this.showMenu = !this.showMenu
  }

  openEditTaskModal(type: ModalType) {
    this.modalService.modalConfig.set({
      name: type,
      title:  'Edit Task',
      message: '',
      data: {
        task: {
          ...this.config?.data.task
        },
        columnName: this.config?.data.columnName,
        boardName: this.config?.data.boardName,
        index: this.config?.data.index,
      },
    })
    this.modalService.isOpen.set(true)
    this.openMenu()
  }

  openDeleteTaskModal(type: ModalType) {
    this.modalService.modalConfig.set({
      name: type,
      title: this.config?.data?.task?.title || '',
      message: '',
      data: {
        task: {
          ...this.config?.data.task
        },
        columnName: this.config?.data.columnName,
        boardName: this.config?.data.boardName,
        index: this.config?.data.index,
      },
    })
  }

}
