import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import React, { useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import type { DownloadFormat } from "../qrCode/types";
import type { Options } from "qr-code-styling";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CSVRow {
  data: string;
  filename: string;
}

interface BatchQRCodeProps {
  config: Options;
  format: DownloadFormat;
}

const BatchQRCode: React.FC<BatchQRCodeProps> = ({ config, format }) => {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear all states when a new file is uploaded
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

  const generateAndDownloadQR = async (row: CSVRow) => {
    const qrCode = new QRCodeStyling({
      ...config,
      data: row.data,
    });

    const blob = await qrCode.getRawData(format);
    if (!blob) return;

    // Convert Buffer to Blob if needed
    const downloadBlob = blob instanceof Blob ? blob : new Blob([blob]);
    const url = URL.createObjectURL(downloadBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${row.filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBatchDownload = async () => {
    if (csvData.length === 0) return;
    
    setIsProcessing(true);
    try {
      for (const row of csvData) {
        await generateAndDownloadQR(row);
      }
    } catch (error) {
      console.error('Error generating QR codes:', error);
      alert('Error generating QR codes. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">Batch QR Code Generator</h2>
      
      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor="csvFile" className="text-sm font-medium text-gray-700">
          CSV File
        </Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="cursor-pointer"
          />
        </div>
        <p className="text-sm text-gray-500">
          CSV must contain "data" and "filename" columns
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {csvData.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Filename</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{row.data}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-700">
              Found {csvData.length} entries to process
            </p>
            <Button
              onClick={handleBatchDownload}
              disabled={isProcessing}
              className="w-full"
            >
              <Download className="size-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Generate All QR Codes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchQRCode; 