import QRCodeStyling from "qr-code-styling";
import { QRCodeConfig } from "./qrCodeConfig.type";

/**
 * Valid file formats for downloading the QR code
 */
export type DownloadFormat = "svg" | "png" | "jpeg";

/**
 * Props for the useDownload hook
 * @interface UseDownloadProps
 * @property {QRCodeConfig} config - Configuration options for the QR code
 * @property {QRCodeStyling | null} qrCode - Instance of QRCodeStyling or null if not initialized
 */
export interface UseDownloadProps {
  config: QRCodeConfig;
  qrCode: QRCodeStyling | null;
}