import { NgModule } from '@angular/core';
import { } from '@angular/material/autocomplete';
import { MatButtonModule, MatSelectModule, MatSidenavModule, MatDividerModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'


@NgModule({
    imports: [
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