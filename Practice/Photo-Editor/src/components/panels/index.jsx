// src/components/panels/index.jsx
// All panel components: Light, Color, Detail, Effects, Filters, Crop, Transform, Text, Export

import { useState } from 'react';
import {
  LIGHT_ADJUSTMENTS, COLOR_ADJUSTMENTS, DETAIL_ADJUSTMENTS, EFFECTS_ADJUSTMENTS,
  PRESET_FILTERS, ASPECT_RATIOS, EXPORT_FORMATS, FRAME_OPTIONS,
} from '../../constants';
import { AdjSlider, FilterCard, Btn, Tag, SL, HDivider, RangeRow, IBtn } from '../ui';
import { IC } from '../../constants/icons';

// ═══════════════════════════════════════════════════════════
// LIGHT PANEL
// ═══════════════════════════════════════════════════════════
export function LightPanel({ adj, onChange, onCommit, disabled }) {
  return (
    <div>
      <p className="pc-hint">Adjust exposure, contrast and tonal range</p>
      {LIGHT_ADJUSTMENTS.map(a => (
        <AdjSlider key={a.key} adj={a} value={adj[a.key]} onChange={v => onChange(a.key, v)} onCommit={onCommit} disabled={disabled} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COLOR PANEL
// ═══════════════════════════════════════════════════════════
export function ColorPanel({ adj, onChange, onCommit, disabled }) {
  return (
    <div>
      <p className="pc-hint">Control saturation, hue and colour temperature</p>
      {COLOR_ADJUSTMENTS.map(a => (
        <AdjSlider key={a.key} adj={a} value={adj[a.key]} onChange={v => onChange(a.key, v)} onCommit={onCommit} disabled={disabled} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DETAIL PANEL
// ═══════════════════════════════════════════════════════════
export function DetailPanel({ adj, onChange, onCommit, disabled }) {
  return (
    <div>
      <p className="pc-hint">Sharpen details or smooth noise</p>
      {DETAIL_ADJUSTMENTS.map(a => (
        <AdjSlider key={a.key} adj={a} value={adj[a.key]} onChange={v => onChange(a.key, v)} onCommit={onCommit} disabled={disabled} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EFFECTS PANEL
// ═══════════════════════════════════════════════════════════
export function EffectsPanel({ adj, onChange, onCommit, disabled }) {
  return (
    <div>
      <p className="pc-hint">Apply creative effects and artistic looks</p>
      {EFFECTS_ADJUSTMENTS.map(a => (
        <AdjSlider key={a.key} adj={a} value={adj[a.key]} onChange={v => onChange(a.key, v)} onCommit={onCommit} disabled={disabled} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FILTERS PANEL
// ═══════════════════════════════════════════════════════════
export function FiltersPanel({ activeFilter, applyPreset, imageSrc, hasImage, isMobile }) {
  return (
    <div>
      <p className="pc-hint">
        {hasImage ? 'Tap a preset to apply instantly' : 'Open an image to preview filters'}
      </p>
      {isMobile ? (
        <div className="pc-fr">
          {PRESET_FILTERS.map(p => (
            <FilterCard key={p.name} preset={p} active={activeFilter === p.name}
              imgSrc={hasImage ? imageSrc : null} onClick={() => hasImage && applyPreset(p)} size={62} />
          ))}
        </div>
      ) : (
        <div className="pc-fg">
          {PRESET_FILTERS.map(p => (
            <FilterCard key={p.name} preset={p} active={activeFilter === p.name}
              imgSrc={hasImage ? imageSrc : null} onClick={() => hasImage && applyPreset(p)} size={68} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CROP PANEL
// ═══════════════════════════════════════════════════════════
export function CropPanel({
  isCropping, hasImage,
  activeRatio, setAspectRatio,
  cropW, setCropW, cropH, setCropH,
  startCrop, doneCrop, cancelCrop,
}) {
  const [localRatio, setLocalRatio] = useState(activeRatio);

  const handleRatioClick = (ar) => {
    setLocalRatio(ar.label);
    if (isCropping) setAspectRatio(ar);
  };

  return (
    <div>
      {isCropping && (
        <div className="pc-crop-badge">
          <div className="b" /><span>Crop mode — drag to select area</span>
        </div>
      )}
      <SL>Aspect Ratio</SL>
      <div className="pc-ratio-row">
        {ASPECT_RATIOS.map(ar => (
          <Tag key={ar.label} label={ar.label} active={(isCropping ? activeRatio : localRatio) === ar.label} onClick={() => handleRatioClick(ar)} />
        ))}
      </div>
      {!isCropping && (
        <>
          <SL>Custom Size (px)</SL>
          <div className="pc-ci">
            <input type="number" placeholder="Width" value={cropW} onChange={e => setCropW(e.target.value)} />
            <input type="number" placeholder="Height" value={cropH} onChange={e => setCropH(e.target.value)} />
          </div>
          <Btn onClick={startCrop} disabled={!hasImage} variant="primary" full>{IC.Crop} Start Crop</Btn>
        </>
      )}
      {isCropping && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <Btn onClick={doneCrop}   variant="success" full size="sm">{IC.Check} Apply Crop</Btn>
          <Btn onClick={cancelCrop} variant="danger"  full size="sm">{IC.Close} Cancel</Btn>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TRANSFORM PANEL
// ═══════════════════════════════════════════════════════════
export function TransformPanel({ tx, setZoom, rotate, flip, hasImage, adj, onChange, onCommit }) {
  const zoomAdj = { key: 'zoom', label: 'Zoom', icon: '🔍', min: 0.2, max: 4, default: 1, unit: '×' };

  return (
    <div>
      <SL>Rotate</SL>
      <div className="pc-tf-row">
        <button className="pc-tf-btn" onClick={() => rotate(-1)} disabled={!hasImage}>
          {IC.RotL}<span>↺ Left 90°</span>
        </button>
        <button className="pc-tf-btn" onClick={() => rotate(1)}  disabled={!hasImage}>
          {IC.RotR}<span>↻ Right 90°</span>
        </button>
      </div>

      <SL>Flip</SL>
      <div className="pc-tf-row">
        <button className={`pc-tf-btn ${tx.flipX === -1 ? 'on' : ''}`} onClick={() => flip('x')} disabled={!hasImage}>
          {IC.FlipH}<span>Horizontal</span>
        </button>
        <button className={`pc-tf-btn ${tx.flipY === -1 ? 'on' : ''}`} onClick={() => flip('y')} disabled={!hasImage}>
          {IC.FlipV}<span>Vertical</span>
        </button>
      </div>

      <SL>Zoom</SL>
      <AdjSlider adj={zoomAdj} value={tx.zoom} onChange={v => setZoom(v)} disabled={!hasImage} />

      <SL>Fine Rotation</SL>
      <AdjSlider
        adj={{ key: 'straighten', label: 'Straighten', icon: '📐', min: -45, max: 45, default: 0, unit: '°' }}
        value={tx.straighten || 0}
        onChange={v => onChange?.('straighten', v)}
        disabled={!hasImage}
      />

      <HDivider />
      <SL>Current State</SL>
      {[
        ['Rotation',  `${tx.rotation}°`],
        ['Straighten',`${tx.straighten || 0}°`],
        ['Flip H',    tx.flipX === -1 ? 'On' : 'Off'],
        ['Flip V',    tx.flipY === -1 ? 'On' : 'Off'],
        ['Zoom',      `${Math.round(tx.zoom * 100)}%`],
      ].map(([k, v]) => (
        <div className="pc-info-row" key={k}>
          <span className="pc-info-row__k">{k}</span>
          <span className={`pc-info-row__v ${v !== 'Off' && v !== '0°' && v !== '100%' ? 'hi' : ''}`}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEXT & STICKER PANEL
// ═══════════════════════════════════════════════════════════
const EMOJI_LIST = ['😊','😎','❤️','🔥','⭐','🌟','🎉','🏆','💫','✨','🌈','🌺','🦋','🎨','📷','🖼️','🌙','☀️','🌊','🍀','🎭','💎','🚀','🎵'];
const FONT_LIST = ['DM Sans', 'Georgia', 'Impact', 'Courier New', 'Arial', 'Verdana', 'Palatino'];

export function TextPanel({ texts, setTexts, stickers, setStickers, hasImage }) {
  const [txt,   setTxt]   = useState('');
  const [color, setColor] = useState('#ffffff');
  const [size,  setSize]  = useState(32);
  const [font,  setFont]  = useState('DM Sans');
  const [bold,  setBold]  = useState(false);
  const [shadow,setShadow]= useState(true);
  const [activeMode, setActiveMode] = useState('text'); // 'text' | 'sticker'

  const addText = () => {
    if (!txt.trim()) return;
    setTexts(p => [...p, { id: Date.now(), text: txt, color, size, font, bold, shadow, x: 50, y: 30 }]);
    setTxt('');
  };

  const addSticker = (emoji) => {
    setStickers(p => [...p, { id: Date.now(), emoji, size: 48, x: 50, y: 50 }]);
  };

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <Tag label="✏️ Text"    active={activeMode === 'text'}    onClick={() => setActiveMode('text')} />
        <Tag label="😊 Sticker" active={activeMode === 'sticker'} onClick={() => setActiveMode('sticker')} />
      </div>

      {activeMode === 'text' && (
        <div className="pc-text-panel">
          <textarea
            value={txt} onChange={e => setTxt(e.target.value)}
            placeholder="Type overlay text here..." rows={2}
          />
          <div className="pc-text-ctrls">
            <label>Color</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
            <label>Size</label>
            <input type="number" value={size} onChange={e => setSize(Number(e.target.value))} min={10} max={160} />
          </div>
          <div className="pc-text-ctrls" style={{ marginBottom: '10px' }}>
            <label>Font</label>
            <select value={font} onChange={e => setFont(e.target.value)}>
              {FONT_LIST.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <Tag label="Bold"   active={bold}   onClick={() => setBold(p => !p)} />
            <Tag label="Shadow" active={shadow} onClick={() => setShadow(p => !p)} />
          </div>
          <Btn onClick={addText} variant="primary" disabled={!txt.trim() || !hasImage} full size="sm">
            {IC.Text} Add Text
          </Btn>
        </div>
      )}

      {activeMode === 'sticker' && (
        <div>
          <p className="pc-hint">Tap an emoji to add it to the image</p>
          <div className="pc-sticker-grid">
            {EMOJI_LIST.map(emoji => (
              <button key={emoji} className="pc-sticker-btn" onClick={() => hasImage && addSticker(emoji)} disabled={!hasImage}>
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Layers list */}
      {(texts.length > 0 || stickers.length > 0) && (
        <>
          <HDivider />
          <SL>Layers ({texts.length + stickers.length})</SL>
          {texts.map(t => (
            <div className="pc-text-li" key={t.id}>
              <span style={{ color: t.color, fontFamily: t.font }}>{t.text}</span>
              <button className="pc-text-del" onClick={() => setTexts(p => p.filter(x => x.id !== t.id))}>
                {IC.Close}
              </button>
            </div>
          ))}
          {stickers.map(s => (
            <div className="pc-text-li" key={s.id}>
              <span>{s.emoji} (sticker)</span>
              <button className="pc-text-del" onClick={() => setStickers(p => p.filter(x => x.id !== s.id))}>
                {IC.Close}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPORT PANEL
// ═══════════════════════════════════════════════════════════
export function ExportPanel({
  exportFmt, setExportFmt,
  exportQuality, setExportQuality,
  exportScale, setExportScale,
  imgNatural, fileName, hasImage, isSaving, handleSave,
  frame, setFrame,
}) {
  const fmtCfg   = EXPORT_FORMATS.find(f => f.value === exportFmt);
  const outW     = Math.round((imgNatural.w || 0) * exportScale / 100);
  const outH     = Math.round((imgNatural.h || 0) * exportScale / 100);

  return (
    <div>
      {/* Frame */}
      <SL>Border / Frame</SL>
      <div className="pc-frame-row">
        {FRAME_OPTIONS.map(f => (
          <Tag key={f.id} label={f.label} active={frame.type === f.id} onClick={() => setFrame(p => ({ ...p, type: f.id }))} />
        ))}
      </div>
      {frame.type !== 'none' && (
        <RangeRow label="Frame Width" value={frame.width || 20} onChange={v => setFrame(p => ({ ...p, width: v }))} min={4} max={80} unit="px" />
      )}

      <HDivider />

      {/* Format */}
      <SL>Output Format</SL>
      <div className="pc-exp-fmt-row">
        {EXPORT_FORMATS.map(f => (
          <Tag key={f.value} label={f.label} active={exportFmt === f.value} onClick={() => setExportFmt(f.value)} />
        ))}
      </div>

      {/* Quality (JPEG/WebP only) */}
      {fmtCfg?.quality && (
        <RangeRow label="Quality" value={exportQuality} onChange={setExportQuality} min={20} max={100} unit="%" />
      )}

      {/* Scale */}
      <RangeRow label="Export Scale" value={exportScale} onChange={setExportScale} min={10} max={200} unit="%" />

      {/* Output info */}
      {hasImage && (
        <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '9px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="pc-info-row" style={{ borderBottom: 'none', padding: '3px 0' }}>
            <span className="pc-info-row__k">Output size</span>
            <span className="pc-info-row__v hi">{outW} × {outH} px</span>
          </div>
          <div className="pc-info-row" style={{ borderBottom: 'none', padding: '3px 0' }}>
            <span className="pc-info-row__k">Format</span>
            <span className="pc-info-row__v">{exportFmt.toUpperCase()}{fmtCfg?.quality ? ` @ ${exportQuality}%` : ''}</span>
          </div>
          <div className="pc-info-row" style={{ borderBottom: 'none', padding: '3px 0' }}>
            <span className="pc-info-row__k">File name</span>
            <span className="pc-info-row__v">{fileName ? fileName.replace(/\.[^.]+$/, '') + `_edited.${exportFmt}` : `image_edited.${exportFmt}`}</span>
          </div>
        </div>
      )}

      <Btn onClick={handleSave} variant="primary" full disabled={!hasImage || isSaving} size="md">
        {isSaving
          ? <><span className="pc-spin">⏳</span> Exporting...</>
          : <>{IC.Download} Export & Download</>
        }
      </Btn>

      <HDivider />

      {/* Image info */}
      <SL>Source Image</SL>
      {[
        ['File',       fileName || '—'],
        ['Dimensions', hasImage ? `${imgNatural.w} × ${imgNatural.h} px` : '—'],
      ].map(([k, v]) => (
        <div className="pc-info-row" key={k}>
          <span className="pc-info-row__k">{k}</span>
          <span className="pc-info-row__v">{v}</span>
        </div>
      ))}
    </div>
  );
}