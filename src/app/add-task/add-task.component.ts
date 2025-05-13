import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormBuilder, FormArray,Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { DarkModeService } from '../services/dark-mode.service';
import { Board, Task } from '../services/task.type';

import {style, trigger, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
  animations: [
    trigger('columnAnimation', [
      transition(':enter', [
        style({
          opacity: 0, 
          transform: 'translateY(-20px)',
          height: 0
         }),
         animate('200ms ease-out', style({
          opacity: 1,
          transform:'translateY(-20px)',
          height: '*'
         }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ 
          opacity: 0, 
          transform: 'translateY(-20px)',
          height: 0
        }))
      ])
    ])
  ]
})
export class AddTaskComponent implements OnInit{
  formBuilder = inject(FormBuilder)
  taskService = inject(TaskService)
  darkModeService = inject(DarkModeService)
  darkModeEnabled = this.darkModeService.darkMode()
  @Input() data!:Board
  taskForm!: FormGroup
  taskColumn!: FormControl
  dropdownOpen = false;


  constructor() {
    effect(()=> {
      this.darkModeEnabled = this.darkModeService.darkMode()
      console.log(this.darkModeEnabled)
    })
  }

  ngOnInit () {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      subtasks: this.formBuilder.array([], Validators.required), 
     
    })
    this.taskColumn = this.formBuilder.control(this.columnNames[0], Validators.required)

    console.log(this.data)
  }

  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  get description() {
    return this.taskForm.get('description') as FormControl;
  }

  get title() {
    return this.taskForm.get('title') as FormControl;

  }

  get column() {
    return this.taskColumn as FormControl;
  }

  get columnNames() {
    return this.taskService.getBoardColumns(this.data.name)
  }

  removeSubtask(index:number) {
    this.subtasks.removeAt(index);
  }

  addSubtask() {
    this.subtasks.push(this.formBuilder.group({
      title: new FormControl(''),
      isCompleted: false
    }));
  }

  selectColumn(column:string) {
    this.dropdownOpen = !this.dropdownOpen
    this.taskColumn.setValue(column)
  }

  addTask() {
    console.log('Board added:', this.taskForm.value, this.taskColumn.value);
    // this.taskService.addBoard(this.taskForm.value as Board)
    this.taskService.addTask(this.taskForm.value as Task, this.taskColumn.value as string, this.data.index as number)
  }

}
