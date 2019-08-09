import { NgModule } from '@angular/core';
import { } from '@angular/material/autocomplete';
import { MatSnackBarModule, MatListModule, MatTreeModule, MatButtonModule, MatSelectModule, MatSidenavModule, MatDividerModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatTabsModule, MatSnackBar } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'


@NgModule({
    imports: [
        MatSnackBarModule,
        MatListModule,
        MatTreeModule,
        MatSidenavModule,
        MatAutocompleteModule, 
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        MatDividerModule,
        MatSelectModule,
        MatButtonModule,
    ],
    exports: [
        MatSnackBarModule,
        MatListModule,
        MatTreeModule,
        MatSidenavModule,
        MatAutocompleteModule, 
        MatInputModule, 
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        MatDividerModule,
        MatSelectModule,
        MatButtonModule,
    ]
})
export class MyMaterialModule {}