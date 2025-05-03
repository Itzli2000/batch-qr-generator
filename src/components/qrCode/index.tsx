import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download } from "lucide-react";
import { DotType } from "qr-code-styling";
import React from "react";
import useDownload from "./hooks/useDownload";
import useQrCode from "./hooks/useQrCode";
import type { DownloadFormat } from "./types";
import BatchQRCode from "../batchQrCode";

const QRCodeGenerator: React.FC = () => {
  const {
    ref,
    fileInputRef,
    config,
    qrCode,
    handleConfigChange,
    handleImageUpload,
    handleRemoveImage,
    setConfig,
  } = useQrCode();

  const { handleDownload, format, setFormat } = useDownload({ config, qrCode });

  return (
    <div className="flex flex-col gap-8 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        <div className="flex flex-col gap-4 flex-1 bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">QR Code Generator</h2>
          <div className="flex flex-col gap-6">
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="data" className="text-sm font-medium text-gray-700">Data</Label>
              <Input
                id="data"
                type="text"
                value={config.data}
                onChange={(e) => handleConfigChange(e, "data")}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="width" className="text-sm font-medium text-gray-700">Width</Label>
              <Input
                id="width"
                type="number"
                value={config.width}
                onChange={(e) => handleConfigChange(e, "width")}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height</Label>
              <Input
                id="height"
                type="number"
                value={config.height}
                onChange={(e) => handleConfigChange(e, "height")}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="logo" className="text-sm font-medium text-gray-700">Logo/Image</Label>
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
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="logoSize" className="text-sm font-medium text-gray-700">Logo Size (%)</Label>
                <Slider
                  id="logoSize"
                  min={10}
                  max={100}
                  step={1}
                  value={[(config.imageOptions?.imageSize || 0.4) * 100]}
                  onValueChange={(value) => {
                    const size = value[0] / 100;
                    setConfig((prevConfig) => ({
                      ...prevConfig,
                      imageOptions: {
                        ...prevConfig.imageOptions,
                        imageSize: size,
                      },
                    }));
                  }}
                />
              </div>
            )}

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="dotColor" className="text-sm font-medium text-gray-700">Dot Color</Label>
              <Input
                id="dotColor"
                type="color"
                value={config.dotsOptions?.color}
                onChange={(e) => handleConfigChange(e, "dotsOptions", "color")}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="bgColor" className="text-sm font-medium text-gray-700">Background Color</Label>
              <Input
                id="bgColor"
                type="color"
                value={config.backgroundOptions?.color}
                onChange={(e) =>
                  handleConfigChange(e, "backgroundOptions", "color")
                }
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="dotStyle" className="text-sm font-medium text-gray-700">Dot Style</Label>
              <Select
                value={config.dotsOptions?.type}
                onValueChange={(value: DotType) => {
                  setConfig((prevConfig) => ({
                    ...prevConfig,
                    dotsOptions: {
                      ...prevConfig.dotsOptions,
                      type: value,
                    },
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

        <div className="flex-1 flex items-start justify-center lg:sticky lg:top-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">Preview</h3>
              <div className="flex items-center gap-2">
                <Select
                  value={format}
                  onValueChange={(value: DownloadFormat) => setFormat(value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="svg">SVG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleDownload} size="sm">
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </div>
            <div ref={ref} className="flex justify-center items-center min-h-[300px]"></div>
          </div>
        </div>
      </div>

      <BatchQRCode config={config} format={format} />
    </div>
  );
};

export default QRCodeGenerator;
