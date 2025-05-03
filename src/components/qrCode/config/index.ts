import { TypeNumber } from "qr-code-styling";
import { QRCodeConfig } from "../types";

export const INITIAL_CONFIG: QRCodeConfig = {
  width: 500,
  height: 500,
  data: "https://ixiptla-git-develop-ariel-itzli-molina-snchezs-projects.vercel.app?_vercel_share=C0dsXQEoYrjQOZJh0DpaR0lOBBtd7foS",
  margin: 5,
  qrOptions: {
    typeNumber: 0 as TypeNumber,
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
    crossOrigin: "anonymous",
  },
  dotsOptions: {
    color: "#a35a32",
    type: "rounded",
  },
  backgroundOptions: {
    color: "#f9f6f1",
  },
  cornersSquareOptions: {
    color: "#a35a32",
    type: "extra-rounded",
  },
  cornersDotOptions: {
    color: "#a35a32",
    type: "dot",
  },
};
