import { Component, OnInit } from '@angular/core';
import {
  PDFJSStatic,
  PDFPageViewport,
  PDFRenderTask,
  PDFDocumentProxy,
} from 'pdfjs-dist';

const PDFJS: PDFJSStatic = require('pdfjs-dist');

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/pdf.worker.min.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  imgSrc: string;
  imgWidth: number;
  imgHeight: number;
  errorMessage: string;

  ngOnInit(): void {
    PDFJS.disableWorker = true;
    PDFJS.getDocument('./assets/test.pdf').then(
      (pdf: PDFDocumentProxy) => {
        pdf.getPage(1).then(page => {
          const scale = 1;
          const viewport: PDFPageViewport = page.getViewport(scale);

          const canvas: HTMLCanvasElement = document.createElement('canvas');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const context: CanvasRenderingContext2D = canvas.getContext('2d');
          const task: PDFRenderTask = page.render({
            canvasContext: context,
            viewport: viewport,
          });
          task.then(() => {
            this.imgWidth = canvas.width;
            this.imgHeight = canvas.height;
            this.imgSrc = canvas.toDataURL();
          });
        });
      },
      error => {
        this.errorMessage = error;
        console.log(error);
      }
    );
  }
}
