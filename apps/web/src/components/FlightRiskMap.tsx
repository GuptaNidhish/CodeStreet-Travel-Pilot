'use client';

import { MapPin, ShieldCheck, AlertTriangle } from 'lucide-react';

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
    <div className="p-5 brutalist-card space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-white uppercase flex items-center gap-2 tracking-wide">
          <MapPin className="w-4 h-4 text-[#006FCF]" />
          GLOBAL DISRUPTION HEATMAP
        </h3>
        <span className="text-[10px] text-slate-400 font-bold uppercase">LIVE RISK SENSORS</span>
      </div>

      {/* Styled Interactive Map Canvas Mock */}
      <div className="relative w-full h-64 bg-[#04060b] border-2 border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />

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
                  <span className="absolute w-8 h-8 rounded-full bg-[#FF1744]/40 animate-ping" />
                )}
                <div
                  className={`w-7 h-7 flex items-center justify-center text-[10px] font-black font-mono text-white shadow-[2px_2px_0px_0px_#000] border-2 ${
                    isHighRisk
                      ? 'bg-[#FF1744] border-black'
                      : isMedRisk
                      ? 'bg-[#C5A059] text-black border-black'
                      : 'bg-[#00E676] text-black border-black'
                  }`}
                >
                  {ap.code}
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-44 p-2 bg-[#080c14] border-2 border-[#006FCF] shadow-[3px_3px_0px_0px_#000] text-[10px] text-white z-30 pointer-events-none font-mono">
                <div className="font-black flex items-center justify-between uppercase">
                  <span>{ap.name}</span>
                  <span className={isHighRisk ? 'text-[#FF1744]' : 'text-[#00E676]'}>{ap.riskScore}%</span>
                </div>
                <div className="text-[9px] text-slate-400 mt-1 uppercase font-bold">STATUS: {ap.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
