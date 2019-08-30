import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, bufferCount } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material";


import { PDFDocument, rgb, StandardFonts, RemovePageFromEmptyDocumentError } from 'pdf-lib';
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
  config = config;
  userSelections = {
    "name": "",
    "dob": "",
    "prescriber": "",
    "company": ""
  };
  boxes: object[] = [];
  current_pdf_url: string = "";

  drug_companies: string[] = Object.keys(config.companies);
  myControl = new FormControl();

  prescriberOptions: string[] = Object.keys(config.prescribers);
  filteredPrescriberOptions: Observable<string[]>;

  infoForm = new FormBuilder().group({ 'patient-name': '', 'patient-dob': '', 'prescriber': '', 'company': '' });
  snackBar: MatSnackBar;


  updateUserSelection(key, value) {
    this.userSelections[key] = value;
  }

  updateCompany(company: string) {
    this.userSelections['company'] = company;
    this.config.companies[company].boxes.forEach((box) => {
      box.value = this.config.defaults[box.attribute];
      this.boxes.push(box);
    })
  }

  updateBoxValue(box, value) {
    box.value = value;
  }

  updateAttribute(boxes, attribute, value) {
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].attribute === attribute) {
        boxes[i].value = value;
      }
    }
  }

  constructor(private _snackBar: MatSnackBar) { }

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

  clickGenerateButton() {

    if (!(this.userSelections.company in config.companies)) {
      return;
    }

    this.boxes = [];
    this.config.companies[this.userSelections.company].boxes.forEach((box) => {
      box.value = this.config.defaults[box.attribute];
      this.boxes.push(box);
    })


    let patient = this.userSelections.name;
    let dob = this.userSelections.dob;
    let prescriber = this.userSelections.prescriber;

    let splt = patient.split(' ');
    if (splt.length >= 2) {
      this.updateAttribute(this.boxes, "patient.name", patient);
      this.updateAttribute(this.boxes, "patient.first", splt[0]);
      this.updateAttribute(this.boxes, "patient.last", splt[1]);
    }

    splt = dob.split('/');
    if (splt.length >= 3) {
      this.updateAttribute(this.boxes, "patient.dob.full", dob);
      this.updateAttribute(this.boxes, "patient.dob.month", splt[0]);
      this.updateAttribute(this.boxes, "patient.dob.day", splt[1]);
      this.updateAttribute(this.boxes, "patient.dob.year", splt[2]);
    }

    if (prescriber in config.prescribers) {
      let p = config.prescribers[prescriber];
      var first, last, type;
      [first, last, type] = prescriber.split(" ");
      this.updateAttribute(this.boxes, "prescriber.name", prescriber);
      this.updateAttribute(this.boxes, "prescriber.first", first);
      this.updateAttribute(this.boxes, "prescriber.last", last);
      this.updateAttribute(this.boxes, "prescriber.type", type);
      this.updateAttribute(this.boxes, "prescriber.DEA", p.DEA);
      this.updateAttribute(this.boxes, "prescriber.SLN", p.SLN);
      this.updateAttribute(this.boxes, "prescriber.NPI", p.NPI);
    }

    this.current_pdf_url = this.config.companies[this.userSelections.company].pdf;

    // Push something to force an update of the options input boxes
    this.boxes.push({
      "attribute": "placeholder",
      "value": "",
      "page": 0,
      "x": 0,
      "y": 0,
      "size": 0
    });

    fillPDF(this.current_pdf_url, this.boxes);

    // Display the snack bar telling us we have some missing parts of the field
    // this._snackBar.open(`Don't forget to fill in: ${config.companies[config.company].missing.join(", ")}`, "OK", {duration: 0});
  }
  clickUpdateFromOptions() {
    fillPDF(this.current_pdf_url, this.boxes);
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

async function getPDF(url: string) {
  const pdfBuffer = await fetch(url).then((res) => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBuffer)
  return pdfDoc
}

async function fillPDF(pdf_url: string, boxes) {
  let pdf = await getPDF(pdf_url);
  pdf.registerFontkit(fontkit);
  if (fontBytes == undefined) {
    fontBytes = await getFontBytes();
  }
  const font = await pdf.embedFont(fontBytes);
  const pages = pdf.getPages();
  boxes.forEach(box => {
    console.log(box);
    let text = box.value;
    if (box.uppercase) {
      text = text.toUpperCase();
    }
    if (box.monospace) {
      var i = 0;
      for (i = 0; i < text.length; i++) {
        pages[box.page].drawText(text[i], {
          x: box.x + (i * box.gap),
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