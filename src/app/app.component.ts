import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatSnackBar } from "@angular/material";


import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
var fontBytes = undefined;

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
  snackBar: MatSnackBar;

  constructor(private _snackBar: MatSnackBar) {}

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
      config.patient.name = patient;
      config.patient.first = splt[0];
      config.patient.last = splt[1];
    }

    splt = dob.split('/');
    if(splt.length >= 3) {
      config.patient.dob.full = dob;
      config.patient.dob.month = splt[0];
      config.patient.dob.day = splt[1];
      config.patient.dob.year = splt[2];
    }
    if(prescriber in config.prescribers) {
      config.prescriber = config.prescribers[prescriber]; // This contains the DEA, SLN, and NPI numbers
      var first, last, type;
      [first, last, type] = prescriber.split(" ");
      config.prescriber.first = first;
      config.prescriber.last = last;
      config.prescriber.type = type;
      config.prescriber.name = `${first} ${last}, ${type}`;
    }
    if(company in config.companies) {
      config.company = company;
    }
    fillPDF(config);

    // Display the snack bar telling us we have some missing parts of the field
    this._snackBar.open(`Don't forget to fill in: ${config.companies[config.company].missing.join(", ")}`, "OK", {duration: 0});
  }
}

function renderInIframe(pdfBytes) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    let iframe: any;
    iframe = document.getElementById('iframe');
    iframe.src = blobUrl;
}

async function getFontBytes() {
  var res = await fetch("assets/Consolas.ttf")
  return await res.arrayBuffer();
}

async function getPDF(url) {
    const pdfBuffer = await fetch(url).then((res) => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    return pdfDoc
}

async function fillPDF(options) {
  let pdf = await getPDF(options.companies[options.company].pdf);
  pdf.registerFontkit(fontkit);
  if(fontBytes == undefined) {
    fontBytes = await getFontBytes();
  }
  const font = await pdf.embedFont(fontBytes);
  const pages = pdf.getPages();
  // function to get nested keys
  const reducer = (accumulator, currentValue) => accumulator[currentValue];
  options.companies[options.company].boxes.forEach(box => {
    console.log(box);
    let text = box.attribute.split(".").reduce(reducer, options);
    if(box.uppercase) {
      text = text.toUpperCase();
    }
    if(box.monospace) {
      var i = 0;
      for(i = 0;i < text.length;i++) {
        pages[box.page].drawText(text[i], {
            x: box.x + (i*box.gap),
            y: box.y,
            size: box.size,
            font: font
        })
      }
    }
    else {
      pages[box.page].drawText(text, {
          x: box.x,
          y: box.y,
          size: box.size,
          font: font
      });
    }
  });
  let pdfBytes = await pdf.save()
  renderInIframe(pdfBytes)
} 