import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';

const stripDataUrlPrefix = (dataUrl) => dataUrl.replace(/^data:image\/png;base64,/, '');

const configureCloudinaryInService = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

const readPdfBytes = async ({ sourcePath, sourceUrl, publicId }) => {
  if (sourceUrl) {
    try {
      console.log("📥 Cloudinary API authentication initiating...");
      configureCloudinaryInService();

      let finalPublicId = publicId;

      // 🟢 FIX 1: RAW assets (PDF) ke liye hamesha extension (.pdf) ensure karein
      // Agar database se aane wali publicId mein extension nahi hai, toh sourceUrl se exact filename nikalenge
      if (finalPublicId && !finalPublicId.endsWith('.pdf')) {
        const urlParts = sourceUrl.split('/upload/');
        if (urlParts.length >= 2) {
          // Version number (e.g., v1781217393/) ko hatakar extension ke sath publicId nikalega
          finalPublicId = urlParts[1].replace(/^v\d+\//, '');
        }
      }

      // Fallback: Agar controller se publicId aayi hi nahi
      if (!finalPublicId) {
        const match = sourceUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
        if (match) {
          finalPublicId = match[1]; // pure extension ke sath string pick karega
        }
      }

      console.log("🔑 Fetching using verified Public ID:", finalPublicId);

      // 🟢 FIX 2: Explicitly type 'upload' specify kiya strict private permission bypass ke liye
      const authenticatedUrl = cloudinary.url(finalPublicId, {
        resource_type: 'raw',
        type: 'upload',
        sign_url: true, 
        secure: true
      });

      console.log("🔒 Secured URL Generated Successfully:", authenticatedUrl);
      
      const response = await axios.get(authenticatedUrl, {
        responseType: 'arraybuffer'
      });
      
      console.log("✅ PDF Download status 200 OK! Size:", response.data.byteLength);
      return new Uint8Array(response.data);
    } catch (error) {
      console.error("❌ CLOUDINARY AUTH FETCH FAILED:", error.message);
      
      // 🟢 FALLBACK: Agar dynamic token validation kisi wajah se fail ho, toh directly https source fallback try karein
      try {
        console.log("🔄 Attempting Fallback Direct HTTPS Stream...");
        const secureFallbackUrl = sourceUrl.replace('http://', 'https://');
        const response = await axios.get(secureFallbackUrl, { responseType: 'arraybuffer' });
        return new Uint8Array(response.data);
      } catch (fallbackError) {
        throw new Error(`Cloudinary secure fetch and fallback both failed: ${error.message}`);
      }
    }
  }
  
  const localFile = await fs.readFile(sourcePath);
  return new Uint8Array(localFile);
};

export const signPdf = async ({ sourcePath, sourceUrl, publicId, signatureDataUrl, outputDir, position = {} }) => {
  const pdfBytes = await readPdfBytes({ sourcePath, sourceUrl, publicId });
  
  if (!pdfBytes || pdfBytes.length === 0) {
    throw new Error("Corrupted PDF data: Buffer is empty.");
  }

  console.log("📝 Loading PDF into pdf-lib...");
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  
  const pages = pdfDoc.getPages();
  const pageIndex = Math.min(Math.max(Number(position.page || 0), 0), pages.length - 1);
  const page = pages[pageIndex];
  const { width } = page.getSize();

  console.log("✍️ Embedding signature image...");
  const signatureImage = await pdfDoc.embedPng(Buffer.from(stripDataUrlPrefix(signatureDataUrl), 'base64'));
  const signatureWidth = Number(position.width || 180);
  const signatureHeight = Number(position.height || 70);
  const x = Number(position.x ?? width - signatureWidth - 72);
  const y = Number(position.y ?? 72);

  page.drawImage(signatureImage, {
    x,
    y,
    width: signatureWidth,
    height: signatureHeight
  });

  await fs.mkdir(outputDir, { recursive: true });
  const fileName = `signed-${Date.now()}.pdf`;
  const outputPath = path.join(outputDir, fileName);
  
  console.log("💾 Saving signed PDF locally...");
  const savedBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, savedBytes);
  
  return { fileName, outputPath };
};