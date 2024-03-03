import React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import PptxGenJS from 'pptxgenjs';
import { Presentation } from 'react-pptx';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;


const BoundingBox = ({ file }) => {
  const [text, setText] = React.useState('Editable Text');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleDownload = async () => {
    const updatedFileContent = await getUpdatedFileContent(file, text);
    const blob = new Blob([updatedFileContent], { type: file.type });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_file' + getFileExtension(file.name);
    a.click();
  };

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  const getUpdatedFileContent = async (file, newText) => {
    if (file.type === 'application/pdf') {
      // For PDFs
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const firstPage = pdfDoc.getPages()[0];
  
      // Add text to the first page
      const { width, height } = firstPage.getSize();
      const fontSize = 12;
      firstPage.drawText(newText, { x: width- 50, y: height - 50, font: await pdfDoc.embedFont('Helvetica'), fontSize });
  
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      return new Uint8Array(modifiedPdfBytes);
    } else if (file.type === 'application/vnd.ms-powerpoint') {
      // For PPTs using pptxgenjs
      const pptx = new PptxGenJS();
      const slide = pptx.addSlide();
      
      // Add text to the slide
      slide.addText(newText, { x: 1, y: 1, font_size: 12 });
  
      // Save the modified PPT
      const modifiedPptBlob = await pptx.writeFile();
      const modifiedPptBytes = await modifiedPptBlob.arrayBuffer();
  
      return new Uint8Array(modifiedPptBytes);
    } else {
      // Unsupported file type
      throw new Error('Unsupported file type');
    }
  };

  return (
    <div>
      {file.type === 'application/pdf' ? (
        <Document file={file}>
          <Page pageNumber={1} />
        </Document>
      ) : file.type === 'application/vnd.ms-powerpoint' ? (
        <Presentation file={file} />
      ) : (
        <div style={{ position: 'relative', border: '2px solid #007BFF', margin: '10px', padding: '10px' }}>
          <img src={URL.createObjectURL(file)} alt="Image" style={{ width: '100%', height: 'auto' }} />
          <textarea
            value={text}
            onChange={handleTextChange}
            style={{
              width: '80%',
              resize: 'none',
              border: '1px solid #007BFF',
              borderRadius: '5px',
              padding: '5px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}
       <button onClick={handleDownload}>Download Updated File</button>
    </div>
  );
};

export default BoundingBox;