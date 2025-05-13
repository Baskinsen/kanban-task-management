import { Component, Input } from '@angular/core';
import { Board } from '../services/task.type';

@Component({
  selector: 'app-edit-task',
  imports: [],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {
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
