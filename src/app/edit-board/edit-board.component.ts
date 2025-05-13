import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { DarkModeService } from '../services/dark-mode.service';
import { Board } from '../services/task.type';

import {style, trigger, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-edit-board',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-board.component.html',
  styleUrl: './edit-board.component.css',
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
export class EditBoardComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  taskService = inject(TaskService);
  darkModeService = inject(DarkModeService);
  darkModeEnabled = this.darkModeService.darkMode();
  @Input() data!: Board;
  boardForm!: FormGroup;


  constructor( ) {
    effect(()=> {
      this.darkModeEnabled = this.darkModeService.darkMode()
      console.log(this.darkModeService.darkMode())
    })
  }

  ngOnInit() {
    // Initialize the form after Input data is available
    this.boardForm = this.formBuilder.group({
      name: [this.data.name],
      columns: this.formBuilder.array(
        this.data.columns.map(column => this.formBuilder.group({
          name: [column.name],
          tasks: this.formBuilder.array(column.tasks || []),
        }))
      ),
      index: this.data.index
    });
  }

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
  editBoard() {
    console.log('Board added:', this.boardForm.value);
    this.taskService.editBoard(this.boardForm.value as Board)
    
  }

}
