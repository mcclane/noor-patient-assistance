import { NgModule } from '@angular/core';
import { } from '@angular/material/autocomplete';
import { MatListModule, MatTreeModule, MatButtonModule, MatSelectModule, MatSidenavModule, MatDividerModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'


@NgModule({
    imports: [
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