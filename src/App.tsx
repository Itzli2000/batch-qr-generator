import QRCodeGenerator from "./components/qrCode";

function App() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator & Batch Processor</h1>
      <div className="space-y-8">
          <QRCodeGenerator />
      </div>
    </div>
  );
}

export default App;
