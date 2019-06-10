import { Component, OnInit } from '@angular/core';
import {
  PDFJSStatic,
  PDFPageViewport,
  PDFRenderTask,
  PDFDocumentProxy,
  PDFPageProxy,
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

  async ngOnInit(): Promise<void> {
    PDFJS.disableWorker = true;
    try {
      await this.showPDF();
    } catch (error) {
      this.errorMessage = error;
      console.log(error);
    }
  }

  private async showPDF(): Promise<void> {
    const page: PDFPageProxy = await this.getPage();
    const viewport: PDFPageViewport = page.getViewport(1);
    const canvas: HTMLCanvasElement = this.getCanvas(viewport);
    await this.createRenderTask(page, canvas, viewport);
    this.setDisplayValues(canvas);
  }

  private async getPage(): Promise<PDFPageProxy> {
    const pdf: PDFDocumentProxy = await PDFJS.getDocument('./assets/test.pdf');
    return await pdf.getPage(1);
  }

  private getCanvas(viewport: PDFPageViewport): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    return canvas;
  }

  private createRenderTask(
    page: PDFPageProxy,
    canvas: HTMLCanvasElement,
    viewport: PDFPageViewport
  ): PDFRenderTask {
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    const task: PDFRenderTask = page.render({
      canvasContext: context,
      viewport: viewport,
    });
    return task;
  }

  private setDisplayValues(canvas: HTMLCanvasElement): void {
    this.imgWidth = canvas.width;
    this.imgHeight = canvas.height;
    this.imgSrc = canvas.toDataURL();
  }
}
