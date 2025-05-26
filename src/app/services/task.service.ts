import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Board, Task } from './task.type';
import { ModalService } from './modal-service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private dataUrl = 'assets/data.json'; 
  data = signal<Board[]>([]);
  activeBoard = signal<string>('');
  activeBoard$$ = new BehaviorSubject('');  
  activeBoard$ = this.activeBoard$$.asObservable();
  private dataInitialized = false;

  constructor(private http: HttpClient, private modalService: ModalService) {}

  getData(): Observable<Board[]> {
  
    if (!this.dataInitialized) {
      return this.http.get<{ boards: Board[] }>(this.dataUrl).pipe(
        map((response) => {
          this.data.set(response.boards);
          this.activeBoard$$.next(response.boards[0].name);
          this.dataInitialized = true;
          return this.data();
        })
      );
    }
    return new Observable<Board[]>(observer => {
      observer.next(this.data());
      observer.complete();
    });
  }

  getBoardNames(): string[] {
    return this.data().map((board) => board.name );
  }

  getBoardByName(): Observable<Board | undefined> {
    return this.activeBoard$.pipe(
      map((boardName) => this.data().find((board) => board.name === boardName) )
    )
  }

  getNumberOfBoards(): Observable<number> {
    return this.getData().pipe(
      map((boards) => boards.length) 
    );
  }

  setActiveBoard(board: string) {
    this.activeBoard.set(board);
    console.log(this.activeBoard())
  }

  addBoard(board: Board) {
    this.data.update((prevData) => [...prevData, board]);
    this.activeBoard$$.next(board.name);
    this.activeBoard.set(board.name);
    this.modalService.close();
  }

  editBoard(board: Board) {
    this.data.update((prevData)=> {
      if (board.index !== -1) {
        const updatedData = [...prevData];
        updatedData[board.index as number] = board;
        return updatedData;
      }

      return prevData;
    })
    this.activeBoard$$.next(board.name);

    this.modalService.close()
  }
  
  deleteBoard(name: string) {
    this.data.update((prevData) => prevData.filter((board) => board.name !== name));
    this.activeBoard$$.next(this.data()[0]?.name || '');
    this.modalService.close();
  }

  addTask(task: Task, columnName: string, boardIndex: number) {
    this.data.update((prevData)=> {
      const updatedData = [...prevData];
      const columnIndex = updatedData[boardIndex].columns.findIndex((column) => column.name === columnName);
      if (columnIndex !== -1 && updatedData[boardIndex].columns[columnIndex].tasks !== undefined) {
        updatedData[boardIndex].columns[columnIndex].tasks.push(task);
      }
      return updatedData;
    })
    this.modalService.close()
  }

  deleteTask(task: Task, columnName: string, boardIndex: number) {
    this.data.update((prevData) => {
      const updatedData = [...prevData];
      const columnIndex = updatedData[boardIndex].columns.findIndex((column) => column.name === columnName);
      if (columnIndex !== -1 && updatedData[boardIndex].columns[columnIndex].tasks !== undefined) {
        updatedData[boardIndex].columns[columnIndex].tasks = updatedData[boardIndex].columns[columnIndex].tasks?.filter((t) => t.title !== task.title);
      }
      return updatedData;
    });
    this.modalService.close();
  }

  editTask(task: Task, columnName: string, boardIndex: number) {
    this.data.update((prevData)=> {
      const updatedData = [...prevData];
      const columnIndex = updatedData[boardIndex].columns.findIndex((column) => column.name === columnName);
      if (columnIndex !== -1 && updatedData[boardIndex].columns[columnIndex].tasks !== undefined) {
        const taskIndex = updatedData[boardIndex].columns[columnIndex].tasks.findIndex((t) => t.title === task.title);
        if (taskIndex !== -1) {
          updatedData[boardIndex].columns[columnIndex].tasks[taskIndex] = task;
        }
      }
      return updatedData;
    })
    this.updateTaskColumn(task, columnName, boardIndex)
    this.removeTaskFromColumn(task.title, columnName, boardIndex)
    this.modalService.close()
  }

  getBoardColumns(boardName:string) {
    return this.data().find((board)=> board.name === boardName)?.columns.map((column) => column.name) ?? []
  }

  updateTaskColumn(task:Task, columnName: string, boardIndex: number) {
    this.data.update((prevData)=> {
      const updatedData = [...prevData];
      const columnIndex = updatedData[boardIndex].columns.findIndex((column) => column.name === columnName);
      if (columnIndex !== -1 && updatedData[boardIndex].columns[columnIndex].tasks !== undefined) {
        updatedData[boardIndex].columns[columnIndex].tasks.push(task);
      }
      return updatedData;
    })
  }
  removeTaskFromColumn(taskTitle: string, columnName: string, boardIndex: number) {
    this.data.update((prevData) => {
      const updatedData = [...prevData];
      const columnIndex = updatedData[boardIndex].columns.findIndex((column) => column.name === columnName);
      if (columnIndex !== -1 && updatedData[boardIndex].columns[columnIndex].tasks !== undefined) {
        updatedData[boardIndex].columns[columnIndex].tasks = updatedData[boardIndex].columns[columnIndex].tasks?.filter((t) => t.title !== taskTitle);
      }
      return updatedData;
    });
  }
}

