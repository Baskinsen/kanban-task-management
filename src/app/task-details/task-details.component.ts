import { Component, Input, inject, signal, OnInit, ElementRef, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, SubTask } from '../services/task.type';
import { TaskService } from '../services/task.service';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-task-details',
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit {
  @Input() data!: any
  dropdownOpen = false;
  taskService = inject(TaskService)
  darkModeService = inject(DarkModeService)
  darkModeEnabled = this.darkModeService.darkMode()
  status = signal('')


  constructor() {
    effect(()=> {
      this.darkModeEnabled = this.darkModeService.darkMode()
      // this.status.set(this.data.columnName)
      console.log(this.status())
      console.log(this.darkModeEnabled)
    })
  }

  ngOnInit(): void {
    this.status.set(this.data.columnName)
    console.log(this.data)
  }

  get columnNames() {
    return this.taskService.getBoardColumns(this.data.boardName)
  }

  completedSubtasksNumber(): number {
    return this.data.task.subtasks.filter((subtask: SubTask) => subtask.isCompleted).length;
  }

  selectColumn(column:string) {
    this.dropdownOpen = !this.dropdownOpen
    // this.taskColumn.setValue(column)
    this.status.set(column)

      this.taskService.removeTaskFromColumn(this.data.task.title, this.data.columnName,this.data.index)
    this.taskService.updateTaskColumn(this.data.task, column, this.data.index)


  }
}



