import { QRCodeConfig } from ".";

export interface UseQrCodeReturn {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  ref: React.RefObject<HTMLDivElement | null>;
  config: QRCodeConfig;
  handleConfigChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
    subField?: string
  ) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  setConfig: React.Dispatch<React.SetStateAction<QRCodeConfig>>;
}
