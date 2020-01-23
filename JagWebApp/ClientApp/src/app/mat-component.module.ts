import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
    exports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatExpansionModule,
        MatTabsModule,
        MatSelectModule,
    ]
})

export class MatComponentsModule { }
