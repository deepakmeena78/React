// // ImageEditor.jsx — Full React Image Editor
// // Dependencies: npm install cropperjs
// // Add to index.html or main.jsx: import 'cropperjs/dist/cropper.css'
// // OR use CDN in index.html:
// //   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css">
// //   <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js"></script>

// import { useState, useEffect, useRef, useCallback } from "react";

// // ─── FILTER CONFIG ───────────────────────────────────────────────────────────
// const FILTERS = [
//   { value: "none",        label: "Select Filter", min: 0,   max: 100, default: 0   },
//   { value: "blur",        label: "Blur",          min: 0,   max: 10,  default: 0   },
//   { value: "brightness",  label: "Brightness",    min: 0,   max: 200, default: 100 },
//   { value: "contrast",    label: "Contrast",      min: 0,   max: 200, default: 100 },
//   { value: "drop-shadow", label: "Drop Shadow",   min: 0,   max: 50,  default: 0   },
//   { value: "grayscale",   label: "Grayscale",     min: 0,   max: 100, default: 0   },
//   { value: "hue-rotate",  label: "Hue Rotate",    min: 0,   max: 360, default: 0   },
//   { value: "invert",      label: "Invert",        min: 0,   max: 100, default: 0   },
//   { value: "opacity",     label: "Opacity",       min: 0,   max: 100, default: 100 },
//   { value: "saturate",    label: "Saturation",    min: 0,   max: 300, default: 100 },
//   { value: "sepia",       label: "Sepia",         min: 0,   max: 100, default: 0   },
// ];

// const DEFAULT_FILTER_VALUES = {
//   blur: 0,
//   brightness: 100,
//   contrast: 100,
//   "drop-shadow": 0,
//   grayscale: 0,
//   "hue-rotate": 0,
//   invert: 0,
//   opacity: 100,
//   saturate: 100,
//   sepia: 0,
// };

// // ─── BUILD CSS FILTER STRING ─────────────────────────────────────────────────
// function buildFilterString(fv) {
//   return `
//     blur(${fv.blur}px)
//     brightness(${fv.brightness}%)
//     contrast(${fv.contrast}%)
//     drop-shadow(0 0 ${fv["drop-shadow"]}px black)
//     grayscale(${fv.grayscale}%)
//     hue-rotate(${fv["hue-rotate"]}deg)
//     invert(${fv.invert}%)
//     opacity(${fv.opacity}%)
//     saturate(${fv.saturate}%)
//     sepia(${fv.sepia}%)
//   `.trim();
// }

// // ─── LOADING SCREEN ───────────────────────────────────────────────────────────
// function LoadingScreen() {
//   return (
//     <div style={styles.loaderOverlay}>
//       <div style={styles.loaderCard}>
//         <div style={styles.loaderBarTrack}>
//           <div style={styles.loaderBar} />
//         </div>
//         <p style={styles.loaderText}>Loading Editor...</p>
//         <style>{`
//           @keyframes loaderSlide {
//             0%   { transform: translateX(-100%); }
//             50%  { transform: translateX(100%); }
//             100% { transform: translateX(-100%); }
//           }
//           @keyframes pulse {
//             0%, 100% { opacity: 1; }
//             50%       { opacity: 0.4; }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }

// // ─── ICON COMPONENTS (SVG inline, no external dep) ───────────────────────────
// const IconRotateCCW = () => (
//   <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
//     <path d="M3 3v5h5"/>
//   </svg>
// );
// const IconRotateCW = () => (
//   <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
//     <path d="M21 3v5h-5"/>
//   </svg>
// );
// const IconFlipH = () => (
//   <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/>
//     <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/>
//     <path d="M12 20v2M12 14v2M12 8v2M12 2v2"/>
//   </svg>
// );
// const IconFlipV = () => (
//   <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/>
//     <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/>
//     <path d="M4 12H2M10 12H8M16 12h-2M22 12h-2"/>
//   </svg>
// );
// const IconImage = () => (
//   <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
//     <circle cx="8.5" cy="8.5" r="1.5"/>
//     <polyline points="21 15 16 10 5 21"/>
//   </svg>
// );
// const IconCrop = () => (
//   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/>
//     <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/>
//   </svg>
// );
// const IconSave = () => (
//   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
//     <polyline points="17 21 17 13 7 13 7 21"/>
//     <polyline points="7 3 7 8 15 8"/>
//   </svg>
// );
// const IconReset = () => (
//   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="1 4 1 10 7 10"/>
//     <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
//   </svg>
// );
// const IconCheck = () => (
//   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12"/>
//   </svg>
// );
// const IconUpload = () => (
//   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="16 16 12 12 8 16"/>
//     <line x1="12" y1="12" x2="12" y2="21"/>
//     <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
//   </svg>
// );

// // ─── BUTTON COMPONENT ─────────────────────────────────────────────────────────
// function EditorBtn({ onClick, disabled, icon, label, variant = "default", fullWidth = true }) {
//   const [hovered, setHovered] = useState(false);
//   const base = {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     width: fullWidth ? "100%" : "auto",
//     padding: "10px 16px",
//     borderRadius: "10px",
//     border: "none",
//     fontSize: "13.5px",
//     fontWeight: "600",
//     fontFamily: "'Outfit', sans-serif",
//     cursor: disabled ? "not-allowed" : "pointer",
//     transition: "all 0.2s ease",
//     letterSpacing: "0.4px",
//     opacity: disabled ? 0.45 : 1,
//   };
//   const variants = {
//     default: {
//       background: hovered && !disabled ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(139,92,246,0.15)",
//       color: hovered && !disabled ? "#fff" : "#c4b5fd",
//       boxShadow: hovered && !disabled ? "0 4px 20px rgba(139,92,246,0.4)" : "none",
//     },
//     success: {
//       background: hovered && !disabled ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(16,185,129,0.15)",
//       color: hovered && !disabled ? "#fff" : "#6ee7b7",
//       boxShadow: hovered && !disabled ? "0 4px 20px rgba(16,185,129,0.4)" : "none",
//     },
//     danger: {
//       background: hovered && !disabled ? "linear-gradient(135deg,#dc2626,#ef4444)" : "rgba(239,68,68,0.15)",
//       color: hovered && !disabled ? "#fff" : "#fca5a5",
//       boxShadow: hovered && !disabled ? "0 4px 20px rgba(239,68,68,0.4)" : "none",
//     },
//     primary: {
//       background: hovered && !disabled ? "linear-gradient(135deg,#6d28d9,#8b5cf6)" : "linear-gradient(135deg,#5b21b6,#7c3aed)",
//       color: "#fff",
//       boxShadow: hovered && !disabled ? "0 6px 24px rgba(109,40,217,0.5)" : "0 2px 8px rgba(109,40,217,0.3)",
//     },
//   };
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{ ...base, ...variants[variant] }}
//     >
//       {icon} {label}
//     </button>
//   );
// }

// // ─── ASPECT RATIO PILL ────────────────────────────────────────────────────────
// function AspectBtn({ label, ratio, cropper }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <button
//       onClick={() => cropper && cropper.setAspectRatio(ratio)}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         padding: "6px 12px",
//         borderRadius: "8px",
//         border: "1px solid rgba(139,92,246,0.3)",
//         background: hovered ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.1)",
//         color: "#c4b5fd",
//         fontSize: "12px",
//         fontWeight: "600",
//         cursor: "pointer",
//         transition: "all 0.2s",
//         fontFamily: "'Outfit', sans-serif",
//       }}
//     >
//       {label}
//     </button>
//   );
// }

// // ─── TRANSFORM ICON BUTTON ────────────────────────────────────────────────────
// function TransformBtn({ onClick, icon, title }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <button
//       onClick={onClick}
//       title={title}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         width: "44px", height: "44px",
//         borderRadius: "10px",
//         border: "1px solid rgba(139,92,246,0.25)",
//         background: hovered ? "rgba(139,92,246,0.25)" : "rgba(139,92,246,0.08)",
//         color: "#c4b5fd",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         cursor: "pointer",
//         transition: "all 0.2s",
//       }}
//     >
//       {icon}
//     </button>
//   );
// }

