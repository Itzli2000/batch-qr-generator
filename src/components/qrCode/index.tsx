import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, { Options, TypeNumber, DotType } from 'qr-code-styling';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QRCodeConfig = Options;

const QRCodeGenerator: React.FC = () => {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);


  const [config, setConfig] = useState<QRCodeConfig>({
    width: 300,
    height: 300,
    data: "https://example.com",
    margin: 5,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: "Byte",
      errorCorrectionLevel: "Q"
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 0,
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      color: "#a35a32", // --color-main
      type: "rounded"
    },
    backgroundOptions: {
      color: "#f9f6f1", // --color-quaternary
    },
    cornersSquareOptions: {
      color: "#a35a32", // --color-main
      type: "extra-rounded"
    },
    cornersDotOptions: {
      color: "#a35a32", // --color-main
      type: "dot"
    }
  });

  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [config]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string, subField?: string) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setConfig(prevConfig => {
      if (subField) {
        return {
          ...prevConfig,
          [field]: {
            ...prevConfig[field as keyof QRCodeConfig],
            [subField]: value
          }
        } as QRCodeConfig;
      }
      return {
        ...prevConfig,
        [field]: value
      } as QRCodeConfig;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setConfig(prevConfig => ({
          ...prevConfig,
          image: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      delete newConfig.image;
      return newConfig;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">QR Code Generator</h2>
        <div className="flex flex-col gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="text"
              value={config.data}
              onChange={(e) => handleConfigChange(e, 'data')}
            />
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={config.width}
              onChange={(e) => handleConfigChange(e, 'width')}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={config.height}
              onChange={(e) => handleConfigChange(e, 'height')}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="logo">Logo/Image</Label>
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              {config.image && (
                <Button
                  onClick={handleRemoveImage}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {config.image && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="logoSize">Logo Size (%)</Label>
              <Slider
                id="logoSize"
                min={10}
                max={100}
                step={1}
                value={[(config.imageOptions?.imageSize || 0.4) * 100]}
                onValueChange={(value) => {
                  const size = value[0] / 100;
                  setConfig(prevConfig => ({
                    ...prevConfig,
                    imageOptions: {
                      ...prevConfig.imageOptions,
                      imageSize: size
                    }
                  }));
                }}
              />
            </div>
          )}

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="dotColor">Dot Color</Label>
            <Input
              id="dotColor"
              type="color"
              value={config.dotsOptions?.color}
              onChange={(e) => handleConfigChange(e, 'dotsOptions', 'color')}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="bgColor">Background Color</Label>
            <Input
              id="bgColor"
              type="color"
              value={config.backgroundOptions?.color}
              onChange={(e) => handleConfigChange(e, 'backgroundOptions', 'color')}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="dotStyle">Dot Style</Label>
            <Select
              value={config.dotsOptions?.type}
              onValueChange={(value: DotType) => {
                setConfig(prevConfig => ({
                  ...prevConfig,
                  dotsOptions: {
                    ...prevConfig.dotsOptions,
                    type: value
                  }
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a dot style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="classy">Classy</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div ref={ref} className="mt-4 flex justify-center"></div>
    </div>
  );
};

export default QRCodeGenerator; 