// src/components/editor/PanelLayout.jsx
// Shared tab content renderer + Desktop Sidebar + Mobile Panel

import { TABS, TAB_ICONS, DEFAULT_ADJ } from '../../constants';
import { Btn, SL, HDivider } from '../ui';
import { IC } from '../../constants/icons';
import {
  LightPanel, ColorPanel, DetailPanel, EffectsPanel, FiltersPanel,
  CropPanel, TransformPanel, TextPanel, ExportPanel,
} from '../panels';

// ═══════════════════════════════════════════════════════════
// TAB CONTENT — shared between desktop sidebar & mobile panel
// ═══════════════════════════════════════════════════════════
function TabContent({ tab, state, isMobile }) {
  const {
    adj, changeAdj, commitAdj, hasImage, isCropping,
    activeFilter, applyPreset, imageSrc,
    activeRatio, setAspectRatio, startCrop, doneCrop, cancelCrop,
    cropW, setCropW, cropH, setCropH,
    tx, setZoom, rotate, flip, setStraighten, commitStraighten,
    texts, setTexts, stickers, setStickers,
    frame, setFrame,
    exportFmt, setExportFmt, exportQuality, setExportQuality,
    exportScale, setExportScale,
    imgNatural, fileName, isSaving, handleSave,
  } = state;

  const disabled = !hasImage || isCropping;

  switch (tab) {
    case 'Light':
      return <LightPanel adj={adj} onChange={changeAdj} onCommit={commitAdj} disabled={disabled} />;

    case 'Color':
      return <ColorPanel adj={adj} onChange={changeAdj} onCommit={commitAdj} disabled={disabled} />;

    case 'Detail':
      return <DetailPanel adj={adj} onChange={changeAdj} onCommit={commitAdj} disabled={disabled} />;

    case 'Effects':
      return <EffectsPanel adj={adj} onChange={changeAdj} onCommit={commitAdj} disabled={disabled} />;

    case 'Filters':
      return (
        <FiltersPanel
          activeFilter={activeFilter} applyPreset={applyPreset}
          imageSrc={imageSrc} hasImage={hasImage} isMobile={isMobile}
        />
      );

    case 'Crop':
      return (
        <CropPanel
          isCropping={isCropping} hasImage={hasImage}
          activeRatio={activeRatio} setAspectRatio={setAspectRatio}
          cropW={cropW} setCropW={setCropW} cropH={cropH} setCropH={setCropH}
          startCrop={startCrop} doneCrop={doneCrop} cancelCrop={cancelCrop}
        />
      );

    case 'Transform':
      return (
        <TransformPanel
          tx={tx} setZoom={setZoom} rotate={rotate} flip={flip}
          hasImage={hasImage} setStraighten={setStraighten} commitStraighten={commitStraighten}
        />
      );

    case 'Text':
      return (
        <TextPanel
          texts={texts} setTexts={setTexts}
          stickers={stickers} setStickers={setStickers}
          hasImage={hasImage}
        />
      );

    case 'Export':
      return (
        <ExportPanel
          exportFmt={exportFmt} setExportFmt={setExportFmt}
          exportQuality={exportQuality} setExportQuality={setExportQuality}
          exportScale={exportScale} setExportScale={setExportScale}
          imgNatural={imgNatural} fileName={fileName}
          hasImage={hasImage} isSaving={isSaving} handleSave={handleSave}
          frame={frame} setFrame={setFrame}
        />
      );

    default: return null;
  }
}

// ═══════════════════════════════════════════════════════════
// DESKTOP SIDEBAR
// ═══════════════════════════════════════════════════════════
export function Sidebar({ activeTab, setActiveTab, state }) {
  const { canUndo, canRedo, undo, redo, resetAll, handleSave, hasImage, isCropping, isSaving } = state;

  return (
    <aside className="pc-sidebar">
      {/* Tabs */}
      <div className="pc-sidebar__tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`pc-sidebar__tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pc-sidebar__content">
        <TabContent tab={activeTab} state={state} isMobile={false} />
      </div>

      {/* Footer */}
      <div className="pc-sidebar__footer">
        <div style={{ display: 'flex', gap: '7px' }}>
          <Btn onClick={undo} disabled={!canUndo} variant="ghost" full size="sm">{IC.Undo} Undo</Btn>
          <Btn onClick={redo} disabled={!canRedo} variant="ghost" full size="sm">{IC.Redo} Redo</Btn>
        </div>
        <div style={{ display: 'flex', gap: '7px' }}>
          <Btn onClick={resetAll}   disabled={!hasImage}                 variant="danger"   full size="sm">{IC.Reset} Reset</Btn>
          <Btn onClick={handleSave} disabled={!hasImage || isCropping || isSaving} variant="primary" full size="sm">
            {isSaving ? '⏳' : IC.Save} Export
          </Btn>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════
// MOBILE PANEL (Lightroom style — bottom of screen)
// ═══════════════════════════════════════════════════════════
export function MobilePanel({ activeTab, setActiveTab, state }) {
  const { canUndo, canRedo, undo, redo, resetAll, handleSave, hasImage, isCropping, isSaving } = state;

  return (
    <div className="pc-mobile-panel">
      {/* Quick action row */}
      <div className="pc-mobile-actions">
        <Btn onClick={undo} disabled={!canUndo} variant="ghost" size="sm">{IC.Undo}</Btn>
        <Btn onClick={redo} disabled={!canRedo} variant="ghost" size="sm">{IC.Redo}</Btn>
        <div style={{ flex: 1 }} />
        <Btn onClick={resetAll}   disabled={!hasImage}                          variant="danger"  size="sm">{IC.Reset}</Btn>
        <Btn onClick={handleSave} disabled={!hasImage || isCropping || isSaving} variant="primary" size="sm">
          {isSaving ? '⏳' : IC.Save} Save
        </Btn>
      </div>

      {/* Tab content — scrollable */}
      <div className="pc-mobile-content">
        <TabContent tab={activeTab} state={state} isMobile={true} />
      </div>

      {/* Bottom tab bar — horizontal scroll */}
      <div className="pc-mobile-tabhint">Swipe for more tools →</div>
      <nav className="pc-mobile-tabbar">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`pc-mtab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="pc-mtab__ico">{TAB_ICONS[tab]}</span>
            <span className="pc-mtab__lbl">{tab}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}