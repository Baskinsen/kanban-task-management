import { Component, Input } from '@angular/core';
import { Board } from '../services/task.type';

@Component({
  selector: 'app-delete-task',
  imports: [],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css'
})
export class DeleteTaskComponent {
  @Input() data: Board = {
    name: '',
    columns: [
      {
        name: '',
        tasks: []
      }
    ]
  }
}
