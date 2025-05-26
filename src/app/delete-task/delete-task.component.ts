import { Component, Input,inject } from '@angular/core';
import { TaskService } from '../services/task.service';
import { ModalService } from '../services/modal-service';

@Component({
  selector: 'app-delete-task',
  imports: [],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css'
})
export class DeleteTaskComponent {
  taskService = inject(TaskService)
  modalService = inject(ModalService)
  @Input() data!:any

   
  deleteTask() {
    this.taskService.deleteTask(this.data.task, this.data.columnName, this.data.index)
}
}
