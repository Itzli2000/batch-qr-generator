import QRCodeGenerator from "./components/qrCode";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

function App() {
  return (
    <>
      <h1>Batch QR Generator</h1>
      <QRCodeGenerator />  
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="csv-file">CSV File</Label>
        <Input id="csv-file" type="file" accept=".csv" />
      </div>
      <Button>Generate QR</Button>
    </>
  );
}

export default App;
