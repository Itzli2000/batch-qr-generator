import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import React, { useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import type { DownloadFormat } from "../qrCode/types";
import type { Options } from "qr-code-styling";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(header => header.trim());
      
      const dataIndex = headers.findIndex(h => h.toLowerCase() === 'data');
      const filenameIndex = headers.findIndex(h => h.toLowerCase() === 'filename');

      if (dataIndex === -1 || filenameIndex === -1) {
        alert('CSV must contain "data" and "filename" columns');
        return;
      }

      const parsedData = rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        return {
          data: values[dataIndex],
          filename: values[filenameIndex]
        };
      }).filter(row => row.data && row.filename);

      setCsvData(parsedData);
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

      {csvData.length > 0 && (
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
      )}
    </div>
  );
};

export default BatchQRCode; 