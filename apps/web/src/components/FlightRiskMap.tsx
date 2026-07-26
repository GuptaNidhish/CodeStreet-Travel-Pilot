'use client';

import { MapPin, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface MapProps {
  airports?: { code: string; name: string; status: string; riskScore: number }[];
}

export function FlightRiskMap({ airports = [] }: MapProps) {
  const defaultAirports = [
    { code: 'JFK', name: 'New York JFK', status: 'ON_TIME', riskScore: 10, x: '75%', y: '35%' },
    { code: 'ORD', name: 'Chicago O\'Hare', status: 'DISRUPTED', riskScore: 90, x: '60%', y: '33%' },
    { code: 'LAX', name: 'Los Angeles', status: 'ON_TIME', riskScore: 15, x: '20%', y: '50%' },
    { code: 'SFO', name: 'San Francisco', status: 'DELAYED', riskScore: 65, x: '16%', y: '42%' },
    { code: 'LHR', name: 'London Heathrow', status: 'ON_TIME', riskScore: 25, x: '90%', y: '25%' },
  ];

  return (
    <div className="p-5 rounded-2xl glass-panel border border-indigo-500/20 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-400" />
          Global Flight Disruption Heatmap
        </h3>
        <span className="text-xs text-gray-400">Live Airport Operational Risk</span>
      </div>

      {/* Styled Interactive Map Canvas Mock */}
      <div className="relative w-full h-64 rounded-xl bg-slate-950/80 border border-gray-800 overflow-hidden flex items-center justify-center">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        {/* Airport Pins */}
        {defaultAirports.map((ap) => {
          const isHighRisk = ap.riskScore >= 70;
          const isMedRisk = ap.riskScore >= 40 && ap.riskScore < 70;

          return (
            <div
              key={ap.code}
              style={{ left: ap.x, top: ap.y }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                {isHighRisk && (
                  <span className="absolute w-8 h-8 rounded-full bg-rose-500/40 animate-ping" />
                )}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-lg border ${
                    isHighRisk
                      ? 'bg-rose-600 border-rose-400'
                      : isMedRisk
                      ? 'bg-amber-600 border-amber-400'
                      : 'bg-emerald-600 border-emerald-400'
                  }`}
                >
                  {ap.code}
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-40 p-2 rounded-xl glass-panel border border-gray-700 text-[11px] text-white z-20 shadow-2xl pointer-events-none">
                <div className="font-bold flex items-center justify-between">
                  <span>{ap.name}</span>
                  <span className={isHighRisk ? 'text-rose-400' : 'text-emerald-400'}>{ap.riskScore}%</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Status: {ap.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
