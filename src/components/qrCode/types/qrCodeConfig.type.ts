import { Options } from "qr-code-styling";

/**
 * Configuration options for the QR code generator.
 * Extends the base Options type from qr-code-styling library.
 * Includes settings for:
 * - Dimensions (width/height)
 * - Data content
 * - Margins
 * - QR code options (type, mode, error correction)
 * - Image/logo options
 * - Dot styling
 * - Background styling
 * - Corner styling
 */
export type QRCodeConfig = Options;