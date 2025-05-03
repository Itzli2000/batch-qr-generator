import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import { INITIAL_CONFIG } from "../config";
import { QRCodeConfig, UseQrCodeReturn } from "../types";

const useQrCode = (): UseQrCodeReturn => {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [config, setConfig] = useState<QRCodeConfig>(INITIAL_CONFIG);

  const ref = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!qrCode) {
      const qr = new QRCodeStyling(config);
      setQrCode(qr);
      if (ref.current) {
        qr.append(ref.current);
      }
    } else {
      qrCode.update(config);
    }
  }, [config, qrCode]);

  const handleConfigChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
    subField?: string
  ) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setConfig((prevConfig) => {
      if (subField) {
        return {
          ...prevConfig,
          [field]: {
            ...prevConfig[field as keyof QRCodeConfig],
            [subField]: value,
          },
        } as QRCodeConfig;
      }
      return {
        ...prevConfig,
        [field]: value,
      } as QRCodeConfig;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setConfig((prevConfig) => ({
          ...prevConfig,
          image: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      image: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    fileInputRef,
    ref,
    config,
    qrCode,
    handleConfigChange,
    handleImageUpload,
    handleRemoveImage,
    setConfig,
  };
};

export default useQrCode;
