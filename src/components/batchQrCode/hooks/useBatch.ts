import JSZip from 'jszip';
import QRCodeStyling from 'qr-code-styling';
import React, { useRef, useState } from 'react'
import { BatchQRCodeProps, CSVRow } from '../types';

const useBatch = ({ config, format }: BatchQRCodeProps) => {
    const [csvData, setCsvData] = useState<CSVRow[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      setCsvData([]);
      setError(null);
      setIsProcessing(false);
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        
        if (rows.length < 2) {
          setError('CSV file must contain at least a header row and one data row');
          return;
        }
  
        const headers = rows[0].split(',').map(header => header.trim());
        
        const dataIndex = headers.findIndex(h => h.toLowerCase() === 'data');
        const filenameIndex = headers.findIndex(h => h.toLowerCase() === 'filename');
  
        if (dataIndex === -1 || filenameIndex === -1) {
          setError('CSV must contain "data" and "filename" columns');
          return;
        }
  
        const parsedData = rows.slice(1).map((row, index) => {
          const values = row.split(',').map(value => value.trim());
          if (values.length !== headers.length) {
            setError(`Row ${index + 2} has incorrect number of columns`);
            return null;
          }
          return {
            data: values[dataIndex],
            filename: values[filenameIndex]
          };
        }).filter((row): row is CSVRow => 
          row !== null && 
          typeof row.data === 'string' && 
          typeof row.filename === 'string' && 
          row.data.length > 0 && 
          row.filename.length > 0
        );
  
        if (parsedData.length === 0) {
          setError('No valid data found in the CSV file');
          return;
        }
  
        setCsvData(parsedData);
      };
      reader.onerror = () => {
        setError('Error reading the CSV file');
      };
      reader.readAsText(file);
    };
  
    const generateQRBlob = async (row: CSVRow): Promise<Blob | null> => {
      const qrCode = new QRCodeStyling({
        ...config,
        data: row.data,
      });
  
      const blob = await qrCode.getRawData(format);
      if (!blob) return null;
  
      return blob instanceof Blob ? blob : new Blob([blob]);
    };
  
    const handleBatchDownload = async () => {
      if (csvData.length === 0) return;
      
      setIsProcessing(true);
      setProgress(0);
      try {
        const zip = new JSZip();
        
        for (let i = 0; i < csvData.length; i++) {
          const row = csvData[i];
          const blob = await generateQRBlob(row);
          if (blob) {
            zip.file(`${row.filename}.${format}`, blob);
          }
          setProgress(((i + 1) / csvData.length) * 100);
        }
  
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qr-codes.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating QR codes:', error);
        setError('Error generating QR codes. Please try again.');
      } finally {
        setIsProcessing(false);
        setProgress(0);
      }
    };
    
  return {
    csvData,
    isProcessing,
    error,
    progress,
    fileInputRef,
    handleCSVUpload,
    handleBatchDownload,
  }
}

export default useBatch
