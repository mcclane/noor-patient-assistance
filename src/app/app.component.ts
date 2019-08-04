import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import NoorInfo from '../assets/NoorInfo.json';
import Prescribers from '../assets/prescribers.json';
import AZAndMeFormat from '../assets/AZAndMeFormat.json';
const companies = {
  'AstraZeneca': AZAndMeFormat,
};

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'Patient Assistance Form Filler';
  myControl = new FormControl();
  drug_companies: string[] = ['AstraZeneca'];
  options: string[] = Object.keys(Prescribers);
  filteredOptions: Observable<string[]>;
  infoForm = new FormBuilder().group({'patient-name': '', 'patient-dob': '', 'prescriber':'', 'company':''});

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    console.log(NoorInfo);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  clickGenerateButton(patient, dob, prescriber, company) {
    let info = {}
    let splt = patient.split(' ');
    info['patient_first'] = splt[0];
    info['patient_last'] = splt[1];
    splt = dob.split('/');
    info['patient_dob_month'] = splt[0];
    info['patient_dob_day'] = splt[1];
    info['patient_dob_year'] = splt[2];

    let pdfInfo = {...info, ...Prescribers[prescriber], ...NoorInfo}
    console.log(pdfInfo);
    fillPDF("assets/azandme_application.pdf", pdfInfo, companies[company]);
  }
}

function renderInIframe(pdfBytes) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    let iframe: any;
    iframe = document.getElementById('iframe');
    iframe.src = blobUrl;
}

async function getPDF(url) {
    const pdfBuffer = await fetch(url).then((res) => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    return pdfDoc
}

async function fillPDF(url, info, boxes) {
    let pdf = await getPDF(url)
    const pages = pdf.getPages();
    boxes.forEach(box => {
        pages[box.page].drawText(info[box.attribute], {
            x: box.x,
            y: box.y,
            size: 12
        })
    })    
    let pdfBytes = await pdf.save()
    renderInIframe(pdfBytes)
}