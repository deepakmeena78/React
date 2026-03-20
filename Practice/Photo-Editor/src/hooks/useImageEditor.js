// src/hooks/useImageEditor.js
import { useState, useEffect, useRef, useCallback } from 'react';
import useHistory from './useHistory';
import {
  DEFAULT_ADJ, TABS, buildFilter, buildVignette,
  EXPORT_FORMATS,
} from '../constants';

// ── Snapshot shape ──────────────────────────────────────────
const makeSnap = (adj, tx) => ({ adj: { ...adj }, tx: { ...tx } });
const DEFAULT_TX = { rotation: 0, flipX: 1, flipY: 1, zoom: 1 };

// ═══════════════════════════════════════════════════════════
export default function useImageEditor() {
  // ── App lifecycle ─────────────────────────────────────────
  const [loading, setLoading]       = useState(true);

  // ── Image sources ─────────────────────────────────────────
  const [imageSrc, setImageSrc]     = useState(null);
  const [origSrc,  setOrigSrc]      = useState(null);
  const [fileName, setFileName]     = useState('');
  const [fileSize, setFileSize]     = useState(0);
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });

  // ── Adjustments ───────────────────────────────────────────
  const [adj, setAdj] = useState({ ...DEFAULT_ADJ });

  // ── Transform ─────────────────────────────────────────────
  const [tx, setTx] = useState({ ...DEFAULT_TX });

  // ── Crop ──────────────────────────────────────────────────
  const [isCropping, setIsCropping] = useState(false);
  const [cropW, setCropW]           = useState('');
  const [cropH, setCropH]           = useState('');
  const [activeRatio, setActiveRatio] = useState('Free');

  // ── Overlays ──────────────────────────────────────────────
  const [texts,    setTexts]        = useState([]);    // text overlays
  const [stickers, setStickers]     = useState([]);    // emoji stickers

  // ── Frame ─────────────────────────────────────────────────
  const [frame, setFrame] = useState({ type: 'none', width: 20 });

  // ── Export options ────────────────────────────────────────
  const [exportFmt,     setExportFmt]     = useState('png');
  const [exportQuality, setExportQuality] = useState(92);
  const [exportScale,   setExportScale]   = useState(100);

  // ── UI state ──────────────────────────────────────────────
  const [activeTab,     setActiveTab]     = useState('Light');
  const [activeFilter,  setActiveFilter]  = useState('Original');
  const [showBefore,    setShowBefore]    = useState(false);
  const [showGrid,      setShowGrid]      = useState(false);
  const [isSaving,      setIsSaving]      = useState(false);
  const [toastMsg,      setToastMsg]      = useState('');

  // ── History ───────────────────────────────────────────────
  const hist = useHistory(makeSnap(DEFAULT_ADJ, DEFAULT_TX));

  // ── Refs ──────────────────────────────────────────────────
  const fileRef    = useRef(null);
  const imgRef     = useRef(null);
  const cropperRef = useRef(null);

  // ── Loading ───────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  // ── Cleanup cropper on unmount ────────────────────────────
  useEffect(() => {
    return () => { if (cropperRef.current) cropperRef.current.destroy(); };
  }, []);

  // ── Crop dimension inputs ─────────────────────────────────
  useEffect(() => {
    if (!cropperRef.current || !isCropping) return;
    const w = parseInt(cropW); if (w > 0) cropperRef.current.setCropBoxData({ width: w });
  }, [cropW, isCropping]);

  useEffect(() => {
    if (!cropperRef.current || !isCropping) return;
    const h = parseInt(cropH); if (h > 0) cropperRef.current.setCropBoxData({ height: h });
  }, [cropH, isCropping]);

  // ── Toast helper ──────────────────────────────────────────
  const toast = useCallback((msg, ms = 2000) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), ms);
  }, []);

  // ── Push to history ───────────────────────────────────────
  const pushHistory = useCallback((newAdj, newTx) => {
    hist.push(makeSnap(newAdj, newTx));
  }, [hist]);

  // ── Restore from history snapshot ────────────────────────
  const restoreSnap = useCallback((snap) => {
    setAdj({ ...snap.adj });
    setTx({ ...snap.tx });
  }, []);

  // ── Undo / Redo ───────────────────────────────────────────
  const undo = useCallback(() => {
    if (!hist.canUndo) return;
    hist.undo();
    // cursor moves, read new current on next render
  }, [hist]);

  const redo = useCallback(() => {
    if (!hist.canRedo) return;
    hist.redo();
  }, [hist]);

  // ── Sync adj/tx from history current ─────────────────────
  useEffect(() => {
    setAdj({ ...hist.current?.adj });
    setTx({ ...hist.current?.tx });
  }, [hist.current]);

  // ── File load ─────────────────────────────────────────────
  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      setImageSrc(src);
      setOrigSrc(src);
      const freshAdj = { ...DEFAULT_ADJ };
      const freshTx  = { ...DEFAULT_TX };
      setAdj(freshAdj);
      setTx(freshTx);
      setTexts([]); setStickers([]);
      setActiveFilter('Original');
      setActiveTab('Light');
      setIsCropping(false);
      setFrame({ type: 'none', width: 20 });
      hist.clear(makeSnap(freshAdj, freshTx));
      if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
      const img = new Image();
      img.onload = () => setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [hist]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile({ target: { files: [file] } });
  }, [handleFile]);

  // ── Adjustment change (live preview, no history push) ────
  const changeAdj = useCallback((key, val) => {
    setAdj(p => ({ ...p, [key]: val }));
    setActiveFilter('Custom');
  }, []);

  // ── Commit adj to history (on slider release) ─────────────
  const commitAdj = useCallback((key, val) => {
    setAdj(p => {
      const next = { ...p, [key]: val };
      pushHistory(next, tx);
      return next;
    });
  }, [tx, pushHistory]);

  // ── Apply full preset ─────────────────────────────────────
  const applyPreset = useCallback((preset) => {
    setActiveFilter(preset.name);
    const na = { ...DEFAULT_ADJ, ...preset.values };
    setAdj(na);
    pushHistory(na, tx);
  }, [tx, pushHistory]);

  // ── Transform helpers ─────────────────────────────────────
  const rotate = useCallback((dir) => {
    setTx(p => {
      const next = { ...p, rotation: p.rotation + dir * 90 };
      pushHistory(adj, next);
      return next;
    });
  }, [adj, pushHistory]);

  const flip = useCallback((axis) => {
    setTx(p => {
      const next = axis === 'x'
        ? { ...p, flipX: p.flipX * -1 }
        : { ...p, flipY: p.flipY * -1 };
      pushHistory(adj, next);
      return next;
    });
  }, [adj, pushHistory]);

  const setZoom = useCallback((val) => {
    setTx(p => ({ ...p, zoom: val }));
  }, []);

  // ── Crop ──────────────────────────────────────────────────
  const startCrop = useCallback(() => {
    if (!imgRef.current || !imageSrc) return;
    const Crop = window.Cropper;
    if (!Crop) { alert('Add Cropper.js CDN to index.html'); return; }
    if (cropperRef.current) cropperRef.current.destroy();
    cropperRef.current = new Crop(imgRef.current, {
      viewMode: 1, responsive: true, autoCropArea: 0.8,
      movable: true, zoomable: true, rotatable: true,
    });
    setIsCropping(true);
  }, [imageSrc]);

  const doneCrop = useCallback(() => {
    if (!cropperRef.current) return;
    const cv = cropperRef.current.getCroppedCanvas();
    cropperRef.current.destroy(); cropperRef.current = null;
    const newSrc = cv.toDataURL();
    setImageSrc(newSrc);
    setImgNatural({ w: cv.width, h: cv.height });
    setIsCropping(false);
    pushHistory(adj, tx);
    toast('Crop applied ✓');
  }, [adj, tx, pushHistory, toast]);

  const cancelCrop = useCallback(() => {
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
    setIsCropping(false);
  }, []);

  const setAspectRatio = useCallback((ar) => {
    setActiveRatio(ar.label);
    if (cropperRef.current) cropperRef.current.setAspectRatio(isNaN(ar.ratio) ? NaN : ar.ratio);
  }, []);

  // ── Reset all ─────────────────────────────────────────────
  const resetAll = useCallback(() => {
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
    const freshAdj = { ...DEFAULT_ADJ };
    const freshTx  = { ...DEFAULT_TX };
    setAdj(freshAdj); setTx(freshTx);
    setTexts([]); setStickers([]);
    setActiveFilter('Original');
    setIsCropping(false);
    setFrame({ type: 'none', width: 20 });
    setImageSrc(origSrc);
    hist.clear(makeSnap(freshAdj, freshTx));
    toast('Reset to original ✓');
  }, [origSrc, hist, toast]);

  // ── Reset only adjustments ────────────────────────────────
  const resetAdj = useCallback(() => {
    const freshAdj = { ...DEFAULT_ADJ };
    setAdj(freshAdj);
    setActiveFilter('Original');
    pushHistory(freshAdj, tx);
    toast('Adjustments reset ✓');
  }, [tx, pushHistory, toast]);

  // ── Straighten (fine rotation) ────────────────────────────
  const setStraighten = useCallback((deg) => {
    setTx(p => ({ ...p, straighten: deg }));
  }, []);

  // ── Export / Save ─────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!imgRef.current || !imageSrc || isSaving) return;
    setIsSaving(true);
    try {
      const imgEl = imgRef.current;
      const scaleF = exportScale / 100;
      const w = Math.round(imgNatural.w * scaleF);
      const h = Math.round(imgNatural.h * scaleF);
      const cv = document.createElement('canvas');
      const ctx = cv.getContext('2d');
      cv.width = w; cv.height = h;
      ctx.filter = buildFilter(adj);
      ctx.drawImage(imgEl, 0, 0, w, h);
      // Grain on export (canvas-based)
      if (adj.grain > 0) {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const strength = adj.grain * 0.6;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * strength;
          data[i]   = Math.min(255, Math.max(0, data[i]   + noise));
          data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
          data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
      }
      // Sharpen on export (unsharp mask)
      if (adj.sharpen > 0) {
        const amount = adj.sharpen / 100;
        ctx.filter = `contrast(${100 + amount * 30}%) brightness(${100 + amount * 5}%)`;
        ctx.drawImage(cv, 0, 0);
        ctx.filter = 'none';
      }
      // Text overlays
      ctx.filter = 'none';
      texts.forEach(t => {
        ctx.font = `${t.bold ? 'bold ' : ''}${Math.round(t.size * scaleF)}px ${t.font || 'DM Sans, sans-serif'}`;
        ctx.fillStyle = t.color;
        if (t.shadow) { ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 10; }
        ctx.fillText(t.text, w * t.x / 100, h * t.y / 100);
        ctx.shadowBlur = 0;
      });
      // Stickers
      stickers.forEach(st => {
        ctx.font = `${Math.round(st.size * scaleF)}px serif`;
        ctx.fillText(st.emoji, w * st.x / 100, h * st.y / 100);
      });

      const fmtCfg = EXPORT_FORMATS.find(f => f.value === exportFmt);
      const quality = fmtCfg?.quality ? exportQuality / 100 : undefined;
      const dataUrl = cv.toDataURL(fmtCfg?.mime || 'image/png', quality);
      const link = document.createElement('a');
      const base = fileName ? fileName.replace(/\.[^.]+$/, '') : 'image';
      link.href = dataUrl;
      link.download = `${base}_edited.${exportFmt}`;
      link.click();
      toast(`Saved as ${exportFmt.toUpperCase()} ✓`);
    } catch (err) {
      console.error(err);
      toast('Export failed ✗');
    } finally {
      setIsSaving(false);
    }
  }, [imageSrc, imgRef, adj, texts, stickers, exportFmt, exportQuality, exportScale, imgNatural, fileName, isSaving, toast]);

  // ── Derived ───────────────────────────────────────────────
  const filterStr    = buildFilter(adj);
  const vigGrad      = buildVignette(adj.vignette);
  const transformStr = `rotate(${tx.rotation + (tx.straighten || 0)}deg) scaleX(${tx.flipX}) scaleY(${tx.flipY}) scale(${tx.zoom})`;
  const hasImage     = !!imageSrc;
  const isModified   = JSON.stringify(adj) !== JSON.stringify(DEFAULT_ADJ)
    || tx.rotation !== 0 || tx.flipX !== 1 || tx.flipY !== 1;

  return {
    // lifecycle
    loading,
    // image
    imageSrc, origSrc, fileName, fileSize, imgNatural,
    // adjustment
    adj, changeAdj, commitAdj, applyPreset, resetAdj,
    // transform
    tx, setZoom, rotate, flip, setStraighten,
    // crop
    isCropping, cropW, setCropW, cropH, setCropH, activeRatio,
    startCrop, doneCrop, cancelCrop, setAspectRatio,
    // overlays
    texts, setTexts, stickers, setStickers,
    // frame
    frame, setFrame,
    // export
    exportFmt, setExportFmt, exportQuality, setExportQuality,
    exportScale, setExportScale,
    // ui
    activeTab, setActiveTab, activeFilter, setActiveFilter,
    showBefore, setShowBefore, showGrid, setShowGrid,
    isSaving, toastMsg,
    // history
    undo, redo, resetAll,
    canUndo: hist.canUndo, canRedo: hist.canRedo,
    historyLength: hist.historyLength,
    // derived
    filterStr, vigGrad, transformStr, hasImage, isModified,
    // refs
    fileRef, imgRef,
    // helpers
    handleFile, handleDrop, handleSave, toast,
  };
}