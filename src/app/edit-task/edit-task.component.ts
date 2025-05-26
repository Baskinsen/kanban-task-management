import { Component, Input, OnInit,inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Board, Task, SubTask } from '../services/task.type';
import { TaskService } from '../services/task.service';
import { DarkModeService } from '../services/dark-mode.service';
import { ModalService } from '../services/modal-service';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators,FormArray } from '@angular/forms';
@Component({
  selector: 'app-edit-task',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
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
export class EditTaskComponent implements OnInit, OnDestroy {
  @Input() data!: any
  taskService = inject(TaskService)
  darkModeService = inject(DarkModeService)
  modalService = inject(ModalService)
  darkModeEnabled = this.darkModeService.darkMode()
  formBuilder = inject(FormBuilder)
  taskForm!: FormGroup
  taskColumn!: FormControl
  dropdownOpen = false;
  private darkModeEffect: any;

  constructor() {
    this.darkModeEffect = effect(()=> {
      this.darkModeEnabled = this.darkModeService.darkMode()
      console.log(this.darkModeEnabled)
    })
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      subtasks: this.formBuilder.array([], Validators.required), 
     
    })
    this.taskColumn = this.formBuilder.control('', Validators.required)
  }

  ngOnInit () {
    const subtaskFormGroups = this.data.task.subtasks.map((subtask:SubTask) => this.formBuilder.group({
      title: [subtask.title, Validators.required],
      isCompleted: [subtask.isCompleted]
    }));
    this.taskForm.patchValue({
      title: this.data.task.title,
      description: this.data.task.description,
      subtasks: subtaskFormGroups
    })
    this.taskColumn.setValue(this.columnNames[0])

    console.log(this.data)
  }

  ngOnDestroy(): void {
    this.darkModeEffect();
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
    return this.taskService.getBoardColumns(this.data.boardName)
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

  editTask() {
    console.log('Board added:', this.taskForm.value, this.taskColumn.value);
    // this.taskService.addBoard(this.taskForm.value as Board)
    this.taskService.editTask(this.taskForm.value as Task, this.taskColumn.value as string, this.data.index as number)
  }
}
