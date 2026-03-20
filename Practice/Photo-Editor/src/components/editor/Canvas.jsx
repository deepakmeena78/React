// src/components/editor/Canvas.jsx
import { buildGrainStyle } from '../../constants';
import { IC } from '../../constants/icons';

export default function Canvas({
  imageSrc, origSrc, imgRef,
  filterStr, vigGrad, transformStr,
  isCropping, showBefore, showGrid,
  hasImage, adj,
  texts, stickers,
  zoom, imgNatural, isModified,
  handleDrop, openFile,
  isSaving,
}) {
  return (
    <main
      className={`pc-canvas ${showGrid ? 'has-grid' : ''}`}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
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
            <div style={buildGrainStyle(adj.grain)} />
          )}

          {/* Text overlays */}
          {texts.map(t => (
            <div
              key={t.id}
              className="pc-canvas__overlay"
              style={{
                left:       `${t.x}%`,
                top:        `${t.y}%`,
                color:       t.color,
                fontSize:   `${t.size}px`,
                fontFamily:  t.font || 'DM Sans, sans-serif',
                fontWeight:  t.bold ? '700' : '400',
                textShadow:  t.shadow ? '0 2px 10px rgba(0,0,0,0.9)' : 'none',
              }}
            >
              {t.text}
            </div>
          ))}

          {/* Sticker overlays */}
          {stickers.map(s => (
            <div
              key={s.id}
              className="pc-canvas__overlay"
              style={{
                left:     `${s.x}%`,
                top:      `${s.y}%`,
                fontSize: `${s.size}px`,
                lineHeight: 1,
              }}
            >
              {s.emoji}
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