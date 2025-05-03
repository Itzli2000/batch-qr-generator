import { QRCodeConfig } from ".";
import QRCodeStyling from "qr-code-styling";

/** Interface defining the return value of the useQrCode hook */
export interface UseQrCodeReturn {
  /** Reference to the file input element used for uploading QR code logo images */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  /** Reference to the div element where the QR code will be rendered */
  ref: React.RefObject<HTMLDivElement | null>;
  /** Current QR code configuration state */
  config: QRCodeConfig;
  /** The QR code instance */
  qrCode: QRCodeStyling | null;
  /** Handler for updating QR code config values when form inputs change
   * @param e - Change event from input or select element
   * @param field - Top level config field to update
   * @param subField - Optional nested config field to update
   */
  handleConfigChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
    subField?: string
  ) => void;
  /** Handler for processing uploaded logo images
   * @param e - Change event from file input element
   */
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Handler for removing the current logo image */
  handleRemoveImage: () => void;
  /** State setter function for updating the entire QR code config */
  setConfig: React.Dispatch<React.SetStateAction<QRCodeConfig>>;
}
