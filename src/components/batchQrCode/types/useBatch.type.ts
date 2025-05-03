import { DownloadFormat } from "@/components/qrCode/types";
import { Options } from "qr-code-styling";

/**
 * Represents a row of data from the uploaded CSV file
 */
export interface CSVRow {
  /** The data to be encoded in the QR code */
  data: string;
  /** The filename to use when saving the generated QR code */
  filename: string;
}

/**
 * Props for the BatchQRCode component
 */
export interface BatchQRCodeProps {
  /** Configuration options for QR code styling */
  config: Options;
  /** Output format for the downloaded QR code files */
  format: DownloadFormat;
}