// // ─── SECTION LABEL ────────────────────────────────────────────────────────────
// function SectionLabel({ children }) {
//   return (
//     <p style={{
//       fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px",
//       textTransform: "uppercase", color: "#6b7280", margin: "0 0 8px 0",
//       fontFamily: "'Outfit', sans-serif",
//     }}>
//       {children}
//     </p>
//   );
// }

// // ─── DIVIDER ─────────────────────────────────────────────────────────────────
// function Divider() {
//   return <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "14px 0" }} />;
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function ImageEditor() {
//   const [loading, setLoading]           = useState(true);
//   const [imageSrc, setImageSrc]         = useState(null);
//   const [previewSrc, setPreviewSrc]     = useState(null);
//   const [isCropping, setIsCropping]     = useState(false);
//   const [filterValues, setFilterValues] = useState({ ...DEFAULT_FILTER_VALUES });
//   const [selectedFilter, setSelectedFilter] = useState("none");
//   const [rangeValue, setRangeValue]     = useState(0);
//   const [cropW, setCropW]               = useState("");
//   const [cropH, setCropH]               = useState("");
//   const [flipX, setFlipX]               = useState(1);
//   const [flipY, setFlipY]               = useState(1);
//   const [rotation, setRotation]         = useState(0);

//   const fileInputRef = useRef(null);
//   const imgRef       = useRef(null);
//   const cropperRef   = useRef(null);

//   // ── Loading timeout ───────────────────────────────────────────────────────
//   useEffect(() => {
//     const t = setTimeout(() => setLoading(false), 3000);
//     return () => clearTimeout(t);
//   }, []);

//   // ── Destroy cropper on unmount ────────────────────────────────────────────
//   useEffect(() => {
//     return () => { if (cropperRef.current) cropperRef.current.destroy(); };
//   }, []);

//   // ── Apply filter string ───────────────────────────────────────────────────
//   const filterString = buildFilterString(filterValues);

//   // ── Image transform string ────────────────────────────────────────────────
//   const transformString = `rotate(${rotation}deg) scaleX(${flipX}) scaleY(${flipY})`;

//   // ── File chosen ───────────────────────────────────────────────────────────
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       setImageSrc(ev.target.result);
//       setPreviewSrc(ev.target.result);
//       setFilterValues({ ...DEFAULT_FILTER_VALUES });
//       setSelectedFilter("none");
//       setRangeValue(0);
//       setRotation(0);
//       setFlipX(1);
//       setFlipY(1);
//       if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
//       setIsCropping(false);
//     };
//     reader.readAsDataURL(file);
//   };

//   // ── Start crop ────────────────────────────────────────────────────────────
//   const startCrop = useCallback(() => {
//     if (!imgRef.current || !imageSrc) return;
//     if (cropperRef.current) cropperRef.current.destroy();
//     // Cropper.js is loaded via CDN; access via window.Cropper
//     const CropperClass = window.Cropper;
//     if (!CropperClass) { alert("Cropper.js not loaded. Add CDN script to index.html"); return; }
//     cropperRef.current = new CropperClass(imgRef.current, {
//       viewMode: 1,
//       responsive: true,
//       autoCropArea: 0.8,
//       movable: true,
//       zoomable: true,
//       rotatable: true,
//     });
//     setIsCropping(true);
//   }, [imageSrc]);

//   // ── Done crop ─────────────────────────────────────────────────────────────
//   const doneCrop = () => {
//     if (!cropperRef.current) return;
//     const canvas = cropperRef.current.getCroppedCanvas();
//     const newSrc = canvas.toDataURL();
//     cropperRef.current.destroy();
//     cropperRef.current = null;
//     setImageSrc(newSrc);
//     setPreviewSrc(newSrc);
//     setIsCropping(false);
//   };

//   // ── Set aspect ratio ──────────────────────────────────────────────────────
//   const setAspect = (ratio) => {
//     if (cropperRef.current) cropperRef.current.setAspectRatio(ratio);
//   };

//   // ── Crop W/H inputs ───────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!cropperRef.current || !isCropping) return;
//     const w = parseInt(cropW);
//     if (w) cropperRef.current.setCropBoxData({ width: w });
//   }, [cropW, isCropping]);

//   useEffect(() => {
//     if (!cropperRef.current || !isCropping) return;
//     const h = parseInt(cropH);
//     if (h) cropperRef.current.setCropBoxData({ height: h });
//   }, [cropH, isCropping]);

//   // ── Filter change ─────────────────────────────────────────────────────────
//   const handleFilterSelect = (e) => {
//     const f = e.target.value;
//     setSelectedFilter(f);
//     if (f === "none") { setRangeValue(0); return; }
//     const cfg = FILTERS.find(x => x.value === f);
//     const current = filterValues[f] ?? cfg.default;
//     setRangeValue(current);
//   };

//   const handleRangeChange = (val) => {
//     const num = Number(val);
//     setRangeValue(num);
//     if (selectedFilter === "none") return;
//     setFilterValues(prev => ({ ...prev, [selectedFilter]: num }));
//   };

//   // ── Range limits ──────────────────────────────────────────────────────────
//   const currentFilterCfg = FILTERS.find(f => f.value === selectedFilter) || FILTERS[0];

//   // ── Reset ─────────────────────────────────────────────────────────────────
//   const handleReset = () => {
//     if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
//     setFilterValues({ ...DEFAULT_FILTER_VALUES });
//     setSelectedFilter("none");
//     setRangeValue(0);
//     setRotation(0);
//     setFlipX(1);
//     setFlipY(1);
//     setImageSrc(previewSrc);
//     setIsCropping(false);
//   };

//   // ── Save ──────────────────────────────────────────────────────────────────
//   const handleSave = () => {
//     if (!imgRef.current || !imageSrc) { alert("No image loaded!"); return; }
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const img = imgRef.current;
//     canvas.width  = img.naturalWidth;
//     canvas.height = img.naturalHeight;
//     ctx.filter = filterString;
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     const link = document.createElement("a");
//     link.href = canvas.toDataURL("image/png");
//     link.download = "edited-image.png";
//     link.click();
//   };

//   // ── Rotate ────────────────────────────────────────────────────────────────
//   const rotateCCW = () => setRotation(r => r - 90);
//   const rotateCW  = () => setRotation(r => r + 90);
//   const toggleFlipX = () => setFlipX(v => v === 1 ? -1 : 1);
//   const toggleFlipY = () => setFlipY(v => v === 1 ? -1 : 1);

//   const hasImage = !!imageSrc;

//   // ─────────────────────────────────────────────────────────────────────────
//   if (loading) return <LoadingScreen />;

//   return (
//     <>
//       {/* Google Fonts */}
//       <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

//       <div style={styles.appBg}>
//         {/* Decorative blobs */}
//         <div style={styles.blob1} />
//         <div style={styles.blob2} />

//         {/* ── Header ── */}
//         <header style={styles.header}>
//           <div style={styles.headerLogo}>
//             <div style={styles.logoIcon}>✦</div>
//             <span style={styles.logoText}>OurEditor</span>
//           </div>
//           <p style={styles.headerSub}>Professional Image Editor</p>
//         </header>

//         {/* ── Main Card ── */}
//         <div style={styles.card}>

//           {/* ══ LEFT SIDEBAR ══════════════════════════════════════════════ */}
//           <aside style={styles.sidebar}>

//             {/* Actions */}
//             <SectionLabel>Actions</SectionLabel>
//             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//               <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
//               <EditorBtn icon={<IconUpload />} label="Choose Image"  variant="primary"  onClick={() => fileInputRef.current.click()} />
//               <EditorBtn icon={<IconCrop />}   label="Crop Image"   variant="default"  disabled={!hasImage || isCropping} onClick={startCrop} />
//               <EditorBtn icon={<IconCheck />}  label="Done Crop"    variant="success"  disabled={!isCropping}              onClick={doneCrop}  />
//               <EditorBtn icon={<IconSave />}   label="Save Image"   variant="success"  disabled={!hasImage || isCropping}  onClick={handleSave} />
//               <EditorBtn icon={<IconReset />}  label="Reset All"    variant="danger"   disabled={!hasImage}                onClick={handleReset} />
//             </div>

//             <Divider />

//             {/* Filter */}
//             <SectionLabel>Filter</SectionLabel>
//             <select
//               value={selectedFilter}
//               onChange={handleFilterSelect}
//               disabled={!hasImage || isCropping}
//               style={styles.select}
//             >
//               {FILTERS.map(f => (
//                 <option key={f.value} value={f.value}>{f.label}</option>
//               ))}
//             </select>

//             {/* Range slider */}
//             <div style={{ marginTop: "14px" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
//                 <span style={styles.filterLabel}>Intensity</span>
//                 <span style={styles.filterValue}>{rangeValue}{selectedFilter === "hue-rotate" ? "°" : "%"}</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                 <button
//                   onClick={() => handleRangeChange(Math.max(currentFilterCfg.min, rangeValue - 1))}
//                   disabled={!hasImage || selectedFilter === "none" || isCropping}
//                   style={styles.pmBtn}
//                 >−</button>
//                 <input
//                   type="range"
//                   min={currentFilterCfg.min}
//                   max={currentFilterCfg.max}
//                   value={rangeValue}
//                   disabled={!hasImage || selectedFilter === "none" || isCropping}
//                   onChange={e => handleRangeChange(e.target.value)}
//                   style={styles.rangeInput}
//                 />
//                 <button
//                   onClick={() => handleRangeChange(Math.min(currentFilterCfg.max, rangeValue + 1))}
//                   disabled={!hasImage || selectedFilter === "none" || isCropping}
//                   style={styles.pmBtn}
//                 >+</button>
//               </div>
//             </div>

//             <Divider />

//             {/* Transform */}
//             <SectionLabel>Transform</SectionLabel>
//             <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//               <TransformBtn onClick={rotateCCW}   icon={<IconRotateCCW />} title="Rotate Left" />
//               <TransformBtn onClick={rotateCW}    icon={<IconRotateCW />}  title="Rotate Right" />
//               <TransformBtn onClick={toggleFlipX} icon={<IconFlipH />}     title="Flip Horizontal" />
//               <TransformBtn onClick={toggleFlipY} icon={<IconFlipV />}     title="Flip Vertical" />
//             </div>

//             {/* Aspect ratio — only when cropping */}
//             {isCropping && (
//               <>
//                 <Divider />
//                 <SectionLabel>Aspect Ratio</SectionLabel>
//                 <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
//                   <AspectBtn label="16:9" ratio={16/9}  cropper={cropperRef.current} />
//                   <AspectBtn label="4:3"  ratio={4/3}   cropper={cropperRef.current} />
//                   <AspectBtn label="1:1"  ratio={1}     cropper={cropperRef.current} />
//                   <AspectBtn label="2:3"  ratio={2/3}   cropper={cropperRef.current} />
//                   <AspectBtn label="Free" ratio={NaN}   cropper={cropperRef.current} />
//                 </div>
//                 <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
//                   <input
//                     type="number"
//                     placeholder="Width"
//                     value={cropW}
//                     onChange={e => setCropW(e.target.value)}
//                     style={styles.cropInput}
//                   />
//                   <input
//                     type="number"
//                     placeholder="Height"
//                     value={cropH}
//                     onChange={e => setCropH(e.target.value)}
//                     style={styles.cropInput}
//                   />
//                 </div>
//               </>
//             )}
//           </aside>

//           {/* ══ IMAGE AREA ════════════════════════════════════════════════ */}
//           <main style={styles.imageArea}>

//             {/* Preview strip */}
//             {previewSrc && (
//               <div style={styles.previewStrip}>
//                 <span style={styles.previewLabel}>Original</span>
//                 <img src={previewSrc} alt="preview" style={styles.previewImg} />
//               </div>
//             )}

//             {/* Canvas */}
//             <div style={styles.canvas}>
//               {!hasImage ? (
//                 <div style={styles.placeholder} onClick={() => fileInputRef.current.click()}>
//                   <IconImage />
//                   <p style={styles.placeholderText}>Click to choose an image</p>
//                   <p style={styles.placeholderSub}>PNG, JPG, WEBP supported</p>
//                 </div>
//               ) : (
//                 <div style={styles.imgWrapper}>
//                   <img
//                     ref={imgRef}
//                     src={imageSrc}
//                     alt="editing"
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: "100%",
//                       objectFit: "contain",
//                       filter: isCropping ? "none" : filterString,
//                       transform: isCropping ? "none" : transformString,
//                       transition: "filter 0.2s, transform 0.2s",
//                       borderRadius: "8px",
//                       display: "block",
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Status bar */}
//             <div style={styles.statusBar}>
//               <span style={styles.statusDot(isCropping ? "#f59e0b" : hasImage ? "#10b981" : "#6b7280")} />
//               <span style={styles.statusText}>
//                 {isCropping ? "Crop mode — drag to select area" : hasImage ? "Image ready" : "No image loaded"}
//               </span>
//               {selectedFilter !== "none" && !isCropping && (
//                 <span style={styles.filterBadge}>{currentFilterCfg.label}: {rangeValue}{selectedFilter === "hue-rotate" ? "°" : "%"}</span>
//               )}
//             </div>
//           </main>
//         </div>

