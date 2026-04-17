import { QRCodeSVG } from 'qrcode.react'

interface QRCodeTransferProps {
  configBase64: string;
  onImport: (encoded: string) => void;
}

export function QRCodeTransfer({ configBase64, onImport }: QRCodeTransferProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <label className="block label-uppercase text-text-tertiary mb-3">Share config</label>
        <div className="inline-block p-3 bg-bg-card rounded-[12px] border border-border-oat shadow-clay">
          <QRCodeSVG value={configBase64} size={120} />
        </div>
        <p className="text-[11px] text-lemon-700 mt-2.5 font-clay-ui">
          Contains your API keys — share carefully.
        </p>
      </div>
      <div>
        <label className="block label-uppercase text-text-tertiary mb-2">Import config</label>
        <input
          type="text"
          placeholder="Paste Base64 string..."
          onChange={e => {
            if (e.target.value.length > 10) onImport(e.target.value)
          }}
          className="w-full bg-bg-card rounded-[4px] px-3 py-2 text-sm text-text-primary border border-border-input focus:outline focus:outline-2 focus:outline-[rgb(20,110,245)] transition-colors placeholder:text-text-tertiary"
        />
      </div>
    </div>
  )
}
