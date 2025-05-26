import { Component, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormBuilder, FormArray,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { DarkModeService } from '../services/dark-mode.service';
import { Board } from '../services/task.type';

import {style, trigger, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-add-board',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-board.component.html',
  styleUrl: './add-board.component.css',
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
export class AddBoardComponent {
  formBuilder = inject(FormBuilder)
  taskService = inject(TaskService)
  darkModeService = inject(DarkModeService)
  darkModeEnabled = this.darkModeService.darkMode()

  constructor() {
  
    effect(()=> {
      this.darkModeEnabled = this.darkModeService.darkMode()
      console.log(this.darkModeEnabled)
    })
  }

  boardForm = this.formBuilder.group({
    name: ['', Validators.required],
    columns: this.formBuilder.array([], Validators.required)
  })

  get columns() {
    return this.boardForm.get('columns') as FormArray;
  }

  get name() {
    return this.boardForm.get('name') as FormControl;

  }

  removeColumn(index:number) {
    this.columns.removeAt(index);
  }

  addColumn() {
    this.columns.push(this.formBuilder.group({
      name: new FormControl(''),
      tasks: this.formBuilder.array([])
    }));
  }
  addBoard() {
    console.log('Board added:', this.boardForm.value);
    this.taskService.addBoard(this.boardForm.value as Board)
  }

}