//         <style>{`
//           * { box-sizing: border-box; }
//           body { margin: 0; font-family: 'Outfit', sans-serif; }
//           input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px;
//             background: linear-gradient(to right,#7c3aed ${rangeValue / currentFilterCfg.max * 100}%, rgba(255,255,255,0.1) 0%);
//             outline: none;
//           }
//           input[type=range]::-webkit-slider-thumb {
//             -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
//             background: #a78bfa; cursor: pointer; box-shadow: 0 0 6px rgba(139,92,246,0.6);
//           }
//           input[type=range]:disabled { opacity: 0.35; }
//           select option { background: #1e1b4b; color: #e2e8f0; }
//           ::-webkit-scrollbar { width: 4px; }
//           ::-webkit-scrollbar-track { background: transparent; }
//           ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }
//         `}</style>
//       </div>
//     </>
//   );
// }

// // ─── STYLES OBJECT ────────────────────────────────────────────────────────────
// const styles = {
//   // Loading
//   loaderOverlay: {
//     position: "fixed", inset: 0,
//     background: "radial-gradient(ellipse at 40% 50%, #1e1b4b 0%, #0f0e1a 100%)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     zIndex: 9999,
//   },
//   loaderCard: {
//     textAlign: "center",
//     padding: "40px 60px",
//     borderRadius: "20px",
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(139,92,246,0.2)",
//     backdropFilter: "blur(20px)",
//   },
//   loaderBarTrack: {
//     width: "240px", height: "4px",
//     background: "rgba(255,255,255,0.08)",
//     borderRadius: "2px",
//     overflow: "hidden",
//     margin: "0 auto 20px",
//   },
//   loaderBar: {
//     height: "100%", width: "60%",
//     background: "linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)",
//     borderRadius: "2px",
//     animation: "loaderSlide 1.6s ease-in-out infinite",
//   },
//   loaderText: {
//     color: "#a78bfa", fontSize: "15px", fontFamily: "'Outfit',sans-serif",
//     letterSpacing: "3px", textTransform: "uppercase", fontWeight: "600",
//     margin: 0, animation: "pulse 1.6s ease-in-out infinite",
//   },

//   // App
//   appBg: {
//     minHeight: "100vh",
//     background: "radial-gradient(ellipse at 30% 20%, #1e1b4b 0%, #0f0e1a 60%, #09080f 100%)",
//     padding: "0 20px 20px",
//     position: "relative",
//     overflow: "hidden",
//   },
//   blob1: {
//     position: "absolute", top: "-100px", left: "-100px",
//     width: "400px", height: "400px", borderRadius: "50%",
//     background: "radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 70%)",
//     pointerEvents: "none",
//   },
//   blob2: {
//     position: "absolute", bottom: "-80px", right: "-80px",
//     width: "350px", height: "350px", borderRadius: "50%",
//     background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
//     pointerEvents: "none",
//   },

