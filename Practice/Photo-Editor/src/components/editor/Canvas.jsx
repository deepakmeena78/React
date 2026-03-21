// src/components/editor/Canvas.jsx
import { buildGrainStyle } from '../../constants';
import { IC } from '../../constants/icons';
import { useCallback, useMemo, useRef, useState } from 'react';

export default function Canvas({
  imageSrc, origSrc, imgRef,
  filterStr, vigGrad, transformStr,
  isCropping, showBefore, showGrid,
  hasImage, adj,
  texts, setTexts, stickers, setStickers,
  zoom, imgNatural, isModified,
  handleDrop, openFile,
  isSaving,
}) {
  const grainStyle = useMemo(() => buildGrainStyle(adj.grain), [adj.grain]);
  const [activeLayer, setActiveLayer] = useState(null); // { type: 'text' | 'sticker', id }
  const dragRef = useRef(null);
  const latestPointerRef = useRef(null);
  const rafRef = useRef(null);

  const clampPct = (v) => Math.max(0, Math.min(100, v));

  const updateLayer = useCallback((type, id, updater) => {
    if (type === 'text') {
      setTexts(prev => prev.map(t => (t.id === id ? { ...t, ...updater(t) } : t)));
      return;
    }
    setStickers(prev => prev.map(s => (s.id === id ? { ...s, ...updater(s) } : s)));
  }, [setTexts, setStickers]);

  const handleLayerPointerDown = useCallback((e, type, item) => {
    if (e.target.closest('.pc-canvas__resize')) return;
    e.stopPropagation();
    setActiveLayer({ type, id: item.id });
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      mode: 'move',
      type,
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      startItemX: item.x,
      startItemY: item.y,
      width: rect.width || 1,
      height: rect.height || 1,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [imgRef]);

  const handleResizePointerDown = useCallback((e, type, item) => {
    e.stopPropagation();
    setActiveLayer({ type, id: item.id });
    dragRef.current = {
      mode: 'resize',
      type,
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      startSize: item.size || 32,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const commitDragFrame = useCallback(() => {
    rafRef.current = null;
    const op = dragRef.current;
    const p = latestPointerRef.current;
    if (!op || !p) return;

    if (op.mode === 'move') {
      const dxPct = ((p.clientX - op.startX) / op.width) * 100;
      const dyPct = ((p.clientY - op.startY) / op.height) * 100;
      updateLayer(op.type, op.id, () => ({
        x: clampPct(op.startItemX + dxPct),
        y: clampPct(op.startItemY + dyPct),
      }));
      return;
    }

    // Resize: use dominant axis for predictable feel.
    const dX = p.clientX - op.startX;
    const dY = p.clientY - op.startY;
    const dominant = Math.abs(dX) > Math.abs(dY) ? dX : dY;
    const sensitivity = 0.45; // higher = faster/greater resize per finger movement
    const minSize = op.type === 'text' ? 10 : 14;
    const maxSize = 360;
    const nextSize = op.startSize + dominant * sensitivity;
    updateLayer(op.type, op.id, () => ({
      size: Math.max(minSize, Math.min(maxSize, nextSize)),
    }));
  }, [updateLayer]);

  const handlePointerMove = useCallback((e) => {
    const op = dragRef.current;
    if (!op) return;
    latestPointerRef.current = { clientX: e.clientX, clientY: e.clientY };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(commitDragFrame);
  }, [commitDragFrame]);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    latestPointerRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return (
    <main
      className={`pc-canvas ${showGrid ? 'has-grid' : ''}`}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={() => setActiveLayer(null)}
    >
      {/* ── Badges ── */}
      {showBefore && hasImage && (
        <div className="pc-canvas__badge pc-canvas__badge--before">BEFORE</div>
      )}
      {isCropping && (
        <div className="pc-canvas__badge pc-canvas__badge--crop">
          <span className="blink" />
          Crop Mode — use panel to confirm
        </div>
      )}

      {/* ── Drop Zone ── */}
      {!hasImage ? (
        <div className="pc-drop" onClick={openFile}>
          <div className="pc-drop__icon">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <div>
            <p className="pc-drop__title">Drop your image here</p>
            <p className="pc-drop__sub">or click to browse files</p>
            <p className="pc-drop__fmt">PNG · JPG · WEBP · GIF · BMP</p>
          </div>
          <div className="pc-drop__cta">{IC.Upload} Choose File</div>
        </div>
      ) : (
        /* ── Image ── */
        <div className="pc-canvas__img-wrap">
          <img
            ref={imgRef}
            src={showBefore ? origSrc : imageSrc}
            alt="editing"
            className="pc-canvas__img"
            style={{
              filter:    showBefore ? 'none' : filterStr,
              transform: isCropping  ? 'none' : transformStr,
            }}
          />

          {/* Vignette overlay */}
          {(adj.vignette > 0) && !isCropping && !showBefore && (
            <div className="pc-canvas__vignette" style={{ background: vigGrad }} />
          )}

          {/* Grain overlay (visual preview) */}
          {(adj.grain > 0) && !isCropping && !showBefore && (
            <div style={grainStyle} />
          )}

          {/* Text overlays */}
          {texts.map(t => (
            <div
              key={t.id}
              className={`pc-canvas__overlay ${activeLayer?.type === 'text' && activeLayer?.id === t.id ? 'is-active' : ''}`}
              style={{
                left:       `${t.x}%`,
                top:        `${t.y}%`,
                color:       t.color,
                fontSize:   `${t.size}px`,
                fontFamily:  t.font || 'DM Sans, sans-serif',
                fontWeight:  t.bold ? '700' : '400',
                textShadow:  t.shadow ? '0 2px 10px rgba(0,0,0,0.9)' : 'none',
              }}
              onPointerDown={(e) => handleLayerPointerDown(e, 'text', t)}
            >
              {t.text}
              <button
                className="pc-canvas__resize"
                onPointerDown={(e) => handleResizePointerDown(e, 'text', t)}
                aria-label="Resize text"
              />
            </div>
          ))}

          {/* Sticker overlays */}
          {stickers.map(s => (
            <div
              key={s.id}
              className={`pc-canvas__overlay ${activeLayer?.type === 'sticker' && activeLayer?.id === s.id ? 'is-active' : ''}`}
              style={{
                left:     `${s.x}%`,
                top:      `${s.y}%`,
                fontSize: `${s.size}px`,
                lineHeight: 1,
              }}
              onPointerDown={(e) => handleLayerPointerDown(e, 'sticker', s)}
            >
              {s.emoji}
              <button
                className="pc-canvas__resize"
                onPointerDown={(e) => handleResizePointerDown(e, 'sticker', s)}
                aria-label="Resize sticker"
              />
            </div>
          ))}

          {/* Saving overlay */}
          {isSaving && (
            <div className="pc-saving-overlay">
              <span className="pc-spin" style={{ fontSize: '28px' }}>⏳</span>
            </div>
          )}
        </div>
      )}

      {/* ── Status bar ── */}
      {hasImage && (
        <div className="pc-status">
          <span className="pc-status__t">{Math.round(zoom * 100)}%</span>
          <div className="pc-vdivider" style={{ margin: '0 2px' }} />
          <span className="pc-status__t">{imgNatural.w} × {imgNatural.h}</span>
          {isModified && (
            <>
              <div className="pc-vdivider" style={{ margin: '0 2px' }} />
              <div className="pc-status__dot" />
              <span className="pc-status__edited">Edited</span>
            </>
          )}
        </div>
      )}
    </main>
  );
}