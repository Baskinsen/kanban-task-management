import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { Column, Task } from '../services/task.type';
import { DarkModeService } from '../services/dark-mode.service';
import { ModalService, ModalType } from '../services/modal-service';
import { DragDropModule,CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-column',
  imports: [CommonModule, DragDropModule],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.css'
})
export class BoardColumnComponent {
taskService = inject(TaskService);
darkModeService = inject(DarkModeService);
modalService = inject(ModalService);

  @Input() ColumnData: Column = {
    name: '',
    tasks: [],
  };

  @Input() boardName: string = '';
  
constructor () {
  
}

ngOnInit(): void {
  console.log(this.ColumnData)
}

get columnNames() {
  return this.taskService.getBoardColumns(this.boardName)
}

completedSubtasksNumber(task: Task): number {
  return task.subtasks.filter((subtask) => subtask.isCompleted).length;
}

drop(event: CdkDragDrop<Task[]>) {
  if(event.previousContainer === event.container) {
    return;
  }
  const previousContainerData = event.previousContainer.data;
  const previousContainerIndex = event.previousContainer.id;
  const currentContainerIndex = event.container.id;
  const task = previousContainerData[event.previousIndex];
  this.taskService.removeTaskFromColumn(task.title, previousContainerIndex, this.taskService.data().map((board)=> board.name).indexOf(this.boardName))
  this.taskService.updateTaskColumn(task, currentContainerIndex, this.taskService.data().map((board)=> board.name).indexOf(this.boardName))
 
}

openModal(type: ModalType, task: Task) {
  console.log('task:',task)
  this.modalService.modalConfig.set({
    name: type,
    title: task.title,
    message: '',
    data: {
      task: {
        ...task
      },
      columnName: this.ColumnData.name,
      boardName: this.boardName,
      index: this.taskService.data().map((board)=> board.name).indexOf(this.boardName),
    },
  })
  this.modalService.isOpen.set(true)
}


}
