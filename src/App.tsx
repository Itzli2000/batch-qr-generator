import QRCodeGenerator from "./components/qrCode";
import CSVProcessor from "./components/CSVProcessor";

function App() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Single QR Code</h2>
          <QRCodeGenerator />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Bulk QR Code Generation</h2>
          <CSVProcessor />
        </div>
      </div>
    </div>
  );
}

export default App;
