import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

export async function exportToWord(content: string, title: string = "Document", templateFile?: File) {
  if (templateFile) {
    // Template-based export
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const contentArrayBuffer = e.target?.result as ArrayBuffer;
          const zip = new PizZip(contentArrayBuffer);
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          // Simple data mapping
          doc.setData({
            title: title,
            content: content,
            date: new Date().toLocaleDateString(),
          });

          doc.render();
          const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          saveAs(out, `${title.replace(/\s+/g, "_")}_Templated.docx`);
          resolve(true);
        } catch (error) {
          console.error("Template export failed:", error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(templateFile);
    });
  }

  // Programmatic export (Fallback)
  const lines = content.split(/\n\n+/);
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          ...lines.map(line => {
            if (line.startsWith("# ")) {
              return new Paragraph({
                text: line.replace("# ", ""),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              });
            }
            return new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            });
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, "_")}.docx`);
}

// Utility to create a sample template for the user to download and test
export async function createSampleTemplate() {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "{title}",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: "Generated on: {date}",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "{content}",
            spacing: { before: 200 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "WordFlow_Sample_Template.docx");
}
