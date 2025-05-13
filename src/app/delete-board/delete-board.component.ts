import { Component, Input, inject } from '@angular/core';
import { Board } from '../services/task.type';
import { TaskService } from '../services/task.service';
import { ModalService } from '../services/modal-service';

@Component({
  selector: 'app-delete-board',
  imports: [],
  templateUrl: './delete-board.component.html',
  styleUrl: './delete-board.component.css'
})
export class DeleteBoardComponent {
  taskService = inject(TaskService)
  modalService = inject(ModalService)
@Input() data: Board = {
  name: '',
  columns: [
    {
      name: '',
      tasks: []
    }
  ]
}




  constructor() {

  }

  
  deleteBoard() {
    
    console.log('Board deleted:', this.data.name);
    this.taskService.deleteBoard(this.data.name)
}
}
