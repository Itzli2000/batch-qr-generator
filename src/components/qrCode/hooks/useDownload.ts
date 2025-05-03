import { useCallback, useState } from "react";
import { UseDownloadProps, DownloadFormat } from "../types";

const useDownload = ({ config, qrCode }: UseDownloadProps) => {
  const [format, setFormat] = useState<DownloadFormat>("svg");

  const handleDownload = useCallback(async () => {
    if (!qrCode) return;
    
    const filename = `qr-code-${config.data?.substring(0, 20) || "download"}`;
    
    try {
      await qrCode.download({
        name: filename,
        extension: format
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  }, [qrCode, config.data, format]);

  return { handleDownload, format, setFormat };
};

export default useDownload;