//   // Header
//   header: {
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     padding: "18px 0 14px",
//     borderBottom: "1px solid rgba(255,255,255,0.05)",
//     marginBottom: "18px",
//   },
//   headerLogo: { display: "flex", alignItems: "center", gap: "10px" },
//   logoIcon: {
//     width: "34px", height: "34px", borderRadius: "10px",
//     background: "linear-gradient(135deg,#7c3aed,#a855f7)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: "16px", color: "#fff", fontWeight: "800",
//     boxShadow: "0 4px 14px rgba(124,58,237,0.5)",
//   },
//   logoText: {
//     fontSize: "22px", fontWeight: "800", fontFamily: "'Outfit',sans-serif",
//     background: "linear-gradient(90deg,#e9d5ff,#c4b5fd)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//     letterSpacing: "-0.5px",
//   },
//   headerSub: {
//     fontSize: "12px", color: "#4b5563", fontFamily: "'Outfit',sans-serif",
//     letterSpacing: "1px", textTransform: "uppercase", margin: 0,
//   },

//   // Card
//   card: {
//     display: "flex",
//     gap: "16px",
//     height: "calc(100vh - 110px)",
//     borderRadius: "20px",
//     border: "1px solid rgba(255,255,255,0.06)",
//     background: "rgba(255,255,255,0.02)",
//     backdropFilter: "blur(20px)",
//     overflow: "hidden",
//   },

//   // Sidebar
//   sidebar: {
//     width: "230px",
//     minWidth: "230px",
//     padding: "20px 16px",
//     borderRight: "1px solid rgba(255,255,255,0.05)",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//   },

//   // Select
//   select: {
//     width: "100%",
//     padding: "9px 12px",
//     borderRadius: "10px",
//     border: "1px solid rgba(139,92,246,0.3)",
//     background: "rgba(139,92,246,0.1)",
//     color: "#c4b5fd",
//     fontSize: "13px",
//     fontFamily: "'Outfit',sans-serif",
//     fontWeight: "500",
//     outline: "none",
//     cursor: "pointer",
//   },

//   filterLabel: { fontSize: "12px", color: "#6b7280", fontFamily: "'Outfit',sans-serif" },
//   filterValue: {
//     fontSize: "13px", fontWeight: "700", color: "#a78bfa",
//     fontFamily: "'Outfit',sans-serif",
//   },

//   // Range +/- buttons
//   pmBtn: {
//     width: "28px", height: "28px",
//     borderRadius: "8px",
//     border: "1px solid rgba(139,92,246,0.3)",
//     background: "rgba(139,92,246,0.1)",
//     color: "#c4b5fd",
//     fontSize: "18px", fontWeight: "300",
//     cursor: "pointer",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     flexShrink: 0,
//     padding: 0,
//   },
//   rangeInput: { flex: 1 },

//   // Crop inputs
//   cropInput: {
//     flex: 1,
//     padding: "7px 10px",
//     borderRadius: "8px",
//     border: "1px solid rgba(139,92,246,0.25)",
//     background: "rgba(255,255,255,0.04)",
//     color: "#e2e8f0",
//     fontSize: "12px",
//     fontFamily: "'Outfit',sans-serif",
//     outline: "none",
//   },

//   // Image area
//   imageArea: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//     padding: "16px 16px 0",
//   },

//   // Preview strip
//   previewStrip: {
//     display: "flex", alignItems: "center", gap: "12px",
//     marginBottom: "12px",
//   },
//   previewLabel: {
//     fontSize: "10px", color: "#6b7280", letterSpacing: "1px",
//     textTransform: "uppercase", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap",
//   },
//   previewImg: {
//     height: "50px",
//     maxWidth: "120px",
//     objectFit: "contain",
//     borderRadius: "6px",
//     border: "1px solid rgba(255,255,255,0.08)",
//     background: "rgba(0,0,0,0.3)",
//   },

//   // Canvas
//   canvas: {
//     flex: 1,
//     borderRadius: "14px",
//     border: "1px solid rgba(255,255,255,0.06)",
//     background: "repeating-conic-gradient(rgba(255,255,255,0.02) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     overflow: "hidden",
//     position: "relative",
//   },
//   imgWrapper: {
//     width: "100%", height: "100%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     padding: "12px",
//   },

//   // Placeholder
//   placeholder: {
//     display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//     gap: "12px", cursor: "pointer", userSelect: "none",
//     padding: "40px",
//   },
//   placeholderText: {
//     color: "#7c3aed", fontSize: "16px", fontWeight: "600",
//     fontFamily: "'Outfit',sans-serif", margin: 0,
//   },
//   placeholderSub: {
//     color: "#374151", fontSize: "12px", fontFamily: "'Outfit',sans-serif", margin: 0,
//   },

//   // Status bar
//   statusBar: {
//     display: "flex", alignItems: "center", gap: "8px",
//     padding: "10px 4px",
//     borderTop: "1px solid rgba(255,255,255,0.04)",
//     marginTop: "auto",
//   },
//   statusDot: (color) => ({
//     width: "8px", height: "8px", borderRadius: "50%",
//     background: color, flexShrink: 0,
//     boxShadow: `0 0 6px ${color}`,
//   }),
//   statusText: {
//     fontSize: "12px", color: "#4b5563", fontFamily: "'Outfit',sans-serif",
//   },
//   filterBadge: {
//     marginLeft: "auto",
//     fontSize: "11px", fontWeight: "600",
//     color: "#a78bfa",
//     background: "rgba(139,92,246,0.12)",
//     border: "1px solid rgba(139,92,246,0.2)",
//     padding: "3px 10px",
//     borderRadius: "20px",
//     fontFamily: "'Outfit',sans-serif",
//   },
// };











