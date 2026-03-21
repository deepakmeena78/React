// src/components/editor/Header.jsx
import { IBtn, Btn } from '../ui';
import { IC } from '../../constants/icons';

export default function Header({
  fileName, hasImage, isCropping, isSaving,
  canUndo, canRedo, undo, redo,
  setZoom,
  showBefore, setShowBefore,
  showGrid, setShowGrid,
  handleSave, openFile,
  isModified,
}) {
  return (
    <header className="pc-header">

      {/* ── Left: Brand + filename ── */}
      <div className="pc-header__col">
        <div className="pc-brand">
          <div className="pc-brand__icon">✦</div>
          <span className="pc-brand__name">PixelCraft</span>
        </div>
        {fileName && <span className="pc-header__fname">— {fileName}{isModified ? ' •' : ''}</span>}
      </div>

      {/* ── Center: Tools ── */}
      <div className="pc-header__col">
        {/* History */}
        <IBtn onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" size={32}>{IC.Undo}</IBtn>
        <IBtn onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" size={32}>{IC.Redo}</IBtn>

        <div className="pc-vdivider" />

        {/* Zoom */}
        <IBtn onClick={() => setZoom(z => +(Math.min(4, z + 0.15)).toFixed(2))} disabled={!hasImage} title="Zoom In"   size={32}>{IC.ZoomIn}</IBtn>
        <IBtn onClick={() => setZoom(z => +(Math.max(0.2, z - 0.15)).toFixed(2))} disabled={!hasImage} title="Zoom Out"  size={32}>{IC.ZoomOut}</IBtn>
        <IBtn onClick={() => setZoom(1)} disabled={!hasImage} title="Fit to screen" size={32}>{IC.Fit}</IBtn>

        <div className="pc-vdivider" />

        {/* View tools */}
        <IBtn
          active={showGrid}
          onClick={() => setShowGrid(g => !g)}
          disabled={!hasImage}
          title="Toggle grid"
          size={32}
        >
          {IC.Grid}
        </IBtn>
        <IBtn
          active={showBefore}
          onMouseDown={() => setShowBefore(true)}
          onMouseUp={() => setShowBefore(false)}
          onMouseLeave={() => setShowBefore(false)}
          onTouchStart={() => setShowBefore(true)}
          onTouchEnd={() => setShowBefore(false)}
          onClick={() => {}}
          disabled={!hasImage}
          title="Hold to compare original"
          size={32}
        >
          {IC.Compare}
        </IBtn>
      </div>

      {/* ── Right: Open + Export ── */}
      <div className="pc-header__col">
        <button
          className="pc-btn pc-btn-outline pc-btn-sm"
          onClick={openFile}
        >
          {IC.Upload}<span>Open</span>
        </button>
        <button
          className={`pc-export-btn ${hasImage && !isCropping && !isSaving ? 'pc-export-btn--on' : 'pc-export-btn--off'}`}
          onClick={handleSave}
          disabled={!hasImage || isCropping || isSaving}
        >
          {isSaving ? <span className="pc-spin">⏳</span> : IC.Save}
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}