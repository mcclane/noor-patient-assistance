import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import config from '../assets/config.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'Patient Assistance Form Filler';
  drug_companies: string[] = Object.keys(config.companies);
  myControl = new FormControl();
  prescriberOptions: string[] = Object.keys(config.prescribers);
  filteredPrescriberOptions: Observable<string[]>;
  infoForm = new FormBuilder().group({'patient-name': '', 'patient-dob': '', 'prescriber':'', 'company':''});
  configOptions: string[] = Object.keys(config);
  config = config;

  ngOnInit() {
    this.filteredPrescriberOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.prescriberOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  clickGenerateButton(patient, dob, prescriber, company) {

    // Reset the values in the dictionary to defaults, which are blank. This isn't great but it works
    config.patient = config.default.patient;
    config.prescriber = config.default.prescriber;
    config.company = config.default.company;

    let splt = patient.split(' ');
    if(splt.length >= 2) {
      config.patient.first = splt[0];
      config.patient.last = splt[1];
    }

    splt = dob.split('/');
    if(splt.length >= 3) {
      config.patient.dob.month = splt[0];
      config.patient.dob.day = splt[1];
      config.patient.dob.year = splt[2];
    }
    if(prescriber in config.prescribers) {
      config.prescriber = config.prescribers[prescriber];
    }
    if(company in config.companies) {
      config.company = company;
    }
    fillPDF(config);
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

async function fillPDF(options) {
  let pdf = await getPDF(options.companies[options.company].pdf);
  const pages = pdf.getPages();
  // function to get nested keys
  const reducer = (accumulator, currentValue) => accumulator[currentValue];
  options.companies[options.company].boxes.forEach(box => {
    let text = box.attribute.split(".").reduce(reducer, options);
      pages[box.page].drawText(text, {
          x: box.x,
          y: box.y,
          size: box.size
      })
  });
  let pdfBytes = await pdf.save()
  renderInIframe(pdfBytes)
} 