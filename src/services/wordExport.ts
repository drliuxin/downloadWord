import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export async function exportToWord(content: string, title: string = "Document") {
  // Simple parsing: split by double newlines for paragraphs
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
            // Check if it looks like a heading (e.g., starts with # or is short and bold-ish)
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
                  size: 24, // 12pt
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
