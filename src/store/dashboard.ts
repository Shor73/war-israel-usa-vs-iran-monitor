'use client'
import { create } from 'zustand'
import type { DashboardState, AgencyType } from '@/lib/types'

interface DashboardStore extends DashboardState {
  toggleSound: () => void
  openNuclearWatch: () => void
  closNuclearWatch: () => void
  openBrief: () => void
  closeBrief: () => void
  setAgencyFilter: (agency: AgencyType) => void
  setNewsCategory: (cat: string) => void
  toggleMapLayer: (layer: keyof DashboardState['mapLayers']) => void
  setActivePanel: (panel: string | null) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  threatLevel: 'CRITICAL',
  defcon: 2,
  fpcon: 'CHARLIE',
  activeTheater: 'CENTCOM',
  soundEnabled: false,
  activePanel: null,
  nuclearWatchOpen: false,
  briefOpen: false,
  agencyFilter: 'ALL',
  newsCategory: 'ALL',
  mapLayers: {
    usaBases: true,
    idfBases: true,
    irgcSites: false,
    nuclearSites: true,
    missileArcs: true,
    ironDome: true,
    carriers: true,
    noFlyZones: true,
    pipelines: false,
    chokepoints: true,
  },

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  openNuclearWatch: () => set({ nuclearWatchOpen: true }),
  closNuclearWatch: () => set({ nuclearWatchOpen: false }),
  openBrief: () => set({ briefOpen: true }),
  closeBrief: () => set({ briefOpen: false }),
  setAgencyFilter: (agency) => set({ agencyFilter: agency }),
  setNewsCategory: (cat) => set({ newsCategory: cat }),
  toggleMapLayer: (layer) => set((s) => ({
    mapLayers: { ...s.mapLayers, [layer]: !s.mapLayers[layer] }
  })),
  setActivePanel: (panel) => set({ activePanel: panel }),
}))