/**
 * PixelCraft — Professional React Image Editor
 *
 * SETUP (5 minutes):
 * 1. npm create vite@latest my-editor -- --template react
 *    cd my-editor && npm install
 * 2. Copy this file → src/ImageEditor.jsx
 * 3. src/App.jsx:
 *      import ImageEditor from './ImageEditor'
 *      export default function App(){ return <ImageEditor /> }
 * 4. index.html <head> mein add karo:
 *      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css">
 *      <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js"></script>
 * 5. src/index.css → replace everything with:
 *      * { margin:0; padding:0; box-sizing:border-box; } body { overflow:hidden; }
 * 6. npm run dev ✅
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════

const TABS = ["Adjust", "Filters", "Crop", "Transform", "Details"];

const ADJUSTMENTS = [
  { key: "brightness",   label: "Brightness", icon: "☀️",  min: 0,   max: 200, default: 100, unit: "%" },
  { key: "contrast",     label: "Contrast",   icon: "◐",   min: 0,   max: 200, default: 100, unit: "%" },
  { key: "saturate",     label: "Saturation", icon: "💧",  min: 0,   max: 300, default: 100, unit: "%" },
  { key: "hue-rotate",   label: "Hue",        icon: "🎨",  min: 0,   max: 360, default: 0,   unit: "°" },
  { key: "sepia",        label: "Warmth",     icon: "🌅",  min: 0,   max: 100, default: 0,   unit: "%" },
  { key: "blur",         label: "Blur",       icon: "🌫️",  min: 0,   max: 20,  default: 0,   unit: "px" },
  { key: "vignette",     label: "Vignette",   icon: "⬛",  min: 0,   max: 100, default: 0,   unit: "%" },
  { key: "grayscale",    label: "B&W",        icon: "⬜",  min: 0,   max: 100, default: 0,   unit: "%" },
  { key: "invert",       label: "Invert",     icon: "🔄",  min: 0,   max: 100, default: 0,   unit: "%" },
  { key: "opacity",      label: "Fade",       icon: "👻",  min: 0,   max: 100, default: 100, unit: "%" },
  { key: "drop-shadow",  label: "Glow",       icon: "✨",  min: 0,   max: 50,  default: 0,   unit: "px" },
];

const DEFAULT_ADJ = Object.fromEntries(ADJUSTMENTS.map(a => [a.key, a.default]));

const PRESET_FILTERS = [
  { name: "Original", values: {} },
  { name: "Vivid",    values: { saturate: 180, contrast: 115, brightness: 105 } },
  { name: "Chrome",   values: { contrast: 130, saturate: 120, brightness: 108, "hue-rotate": 5 } },
  { name: "Fade",     values: { opacity: 85, brightness: 115, contrast: 85, saturate: 75 } },
  { name: "Noir",     values: { grayscale: 100, contrast: 130, brightness: 95 } },
  { name: "Warm",     values: { sepia: 40, saturate: 120, brightness: 105 } },
  { name: "Cool",     values: { "hue-rotate": 200, saturate: 110, brightness: 102 } },
  { name: "Drama",    values: { contrast: 160, saturate: 140, brightness: 90, vignette: 40 } },
  { name: "Sunset",   values: { sepia: 60, saturate: 160, brightness: 110, "hue-rotate": 15 } },
  { name: "Matte",    values: { contrast: 75, brightness: 115, saturate: 90, opacity: 92 } },
  { name: "Lomo",     values: { contrast: 150, saturate: 130, vignette: 60, brightness: 95 } },
  { name: "Vintage",  values: { sepia: 80, contrast: 90, brightness: 105, blur: 0.3 } },
];

const ASPECT_RATIOS = [
  { label: "Free", ratio: NaN   },
  { label: "1:1",  ratio: 1     },
  { label: "4:3",  ratio: 4/3   },
  { label: "16:9", ratio: 16/9  },
  { label: "3:4",  ratio: 3/4   },
  { label: "9:16", ratio: 9/16  },
  { label: "2:3",  ratio: 2/3   },
  { label: "3:2",  ratio: 3/2   },
];

// ═══════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════

function buildFilter(a) {
  return [
    `brightness(${a.brightness}%)`,
    `contrast(${a.contrast}%)`,
    `saturate(${a.saturate}%)`,
    `hue-rotate(${a["hue-rotate"]}deg)`,
    `sepia(${a.sepia}%)`,
    `blur(${a.blur}px)`,
    `grayscale(${a.grayscale}%)`,
    `invert(${a.invert}%)`,
    `opacity(${a.opacity}%)`,
    `drop-shadow(0 0 ${a["drop-shadow"]}px rgba(255,200,100,0.8))`,
  ].join(" ");
}

function buildVignette(pct) {
  if (!pct) return "none";
  const sp = Math.round(pct * 2);
  return `radial-gradient(ellipse at center, transparent ${100 - sp}%, rgba(0,0,0,${(pct/100)*0.85}) 100%)`;
}

// ═══════════════════════════════════════════════════════════
// ICONS (inline SVG)
// ═══════════════════════════════════════════════════════════
const I = {
  Upload: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  Save:   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Crop:   <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/></svg>,
  Check:  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Reset:  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>,
  Undo:   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>,
  Redo:   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>,
  RotL:   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  RotR:   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>,
  FlipH:  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M12 20v2M12 14v2M12 8v2M12 2v2"/></svg>,
  FlipV:  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/><path d="M4 12H2M10 12H8M16 12h-2M22 12h-2"/></svg>,
  ZoomIn: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  ZoomOut:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  Compare:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>,
  Text:   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  Close:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Menu:   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

// ═══════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════

function AdjSlider({ adj, value, onChange, disabled }) {
  const pct = ((value - adj.min) / (adj.max - adj.min)) * 100;
  const changed = value !== adj.default;
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ fontSize: "15px", lineHeight: 1 }}>{adj.icon}</span>
          <span style={{ fontSize: "12.5px", fontWeight: "500", color: changed ? "#e2e8f0" : "#4b5563", fontFamily: "'DM Sans',sans-serif" }}>{adj.label}</span>
          {changed && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#f59e0b" }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: changed ? "#f59e0b" : "#4b5563", minWidth: "40px", textAlign: "right", fontFamily: "'DM Sans',sans-serif" }}>
            {value}{adj.unit}
          </span>
          {changed && (
            <button onClick={() => onChange(adj.default)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", padding: "1px", display: "flex" }}>
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
            </button>
          )}
        </div>
      </div>
      <div style={{ position: "relative", height: "26px", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "3px", borderRadius: "2px", background: changed ? "linear-gradient(90deg,#d97706,#f59e0b)" : "rgba(255,255,255,0.15)" }} />
        <input
          type="range" min={adj.min} max={adj.max} value={value} disabled={disabled}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", left: 0, right: 0, width: "100%", opacity: 0, height: "26px", cursor: disabled ? "not-allowed" : "pointer", zIndex: 2 }}
        />
        <div style={{ position: "absolute", left: `calc(${pct}% - 8px)`, width: "16px", height: "16px", borderRadius: "50%", background: changed ? "#f59e0b" : "#2d3142", border: "2px solid " + (changed ? "#fbbf24" : "rgba(255,255,255,0.15)"), boxShadow: changed ? "0 0 8px rgba(245,158,11,0.6)" : "none", pointerEvents: "none", transition: "all 0.2s" }} />
      </div>
    </div>
  );
}

function IBtn({ onClick, children, title, active, disabled, sz = 36 }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: sz, height: sz, borderRadius: "10px", border: active ? "1.5px solid #f59e0b" : "1.5px solid rgba(255,255,255,0.07)",
        background: active ? "rgba(245,158,11,0.15)" : hov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
        color: active ? "#f59e0b" : hov ? "#cbd5e1" : "#4b5563",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1, transition: "all 0.15s", flexShrink: 0,
      }}
    >{children}</button>
  );
}

function Btn({ onClick, children, variant = "ghost", disabled, full, sm, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd }) {
  const [hov, setHov] = useState(false);
  const pad = sm ? "7px 13px" : "9px 16px";
  const fs = sm ? "12px" : "13px";
  const bgs = {
    primary: hov && !disabled ? "#e68900" : "#f59e0b",
    success: hov && !disabled ? "#047857" : "#059669",
    danger:  hov && !disabled ? "#b91c1c" : "#dc2626",
    ghost:   hov && !disabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
    outline: "transparent",
  };
  const cls = {
    primary: "#111", success: "#fff", danger: "#fff",
    ghost: hov ? "#cbd5e1" : "#4b5563", outline: hov ? "#f59e0b" : "#6b7280",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); onMouseLeave?.(); }}
      onMouseDown={onMouseDown} onMouseUp={onMouseUp}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        width: full ? "100%" : "auto", padding: pad, borderRadius: "9px",
        border: variant === "outline" ? "1.5px solid rgba(245,158,11,0.3)" : "none",
        background: bgs[variant], color: cls[variant],
        fontSize: fs, fontWeight: "600", fontFamily: "'DM Sans',sans-serif",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s", letterSpacing: "0.2px",
      }}
    >{children}</button>
  );
}

function Tag({ label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "6px 12px", borderRadius: "8px",
        border: active ? "1.5px solid #f59e0b" : "1.5px solid rgba(255,255,255,0.07)",
        background: active ? "rgba(245,158,11,0.12)" : hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        color: active ? "#f59e0b" : hov ? "#9ca3af" : "#4b5563",
        fontSize: "12px", fontWeight: "600", fontFamily: "'DM Sans',sans-serif",
        cursor: "pointer", transition: "all 0.15s",
      }}
    >{label}</button>
  );
}

function SecLabel({ children }) {
  return <p style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: "#374151", margin: "0 0 10px", fontFamily: "'DM Sans',sans-serif" }}>{children}</p>;
}

function Div() {
  return <div style={{ height: "1px", background: "rgba(255,255,255,0.04)", margin: "16px 0" }} />;
}

// ═══════════════════════════════════════════════════════════
// FILTER CARD
// ═══════════════════════════════════════════════════════════
function FilterCard({ preset, active, imgSrc, onClick }) {
  const fs = buildFilter({ ...DEFAULT_ADJ, ...preset.values });
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: "3px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{ width: "68px", height: "68px", borderRadius: "12px", border: active ? "2.5px solid #f59e0b" : "2px solid rgba(255,255,255,0.07)", overflow: "hidden", background: "#111", boxShadow: active ? "0 0 12px rgba(245,158,11,0.35)" : "none", transition: "all 0.2s" }}>
        {imgSrc
          ? <img src={imgSrc} alt={preset.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: fs }} />
          : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1e2030,#0d0f17)", filter: fs }} />
        }
      </div>
      <span style={{ fontSize: "10px", fontWeight: active ? "700" : "500", color: active ? "#f59e0b" : "#374151", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.3px" }}>{preset.name}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
// TEXT OVERLAY PANEL
// ═══════════════════════════════════════════════════════════
function TextPanel({ texts, setTexts }) {
  const [txt, setTxt] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState(32);
  const add = () => {
    if (!txt.trim()) return;
    setTexts(p => [...p, { id: Date.now(), text: txt, color, size, x: 50, y: 50 }]);
    setTxt("");
  };
  return (
    <div>
      <textarea value={txt} onChange={e => setTxt(e.target.value)} placeholder="Type text here..." rows={3}
        style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", resize: "none", outline: "none", marginBottom: "10px" }}
      />
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "12px", color: "#4b5563", fontFamily: "'DM Sans',sans-serif" }}>Color</span>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: "32px", height: "26px", border: "none", background: "none", cursor: "pointer", padding: 0 }} />
        <span style={{ fontSize: "12px", color: "#4b5563", fontFamily: "'DM Sans',sans-serif" }}>Size</span>
        <input type="number" value={size} onChange={e => setSize(Number(e.target.value))} min={10} max={120}
          style={{ width: "56px", padding: "4px 8px", borderRadius: "7px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
      </div>
      <Btn onClick={add} variant="primary" disabled={!txt.trim()} full sm>{I.Text} Add Text</Btn>
      {texts.length > 0 && (
        <div style={{ marginTop: "14px" }}>
          <SecLabel>Layers</SecLabel>
          {texts.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "5px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: "12px", color: t.color, fontFamily: "'DM Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px", fontWeight: "500" }}>{t.text}</span>
              <button onClick={() => setTexts(p => p.filter(x => x.id !== t.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: "2px", display: "flex" }}>{I.Close}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function ImageEditor() {
  const [loading, setLoading]     = useState(true);
  const [imageSrc, setImageSrc]   = useState(null);
  const [origSrc, setOrigSrc]     = useState(null);
  const [fileName, setFileName]   = useState("");
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });

  const [history, setHistory]     = useState([]);
  const [histIdx, setHistIdx]     = useState(-1);

  const [adj, setAdj]             = useState({ ...DEFAULT_ADJ });
  const [rotation, setRotation]   = useState(0);
  const [flipX, setFlipX]         = useState(1);
  const [flipY, setFlipY]         = useState(1);
  const [zoom, setZoom]           = useState(1);

  const [isCropping, setIsCropping] = useState(false);
  const [cropW, setCropW]         = useState("");
  const [cropH, setCropH]         = useState("");
  const [activeRatio, setActiveRatio] = useState("Free");

  const [activeTab, setActiveTab] = useState("Adjust");
  const [activeFilter, setActiveFilter] = useState("Original");
  const [showBefore, setShowBefore] = useState(false);
  const [texts, setTexts]         = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);

  const fileRef    = useRef(null);
  const imgRef     = useRef(null);
  const cropperRef = useRef(null);

  useEffect(() => {
    const upd = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => { if (cropperRef.current) cropperRef.current.destroy(); }, []);

  useEffect(() => {
    if (!cropperRef.current || !isCropping) return;
    const w = parseInt(cropW); if (w) cropperRef.current.setCropBoxData({ width: w });
  }, [cropW, isCropping]);

  useEffect(() => {
    if (!cropperRef.current || !isCropping) return;
    const h = parseInt(cropH); if (h) cropperRef.current.setCropBoxData({ height: h });
  }, [cropH, isCropping]);

  const filterStr    = buildFilter(adj);
  const vigGrad      = buildVignette(adj.vignette);
  const transformStr = `rotate(${rotation}deg) scaleX(${flipX}) scaleY(${flipY}) scale(${zoom})`;
  const hasImage     = !!imageSrc;
  const canUndo      = histIdx > 0;
  const canRedo      = histIdx < history.length - 1;
  const isModified   = JSON.stringify(adj) !== JSON.stringify(DEFAULT_ADJ) || rotation !== 0 || flipX !== 1 || flipY !== 1;

  const pushHist = useCallback((na, nr, nfx, nfy) => {
    setHistory(prev => {
      const t = prev.slice(0, histIdx + 1);
      return [...t.slice(-29), { adj: na, rotation: nr, flipX: nfx, flipY: nfy }];
    });
    setHistIdx(i => Math.min(i + 1, 30));
  }, [histIdx]);

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target.result;
      setImageSrc(src); setOrigSrc(src);
      setAdj({ ...DEFAULT_ADJ }); setRotation(0); setFlipX(1); setFlipY(1); setZoom(1);
      setTexts([]); setActiveFilter("Original"); setIsCropping(false);
      setHistory([{ adj: { ...DEFAULT_ADJ }, rotation: 0, flipX: 1, flipY: 1 }]); setHistIdx(0);
      if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
      const img = new Image();
      img.onload = () => setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile({ target: { files: [file] } });
  };

  const changeAdj = (key, val) => setAdj(p => ({ ...p, [key]: val }));

  const applyPreset = preset => {
    setActiveFilter(preset.name);
    const na = { ...DEFAULT_ADJ, ...preset.values };
    setAdj(na); pushHist(na, rotation, flipX, flipY);
  };

  const undo = () => {
    if (!canUndo) return;
    const s = history[histIdx - 1];
    setAdj(s.adj); setRotation(s.rotation); setFlipX(s.flipX); setFlipY(s.flipY);
    setHistIdx(i => i - 1);
  };
  const redo = () => {
    if (!canRedo) return;
    const s = history[histIdx + 1];
    setAdj(s.adj); setRotation(s.rotation); setFlipX(s.flipX); setFlipY(s.flipY);
    setHistIdx(i => i + 1);
  };

  const rotate = dir => { const nr = rotation + dir * 90; setRotation(nr); pushHist(adj, nr, flipX, flipY); };
  const flip = axis => {
    if (axis === "x") { const v = flipX * -1; setFlipX(v); pushHist(adj, rotation, v, flipY); }
    else              { const v = flipY * -1; setFlipY(v); pushHist(adj, rotation, flipX, v); }
  };

  const startCrop = () => {
    if (!imgRef.current || !imageSrc) return;
    const Crop = window.Cropper;
    if (!Crop) { alert("Cropper.js CDN not found in index.html"); return; }
    if (cropperRef.current) cropperRef.current.destroy();
    cropperRef.current = new Crop(imgRef.current, { viewMode: 1, responsive: true, autoCropArea: 0.8, movable: true, zoomable: true, rotatable: true });
    setIsCropping(true);
  };
  const doneCrop = () => {
    if (!cropperRef.current) return;
    const cv = cropperRef.current.getCroppedCanvas();
    const ns = cv.toDataURL();
    cropperRef.current.destroy(); cropperRef.current = null;
    setImageSrc(ns); setImgNatural({ w: cv.width, h: cv.height });
    setIsCropping(false); pushHist(adj, rotation, flipX, flipY);
  };
  const cancelCrop = () => {
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
    setIsCropping(false);
  };
  const setAspect = ar => {
    setActiveRatio(ar.label);
    if (cropperRef.current) cropperRef.current.setAspectRatio(isNaN(ar.ratio) ? NaN : ar.ratio);
  };

  const resetAll = () => {
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
    setAdj({ ...DEFAULT_ADJ }); setRotation(0); setFlipX(1); setFlipY(1); setZoom(1);
    setTexts([]); setActiveFilter("Original"); setIsCropping(false);
    setImageSrc(origSrc); pushHist({ ...DEFAULT_ADJ }, 0, 1, 1);
  };

  const handleSave = () => {
    if (!imgRef.current || !imageSrc) return;
    const cv = document.createElement("canvas");
    const ctx = cv.getContext("2d");
    cv.width = imgNatural.w; cv.height = imgNatural.h;
    ctx.filter = filterStr;
    ctx.drawImage(imgRef.current, 0, 0, cv.width, cv.height);
    texts.forEach(t => {
      ctx.filter = "none"; ctx.font = `${t.size}px 'DM Sans', sans-serif`;
      ctx.fillStyle = t.color; ctx.fillText(t.text, cv.width * t.x / 100, cv.height * t.y / 100);
    });
    const link = document.createElement("a");
    const base = fileName ? fileName.replace(/\.[^.]+$/, "") : "image";
    link.href = cv.toDataURL("image/png"); link.download = `${base}_edited.png`; link.click();
  };

  // ─────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ position: "fixed", inset: 0, background: "#0c0e16", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(32px,6vw,48px)", fontWeight: "800", background: "linear-gradient(135deg,#f59e0b 0%,#fcd34d 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px" }}>PixelCraft</div>
      <div style={{ width: "180px", height: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "1px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#d97706,#f59e0b,#fbbf24)", borderRadius: "1px", animation: "pcl 2.2s ease forwards" }} />
      </div>
      <p style={{ color: "#1f2937", fontSize: "11px", fontFamily: "'DM Sans',sans-serif", letterSpacing: "4px", textTransform: "uppercase" }}>Photo Editor</p>
      <style>{`@keyframes pcl{0%{width:0}80%{width:100%}100%{width:100%}}`}</style>
    </div>
  );

  // ─── SIDEBAR CONTENT ─────────────────────────────────────
  const SidebarContent = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Tabs */}
      <div style={{ display: "flex", padding: "12px 12px 0", gap: "1px", borderBottom: "1px solid rgba(255,255,255,0.04)", flexShrink: 0, overflowX: "auto" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 11px", borderRadius: "8px 8px 0 0", border: "none",
            background: activeTab === tab ? "rgba(245,158,11,0.1)" : "none",
            borderBottom: activeTab === tab ? "2px solid #f59e0b" : "2px solid transparent",
            color: activeTab === tab ? "#f59e0b" : "#374151",
            fontSize: "11px", fontWeight: "600", fontFamily: "'DM Sans',sans-serif",
            cursor: "pointer", transition: "all 0.15s", flexShrink: 0, letterSpacing: "0.3px",
          }}>{tab}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 8px" }}>

        {/* ADJUST */}
        {activeTab === "Adjust" && ADJUSTMENTS.map(a => (
          <AdjSlider key={a.key} adj={a} value={adj[a.key]} onChange={v => changeAdj(a.key, v)} disabled={!hasImage || isCropping} />
        ))}

        {/* FILTERS */}
        {activeTab === "Filters" && (
          <div>
            <p style={{ fontSize: "11px", color: "#1f2937", fontFamily: "'DM Sans',sans-serif", marginBottom: "12px" }}>
              {hasImage ? "Tap preset to apply instantly" : "Open an image to preview filters"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
              {PRESET_FILTERS.map(p => (
                <FilterCard key={p.name} preset={p} active={activeFilter === p.name} imgSrc={hasImage ? imageSrc : null} onClick={() => hasImage && applyPreset(p)} />
              ))}
            </div>
          </div>
        )}

        {/* CROP */}
        {activeTab === "Crop" && (
          <div>
            {!isCropping ? (
              <>
                <SecLabel>Aspect Ratio</SecLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                  {ASPECT_RATIOS.map(ar => <Tag key={ar.label} label={ar.label} active={activeRatio === ar.label} onClick={() => setActiveRatio(ar.label)} />)}
                </div>
                <SecLabel>Custom Size</SecLabel>
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                  <input type="number" placeholder="Width px" value={cropW} onChange={e => setCropW(e.target.value)}
                    style={{ flex:1, padding:"8px 10px", borderRadius:"9px", border:"1.5px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.03)", color:"#e2e8f0", fontSize:"12px", fontFamily:"'DM Sans',sans-serif", outline:"none" }} />
                  <input type="number" placeholder="Height px" value={cropH} onChange={e => setCropH(e.target.value)}
                    style={{ flex:1, padding:"8px 10px", borderRadius:"9px", border:"1.5px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.03)", color:"#e2e8f0", fontSize:"12px", fontFamily:"'DM Sans',sans-serif", outline:"none" }} />
                </div>
                <Btn onClick={startCrop} disabled={!hasImage} variant="primary" full>{I.Crop} Start Crop</Btn>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", padding: "10px 12px", background: "rgba(245,158,11,0.08)", borderRadius: "10px", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b", animation: "pulse 1s infinite" }} />
                  <span style={{ fontSize: "12px", color: "#f59e0b", fontFamily: "'DM Sans',sans-serif", fontWeight: "600" }}>Crop mode active</span>
                </div>
                <SecLabel>Aspect Ratio</SecLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                  {ASPECT_RATIOS.map(ar => <Tag key={ar.label} label={ar.label} active={activeRatio === ar.label} onClick={() => setAspect(ar)} />)}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Btn onClick={doneCrop}   variant="success" full sm>{I.Check} Apply</Btn>
                  <Btn onClick={cancelCrop} variant="danger"  full sm>{I.Close} Cancel</Btn>
                </div>
              </>
            )}
          </div>
        )}

        {/* TRANSFORM */}
        {activeTab === "Transform" && (
          <div>
            <SecLabel>Rotate</SecLabel>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {[[-1, "↺ −90°", I.RotL], [1, "↻ +90°", I.RotR]].map(([dir, lbl, ico]) => (
                <button key={lbl} onClick={() => rotate(dir)} disabled={!hasImage} style={{
                  flex: 1, padding: "14px 0", borderRadius: "12px",
                  border: "1.5px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)",
                  color: "#4b5563", cursor: hasImage ? "pointer" : "not-allowed", opacity: hasImage ? 1 : 0.3,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: "600", transition: "all 0.15s",
                }}>
                  {ico}<span>{lbl}</span>
                </button>
              ))}
            </div>
            <SecLabel>Flip</SecLabel>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {[["x", "Horizontal", I.FlipH, flipX], ["y", "Vertical", I.FlipV, flipY]].map(([ax, lbl, ico, fv]) => (
                <button key={ax} onClick={() => flip(ax)} disabled={!hasImage} style={{
                  flex: 1, padding: "14px 0", borderRadius: "12px",
                  border: fv === -1 ? "1.5px solid #f59e0b" : "1.5px solid rgba(255,255,255,0.07)",
                  background: fv === -1 ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                  color: fv === -1 ? "#f59e0b" : "#4b5563",
                  cursor: hasImage ? "pointer" : "not-allowed", opacity: hasImage ? 1 : 0.3,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: "600", transition: "all 0.15s",
                }}>
                  {ico}<span>{lbl}</span>
                </button>
              ))}
            </div>
            <SecLabel>Zoom</SecLabel>
            <AdjSlider adj={{ key: "zoom", label: "Zoom Level", icon: "🔍", min: 0.2, max: 3, default: 1, unit: "×" }} value={zoom} onChange={v => setZoom(v)} disabled={!hasImage} />
          </div>
        )}

        {/* DETAILS */}
        {activeTab === "Details" && (
          <div>
            <SecLabel>Text Overlay</SecLabel>
            <TextPanel texts={texts} setTexts={setTexts} />
            {hasImage && (
              <>
                <Div />
                <SecLabel>Image Info</SecLabel>
                {[["File", fileName || "—"], ["Size", `${imgNatural.w} × ${imgNatural.h}px`], ["Rotation", `${rotation}°`], ["Flip H/V", `${flipX === -1 ? "Yes" : "No"} / ${flipY === -1 ? "Yes" : "No"}`], ["Modified", isModified ? "✓ Yes" : "No"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{ fontSize: "12px", color: "#374151", fontFamily: "'DM Sans',sans-serif" }}>{k}</span>
                    <span style={{ fontSize: "12px", color: k === "Modified" && isModified ? "#f59e0b" : "#9ca3af", fontFamily: "'DM Sans',sans-serif", fontWeight: "500", maxWidth: "140px", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: "7px", flexShrink: 0, background: "#0c0e16" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <Btn onClick={undo} disabled={!canUndo} variant="ghost" full sm>{I.Undo} Undo</Btn>
          <Btn onClick={redo} disabled={!canRedo} variant="ghost" full sm>{I.Redo} Redo</Btn>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <Btn onClick={resetAll} disabled={!hasImage} variant="danger" full sm>{I.Reset} Reset</Btn>
          <Btn onClick={handleSave} disabled={!hasImage || isCropping} variant="primary" full sm>{I.Save} Export</Btn>
        </div>
      </div>
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;} body{margin:0;background:#0c0e16;font-family:'DM Sans',sans-serif;overflow:hidden;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(245,158,11,0.15);border-radius:2px;}
        input[type=number]::-webkit-inner-spin-button{opacity:0.4;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .pc-drop:hover{border-color:rgba(245,158,11,0.5)!important;background:rgba(245,158,11,0.06)!important;}
      `}</style>

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0c0e16" }}>

        {/* ══════ TOPBAR ══════ */}
        <header style={{ height: "52px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(12,14,22,0.97)", backdropFilter: "blur(16px)", zIndex: 100 }}>

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isMobile && <IBtn onClick={() => setSidebarOpen(o => !o)} sz={34}>{I.Menu}</IBtn>}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>✦</div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "17px", fontWeight: "800", background: "linear-gradient(135deg,#d97706,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>PixelCraft</span>
            </div>
            {!isMobile && fileName && (
              <span style={{ fontSize: "12px", color: "#1f2937", fontFamily: "'DM Sans',sans-serif", marginLeft: "4px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>— {fileName}</span>
            )}
          </div>

          {/* Center toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IBtn onClick={undo} disabled={!canUndo} title="Undo" sz={32}>{I.Undo}</IBtn>
            <IBtn onClick={redo} disabled={!canRedo} title="Redo" sz={32}>{I.Redo}</IBtn>
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.06)", margin: "0 3px" }} />
            <IBtn onClick={() => setZoom(z => Math.min(3, +(z + 0.15).toFixed(2)))} disabled={!hasImage} title="Zoom In"  sz={32}>{I.ZoomIn}</IBtn>
            <IBtn onClick={() => setZoom(z => Math.max(0.2, +(z - 0.15).toFixed(2)))} disabled={!hasImage} title="Zoom Out" sz={32}>{I.ZoomOut}</IBtn>
            <IBtn onClick={() => setZoom(1)} disabled={!hasImage} title="Fit 100%" sz={32}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            </IBtn>
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.06)", margin: "0 3px" }} />
            <IBtn
              active={showBefore}
              onMouseDown={() => setShowBefore(true)} onMouseUp={() => setShowBefore(false)}
              onMouseLeave={() => setShowBefore(false)} onTouchStart={() => setShowBefore(true)} onTouchEnd={() => setShowBefore(false)}
              onClick={() => {}} disabled={!hasImage} title="Hold to compare" sz={32}
            >{I.Compare}</IBtn>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Btn onClick={() => fileRef.current.click()} variant="outline" sm>
              {I.Upload} {!isMobile && "Open"}
            </Btn>
            <button
              onClick={handleSave} disabled={!hasImage || isCropping}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 15px", borderRadius: "9px", border: "none", background: hasImage && !isCropping ? "linear-gradient(135deg,#d97706,#f59e0b)" : "rgba(217,119,6,0.15)", color: hasImage && !isCropping ? "#111" : "#374151", fontSize: "12.5px", fontWeight: "700", fontFamily: "'DM Sans',sans-serif", cursor: hasImage && !isCropping ? "pointer" : "not-allowed", transition: "all 0.2s", letterSpacing: "0.2px" }}
            >
              {I.Save} {!isMobile && "Export PNG"}
            </button>
          </div>
        </header>

        {/* ══════ BODY ══════ */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

          {/* ── Desktop sidebar ── */}
          {!isMobile && (
            <aside style={{ width: "265px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.04)", background: "#0e1018", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <SidebarContent />
            </aside>
          )}

          {/* ── Mobile sidebar overlay ── */}
          {isMobile && sidebarOpen && (
            <div style={{ position: "absolute", inset: 0, zIndex: 200, display: "flex" }} onClick={e => e.target === e.currentTarget && setSidebarOpen(false)}>
              <aside style={{ width: "275px", background: "#0e1018", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideIn 0.22s ease", boxShadow: "4px 0 30px rgba(0,0,0,0.6)" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 12px 0" }}>
                  <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: "4px", display: "flex" }}>{I.Close}</button>
                </div>
                <SidebarContent />
              </aside>
              <div style={{ flex: 1, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={() => setSidebarOpen(false)} />
            </div>
          )}

          {/* ══════ CANVAS ══════ */}
          <main
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "#0c0e16" }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            {/* Before label */}
            {showBefore && hasImage && (
              <div style={{ position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)", zIndex: 10, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", borderRadius: "20px", padding: "5px 16px", fontSize: "11px", fontWeight: "700", color: "#f59e0b", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
                BEFORE
              </div>
            )}

            {/* Crop badge */}
            {isCropping && (
              <div style={{ position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "20px", padding: "6px 16px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b", animation: "pulse 1s infinite" }} />
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#f59e0b", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.5px" }}>Crop Mode — use sidebar to confirm</span>
              </div>
            )}

            {!hasImage ? (
              /* ── Drop zone ── */
              <div
                className="pc-drop"
                onClick={() => fileRef.current.click()}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px", padding: "56px 48px", borderRadius: "24px", border: "2px dashed rgba(245,158,11,0.15)", background: "rgba(245,158,11,0.02)", cursor: "pointer", transition: "all 0.2s", maxWidth: "360px", textAlign: "center", animation: "fadeUp 0.4s ease" }}
              >
                <div style={{ width: "76px", height: "76px", borderRadius: "22px", background: "rgba(245,158,11,0.08)", border: "1.5px solid rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div>
                  <p style={{ color: "#9ca3af", fontSize: "16px", fontWeight: "600", fontFamily: "'DM Sans',sans-serif", margin: "0 0 7px" }}>Drop your image here</p>
                  <p style={{ color: "#1f2937", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", margin: "0 0 5px" }}>or click to browse files</p>
                  <p style={{ color: "#111827", fontSize: "11px", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>PNG · JPG · WEBP · GIF</p>
                </div>
                <div style={{ padding: "7px 16px", borderRadius: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.15)", fontSize: "12px", color: "#d97706", fontFamily: "'DM Sans',sans-serif", fontWeight: "600" }}>
                  Choose File
                </div>
              </div>
            ) : (
              /* ── Image canvas ── */
              <div style={{ position: "relative", maxWidth: "100%", maxHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  ref={imgRef}
                  src={showBefore ? origSrc : imageSrc}
                  alt="editing"
                  style={{
                    maxWidth: isMobile ? "100vw" : "calc(100vw - 280px)",
                    maxHeight: "calc(100vh - 52px - 16px)",
                    objectFit: "contain",
                    filter: showBefore ? "none" : filterStr,
                    transform: isCropping ? "none" : transformStr,
                    transition: "filter 0.25s, transform 0.25s",
                    display: "block",
                    borderRadius: "4px",
                  }}
                  onLoad={e => setImgNatural({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
                />
                {/* Vignette */}
                {adj.vignette > 0 && !isCropping && !showBefore && (
                  <div style={{ position: "absolute", inset: 0, background: vigGrad, borderRadius: "4px", pointerEvents: "none" }} />
                )}
                {/* Text overlays */}
                {texts.map(t => (
                  <div key={t.id} style={{ position: "absolute", left: `${t.x}%`, top: `${t.y}%`, transform: "translate(-50%,-50%)", color: t.color, fontSize: `${t.size}px`, fontFamily: "'DM Sans',sans-serif", fontWeight: "700", textShadow: "0 2px 10px rgba(0,0,0,0.9)", pointerEvents: "none", whiteSpace: "nowrap" }}>
                    {t.text}
                  </div>
                ))}
              </div>
            )}

            {/* ── Status badge ── */}
            {hasImage && (
              <div style={{ position: "absolute", bottom: "12px", right: "12px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", borderRadius: "9px", padding: "5px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "11px", color: "#374151", fontFamily: "'DM Sans',sans-serif" }}>{Math.round(zoom * 100)}%</span>
                <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.06)" }} />
                <span style={{ fontSize: "11px", color: "#374151", fontFamily: "'DM Sans',sans-serif" }}>{imgNatural.w}×{imgNatural.h}</span>
                {isModified && <>
                  <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b" }} />
                  <span style={{ fontSize: "11px", color: "#f59e0b", fontFamily: "'DM Sans',sans-serif", fontWeight: "600" }}>Edited</span>
                </>}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Hidden input */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </>
  );
}