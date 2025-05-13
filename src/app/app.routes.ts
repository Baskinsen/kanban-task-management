import { Routes } from '@angular/router';

export const routes: Routes = [ 
    {
        path: '',
        redirectTo: '/boards',
        pathMatch: 'full'
    },
    {
        path: 'boards',
        loadComponent: () => import('./board/board.component').then(m => m.BoardComponent),
    
    }
];
