// src/components/editor/Header.jsx
import { useEffect, useRef, useState } from 'react';
import { IBtn } from '../ui';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const menuRef = useRef(null);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    const onDocClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick, { passive: true });
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (err) {
      console.warn('Fullscreen request failed', err);
    } finally {
      setMenuOpen(false);
    }
  };

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

      {/* ── Right: Hamburger Menu ── */}
      <div className="pc-header__col" ref={menuRef}>
        <button
          type="button"
          className={`pc-hamburger ${menuOpen ? 'on' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Open quick actions menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {menuOpen && (
          <div className="pc-menu">
            <button className="pc-menu__item" onClick={toggleFullscreen}>
              <span className="pc-menu__ico">{IC.Fit}</span>
              <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
            </button>
            <button
              className="pc-menu__item"
              onClick={() => { openFile(); setMenuOpen(false); }}
            >
              <span className="pc-menu__ico">{IC.Upload}</span>
              <span>Open</span>
            </button>
            <button
              className="pc-menu__item"
              onClick={() => { handleSave(); setMenuOpen(false); }}
              disabled={!hasImage || isCropping || isSaving}
            >
              <span className="pc-menu__ico">{isSaving ? '⏳' : IC.Save}</span>
              <span>Export</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}