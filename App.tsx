import React, { useState, useEffect } from 'react';
import { NavigationTab } from './types';
import { GeneratedMediaItem } from './media';
import { SHOWCASE_GALLERY } from './mediaData';
import { Header } from './Header';
import { Footer } from './Footer';
import { StudioView } from './StudioView';
import { CanvasInspectorView } from './CanvasInspectorView';
import { ArchitectureView } from './ArchitectureView';
import { SpecificationView } from './SpecificationView';
import { MotionBrushView } from './MotionBrushView';
import { ShowcaseGalleryView } from './ShowcaseGalleryView';
import { VaultHistoryView } from './VaultHistoryView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('studio');
  const [technicalMode, setTechnicalMode] = useState<boolean>(true);
  const [selectedMediaForInspect, setSelectedMediaForInspect] = useState<GeneratedMediaItem>(
    SHOWCASE_GALLERY[0]
  );
  const [latestGenerated, setLatestGenerated] = useState<GeneratedMediaItem | null>(
    SHOWCASE_GALLERY[0]
  );
  const [vaultHistory, setVaultHistory] = useState<GeneratedMediaItem[]>([]);

  // Load saved vault history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aetheris_media_vault');
      if (stored) {
        setVaultHistory(JSON.parse(stored));
      } else {
        setVaultHistory(SHOWCASE_GALLERY);
      }
    } catch (e) {
      console.error('Failed to load vault history from localStorage', e);
      setVaultHistory(SHOWCASE_GALLERY);
    }
  }, []);

  // Save to history helper
  const handleSaveToVault = (item: GeneratedMediaItem) => {
    setVaultHistory((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      const updated = exists ? prev : [item, ...prev].slice(0, 50);
      try {
        localStorage.setItem('aetheris_media_vault', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const handleDeleteVaultItem = (id: string) => {
    setVaultHistory((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem('aetheris_media_vault', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleToggleFavorite = (id: string) => {
    setVaultHistory((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
      try {
        localStorage.setItem('aetheris_media_vault', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleUpdateVaultItem = (updatedItem: GeneratedMediaItem) => {
    setVaultHistory((prev) => {
      const exists = prev.some((p) => p.id === updatedItem.id);
      const nextList = exists
        ? prev.map((p) => (p.id === updatedItem.id ? updatedItem : p))
        : [updatedItem, ...prev].slice(0, 50);
      try {
        localStorage.setItem('aetheris_media_vault', JSON.stringify(nextList));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return nextList;
    });
    if (latestGenerated?.id === updatedItem.id) {
      setLatestGenerated(updatedItem);
    }
    if (selectedMediaForInspect?.id === updatedItem.id) {
      setSelectedMediaForInspect(updatedItem);
    }
  };

  const handleSelectForInspect = (item: GeneratedMediaItem) => {
    setSelectedMediaForInspect(item);
    setActiveTab('canvas');
  };

  const handleLoadIntoStudio = (item: GeneratedMediaItem) => {
    setLatestGenerated(item);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        technicalMode={technicalMode}
        setTechnicalMode={setTechnicalMode}
      />

      <main className="flex-1">
        {activeTab === 'studio' && (
          <StudioView
            technicalMode={technicalMode}
            onSelectMediaForInspect={handleSelectForInspect}
            onSaveToVault={handleSaveToVault}
            latestGenerated={latestGenerated}
            setLatestGenerated={setLatestGenerated}
          />
        )}

        {activeTab === 'canvas' && (
          <CanvasInspectorView
            item={selectedMediaForInspect}
            onBackToStudio={() => setActiveTab('studio')}
            onScheduleItem={handleUpdateVaultItem}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'specification' && <SpecificationView />}

        {activeTab === 'motion_brush' && <MotionBrushView />}

        {activeTab === 'gallery' && (
          <ShowcaseGalleryView
            onSelectForInspect={handleSelectForInspect}
            onLoadIntoStudio={handleLoadIntoStudio}
          />
        )}

        {activeTab === 'history' && (
          <VaultHistoryView
            history={vaultHistory}
            onSelectForInspect={handleSelectForInspect}
            onDeleteItem={handleDeleteVaultItem}
            onToggleFavorite={handleToggleFavorite}
            onUpdateItem={handleUpdateVaultItem}
          />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
