'use client'
import { useState } from 'react'
import { STRATEGIC_ASSETS_US, STRATEGIC_ASSETS_IDF, STRATEGIC_ASSETS_IRAN } from '@/lib/constants'
import { Flag } from '@/components/ui/Flag'

type FactionType = 'USA' | 'IDF' | 'IRAN'

const FACTION_COLORS: Record<FactionType, string> = {
  USA: '#2196f3', IDF: '#00e676', IRAN: '#ff5722'
}

const STATUS_COLORS: Record<string, string> = {
  'ACTIVE OPS': '#ff2d2d', 'ACTIVE OPS over Iran': '#ff2d2d', 'ACTIVE OPS — Iran strikes': '#ff2d2d',
  'AIRBORNE': '#2196f3', STANDBY: '#7f8c9b', DEPLOYED: '#ffc107',
  'ACTIVE ROTATIONS': '#ff6b35', ACTIVE: '#ffc107', 'OPERATIONAL — engaging': '#00e676',
  'FULLY DEPLOYED': '#00e676', 'OPERATIONAL': '#00e676',
  'ACTIVELY LAUNCHING — 3rd wave prep': '#ff2d2d', DEPLETING: '#ff6b35', 'LIMITED STOCK': '#ff6b35',
  'GROUNDED (parts unavailable)': '#4a6a7a', 'PATROL — Persian Gulf': '#ffc107',
  'STRAIT OF HORMUZ — swarm ready': '#ff6b35', 'ACTIVE — South Lebanon front': '#ff2d2d',
  'ACTIVE — Red Sea/Yemen': '#ff2d2d', 'WATCH — potential activation': '#ffc107',
  '1+ DEPLOYED eastern Med': '#ffc107',
}

export default function StrategicAssets() {
  const [faction, setFaction] = useState<FactionType>('USA')

  const assets = faction === 'USA' ? STRATEGIC_ASSETS_US
    : faction === 'IDF' ? STRATEGIC_ASSETS_IDF
    : STRATEGIC_ASSETS_IRAN

  const usa_assets = STRATEGIC_ASSETS_US as Array<{ name: string; type: string; location?: string; status: string; assets?: string; note?: string }>
  const idf_assets = STRATEGIC_ASSETS_IDF as Array<{ name: string; type: string; status: string; note?: string }>
  const iran_assets = STRATEGIC_ASSETS_IRAN as Array<{ name: string; type: string; status: string; note?: string }>

  type AssetItem = { name: string; type: string; location?: string; status: string; assets?: string; note?: string }
  const displayAssets = (faction === 'USA' ? usa_assets : faction === 'IDF' ? idf_assets : iran_assets) as AssetItem[]

  return (
    <div className="flex flex-col h-full">
      {/* Faction tabs */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: '#1e2d3d' }}>
        {(['USA', 'IDF', 'IRAN'] as FactionType[]).map(f => (
          <button
            key={f}
            onClick={() => setFaction(f)}
            className="font-military text-[9px] px-3 py-1.5 flex-1 transition-colors"
            style={{
              color: faction === f ? FACTION_COLORS[f] : '#4a6a7a',
              backgroundColor: faction === f ? `${FACTION_COLORS[f]}15` : 'transparent',
              borderBottom: faction === f ? `1px solid ${FACTION_COLORS[f]}` : 'none',
            }}
          >
            <span className="inline-flex items-center gap-1">
              <Flag iso={f === 'USA' ? 'us' : f === 'IDF' ? 'il' : 'ir'} size={13} />
              {f}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {displayAssets.map((asset, idx) => (
          <div key={idx} className="border-b p-2" style={{ borderColor: '#1e2d3d' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-military text-[10px] truncate" style={{ color: FACTION_COLORS[faction] }}>
                  {asset.name}
                </div>
                <div className="font-mono-data text-[8px]" style={{ color: '#4a6a7a' }}>
                  {asset.type}
                  {'location' in asset && asset.location ? ` | ${asset.location}` : ''}
                </div>
                {'assets' in asset && asset.assets ? (
                  <div className="font-mono-data text-[8px] mt-0.5" style={{ color: '#7f8c9b' }}>{asset.assets}</div>
                ) : null}
                {'note' in asset && asset.note ? (
                  <div className="font-mono-data text-[8px] mt-0.5" style={{ color: '#7f8c9b' }}>{asset.note}</div>
                ) : null}
              </div>
              <span
                className="font-military text-[7px] border px-1 py-0.5 flex-shrink-0 whitespace-nowrap"
                style={{
                  color: STATUS_COLORS[asset.status] || '#7f8c9b',
                  borderColor: `${STATUS_COLORS[asset.status] || '#7f8c9b'}50`,
                }}
              >
                {asset.status.length > 18 ? asset.status.slice(0, 15) + '...' : asset.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
