import { Injectable, signal } from "@angular/core";
import { Board, Task, Column } from "./task.type";

export type ModalType = 'addTask' | 'deleteTask' | 'viewTask' | 'addBoard' | 'editBoard' | 'deleteBoard'| 'editTask'|'taskDetails';
export type ModalData = Board | Task | Column;

export interface ModalConfig {
    title: string;
    message: string;
    name: ModalType;
    cancelButtonText?: string;
    confirmButtonText?: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    isOpen = signal<boolean>(false);
    modalConfig = signal<ModalConfig | null>(null);

    constructor() {}

    open(config: ModalConfig): void {
        this.modalConfig.set(config);
        this.isOpen.set(true);
    }

    close(): void {
        this.isOpen.set(false);
        this.modalConfig.set(null);
    }
}