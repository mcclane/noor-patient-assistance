import { NgModule } from '@angular/core';
import { } from '@angular/material/autocomplete';
import { MatCheckboxModule, MatSnackBarModule, MatListModule, MatTreeModule, MatButtonModule, MatSelectModule, MatSidenavModule, MatDividerModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatTabsModule, MatSnackBar } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'


@NgModule({
    imports: [
        MatCheckboxModule,
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
        MatCheckboxModule,
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