
import axios from 'axios';
import pdf from 'pdf-parse';
import { Buffer } from 'buffer';

const getPdfAndConvert = async (req, res) => {
    try {
      const { url, base64, words } = req.body;
  
      if (!url && !base64) {
        return res.status(400).json({ error: 'URL or base64 parameter is required' });
      }
  
      let pdfData;
  
      if (url) {
        pdfData = await fetchPdfData(url);
      } else if (base64) {
        pdfData = decodeBase64(base64);
      }
  
      const text = await extractPdfText(pdfData);
      const output = filterPdfText(text, words);
  
      res.json(output);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
  async function fetchPdfData(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  }
  
  function decodeBase64(base64) {
    return Buffer.from(base64, 'base64');
  }
  
  async function extractPdfText(pdfData) {
    const data = await pdf(pdfData);
    return data.text.split('\n').map(line => line.trim()).filter(line => line !== "");
  }
  
  function filterPdfText(text, words) {
    if (Array.isArray(words) && words.length > 0) {
      return text.filter(line => words.some(word => line.includes(word)));
    } else {
      return text.map(line => [line]);
    }
  }
  
  export default getPdfAndConvert;