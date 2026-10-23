import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PDF_PAGES = 10;

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Could not process the PDF page."));
      }
    }, "image/png");
  });
}

export async function extractTextFromImage(file, onProgress) {
  if (!file) {
    throw new Error("Please select a document.");
  }

  if (!IMAGE_TYPES.includes(file.type) && file.type !== "application/pdf") {
    throw new Error("Choose a JPG, PNG, WEBP, or PDF document.");
  }

  let worker;
  let loadingTask;

  try {
    worker = await createWorker("eng");

    // Directly recognize text in image documents.
    if (IMAGE_TYPES.includes(file.type)) {
      const result = await worker.recognize(file);
      onProgress?.(100);
      return result.data.text.trim();
    }

    // Load the PDF and retain its loading task for cleanup.
    loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
    });

    const pdf = await loadingTask.promise;

    if (pdf.numPages > MAX_PDF_PAGES) {
      throw new Error(
        `This PDF has ${pdf.numPages} pages. Please use a PDF with ${MAX_PDF_PAGES} pages or fewer.`,
      );
    }

    const extractedPages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not prepare the PDF page for OCR.");
      }

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      try {
        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const imageBlob = await canvasToBlob(canvas);
        const result = await worker.recognize(imageBlob);

        extractedPages.push(
          `--- Page ${pageNumber} ---\n${result.data.text.trim()}`,
        );

        onProgress?.(Math.round((pageNumber / pdf.numPages) * 100));
      } finally {
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
      }
    }

    return extractedPages.join("\n\n").trim();
  } finally {
    // Destroy the PDF loading task, not pdf.destroy().
    if (loadingTask && typeof loadingTask.destroy === "function") {
      await loadingTask.destroy();
    }

    if (worker) {
      await worker.terminate();
    }
  }
}
