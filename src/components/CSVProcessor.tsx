import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CSVData {
  data: string;
  filename?: string;
  size?: number;
}

const FILE_EXTENSIONS = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'svg', label: 'SVG' },
] as const;

type FileExtension = typeof FILE_EXTENSIONS[number]['value'];

export default function CSVProcessor() {
  const [csvData, setCSVData] = useState<CSVData[]>([]);
  const [error, setError] = useState<string>('');
  const [fileExtension, setFileExtension] = useState<FileExtension>('png');
  const qrRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');

    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Validate that the CSV has the required 'data' column
        if (!results.meta.fields?.includes('data')) {
          setError('CSV file must contain a "data" column');
          return;
        }

        // Validate filenames don't have extensions
        const data = results.data as CSVData[];
        const invalidFilenames = data
          .filter(row => row.filename)
          .filter(row => row.filename?.includes('.'));

        if (invalidFilenames.length > 0) {
          setError('Filenames should not include extensions. Please remove them from the CSV.');
          return;
        }

        setCSVData(data);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const downloadQRCode = (data: string, filename: string) => {
    const canvas = document.createElement('canvas');
    const qrCanvas = qrRef.current?.querySelector('canvas');
    
    if (!qrCanvas) return;
    
    // Create a temporary canvas to handle the download
    canvas.width = qrCanvas.width;
    canvas.height = qrCanvas.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Draw the QR code onto our temporary canvas
    ctx.drawImage(qrCanvas, 0, 0);
    
    // Create the download link
    const link = document.createElement('a');
    link.download = `${filename}.${fileExtension}`;
    link.href = canvas.toDataURL(`image/${fileExtension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="csv-file">Upload CSV File</Label>
        <Input 
          id="csv-file" 
          type="file" 
          accept=".csv"
          onChange={handleFileUpload}
        />
      </div>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      {csvData.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Preview:</h3>
            <div className="flex items-center gap-2">
              <Label htmlFor="extension">File Extension:</Label>
              <Select
                value={fileExtension}
                onValueChange={(value: FileExtension) => setFileExtension(value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select extension" />
                </SelectTrigger>
                <SelectContent>
                  {FILE_EXTENSIONS.map(ext => (
                    <SelectItem key={ext.value} value={ext.value}>
                      {ext.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Data</th>
                  <th className="border border-gray-200 px-4 py-2">Filename</th>
                  <th className="border border-gray-200 px-4 py-2">Full Filename</th>
                  <th className="border border-gray-200 px-4 py-2">Size</th>
                  <th className="border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 px-4 py-2">{row.data}</td>
                    <td className="border border-gray-200 px-4 py-2">{row.filename}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {row.filename ? `${row.filename}.${fileExtension}` : `-`}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{row.size}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div ref={qrRef} className="hidden">
                      </div>
                      <Button 
                        onClick={() => downloadQRCode(
                          row.data, 
                          row.filename || `qr-code-${index + 1}`
                        )}
                      >
                        Download QR
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 