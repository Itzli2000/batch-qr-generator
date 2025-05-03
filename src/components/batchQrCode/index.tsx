import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import useBatch from "./hooks/useBatch";
import { BatchQRCodeProps } from "./types";

const BatchQRCode = ({ config, format }: BatchQRCodeProps) => {
  const {
    csvData,
    isProcessing,
    error,
    progress,
    fileInputRef,
    handleCSVUpload,
    handleBatchDownload,
  } = useBatch({ config, format });

  return (
    <div className="flex flex-col gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">
        Batch QR Code Generator
      </h2>

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
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-500 text-center">
                  Processing... {Math.round(progress)}%
                </p>
              </div>
            )}
            <Button
              onClick={handleBatchDownload}
              disabled={isProcessing}
              className="w-full"
            >
              <Download className="size-4 mr-2" />
              {isProcessing ? "Processing..." : "Download ZIP"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchQRCode;
