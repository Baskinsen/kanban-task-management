import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { EmptyBoardComponent } from '../empty-board/empty-board.component';
import { BoardColumnComponent } from '../board-column/board-column.component';
import { Board } from '../services/task.type';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-board',
  imports: [EmptyBoardComponent, BoardColumnComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit{
  TaskService = inject(TaskService);
  darkModeService = inject(DarkModeService);
  currentBoard: Board = {
    name: '',
    columns: [
      
    ]
  }

  constructor() {
      console.log('working')
      this.TaskService.getBoardByName().subscribe((data) => {
        this.currentBoard = { name: data?.name ?? '', columns: data?.columns ?? [] };
        console.log(this.currentBoard)
        console.log(this.TaskService.data())
         // this.TaskService.setActiveBoard(data);
       })
  
  }

  ngOnInit() {
    this.TaskService.getBoardByName().subscribe((data)=> {
      this.currentBoard = { name: data?.name ?? '', columns: data?.columns ?? [] };
      console.log(this.currentBoard)
      // this.TaskService.setActiveBoard(data);
    })
  }

 }
