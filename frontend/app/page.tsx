"use client";

import { useEffect, useState, useRef } from "react";
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  FireIcon,
  UsersIcon,
  MapPinIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellAlertIcon,
  HandRaisedIcon
} from '@heroicons/react/24/solid';

interface Session {
  session_id: string;
  status: string;
  description: string;
  notify_to: string;
  created_at: string;
  video_url: string;
  live_url: string;
  camera_id: string;
  latitude: string;
  longitude: string;
  severity: "Critical" | "Warning" | "Informational" | "Normal";
  confidence: string;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Poll for data
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8002/sessions");
      if (res.ok) {
        const data: Session[] = await res.json();
        // Sort by newest first
        const sorted = data.reverse();

        // Show only pending sessions, max 4
        const pendingSessions = sorted.filter(s => s.status === 'pending').slice(0, 4);

        setSessions(pendingSessions);

        // Auto-select the first session if none selected or if selected is locally approved/rejected (not in list anymore)
        if (!selectedSession || (selectedSession && selectedSession.status !== 'pending')) {
          if (pendingSessions.length > 0) {
            setSelectedSession(pendingSessions[0]);
          } else {
            setSelectedSession(null);
          }
        } else if (selectedSession) {
          // If selected session is still pending, make sure it's in the list? 
          // Actually if it's not in the top 4, it might disappear from view but still be selected.
          // But for now, let's keep it simple.
          const exists = pendingSessions.find(s => s.session_id === selectedSession.session_id);
          if (!exists && pendingSessions.length > 0) {
            setSelectedSession(pendingSessions[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // 3s polling
    return () => clearInterval(interval);
  }, []);

  // Action Handlers
  const handleAction = async (e: React.MouseEvent, sessionId: string, action: 'approve' | 'reject') => {
    e.stopPropagation(); // Prevent card selection when clicking buttons
    if (!sessionId) return;

    try {
      const res = await fetch(`http://localhost:8002/session/${sessionId}/${action}`, {
        method: 'POST'
      });

      if (res.ok) {
        // Update local state immediately
        const updatedStatus = action === 'approve' ? 'approved' : 'rejected';

        setSessions(prev => prev.map(s =>
          s.session_id === sessionId ? { ...s, status: updatedStatus } : s
        ));

        if (selectedSession?.session_id === sessionId) {
          setSelectedSession(prev => prev ? { ...prev, status: updatedStatus } : null);
        }
      } else {
        console.error(`Failed to ${action} session`);
      }
    } catch (err) {
      console.error(`Error in ${action}:`, err);
    }
  };

  // Helper to get Icon based on description/type
  const getIconForSession = (desc: string) => {
    if (desc.toLowerCase().includes("fire")) return <FireIcon className="w-6 h-6 text-orange-500" />;
    if (desc.toLowerCase().includes("violence") || desc.toLowerCase().includes("weapon")) return <HandRaisedIcon className="w-6 h-6 text-red-600" />;
    if (desc.toLowerCase().includes("crowd") || desc.toLowerCase().includes("stampede")) return <UsersIcon className="w-6 h-6 text-amber-500" />; // Stampede/Crowd
    return <ExclamationTriangleIcon className="w-6 h-6 text-gray-500" />;
  };

  // Helper for Severity Color
  const getSeverityColor = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'bg-red-600';
      case 'warning': return 'bg-orange-500';
      case 'informational': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* Top Navigation / Status Bar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Crowd Shield</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">SAFETY MONITOR</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM ONLINE
          </div>

          <div className="flex gap-2">
            {['All', 'Fire', 'Violence', 'Stampede'].map(filter => (
              <button key={filter} className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-100">
            <BellAlertIcon className="w-4 h-4" />
            <span className="text-xs font-bold">CRITICAL ALERTS ({sessions.filter(s => s.severity === 'Critical').length})</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">

        {/* Horizontal Alert Cards Scroll */}
        <section className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex gap-4 min-w-max">
            {sessions.map(session => (
              <div
                key={session.session_id}
                onClick={() => setSelectedSession(session)}
                className={`w-96 bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between shrink-0 ${selectedSession?.session_id === session.session_id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white shadow-sm'
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      {getIconForSession(session.description)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{session.description.split(':')[0] || "Alert"}</h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {session.camera_id} - Zone A
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">
                        {session.created_at?.split(' ')[1] || "00:00"} UTC
                      </p>
                    </div>
                  </div>
                  <span className={`${getSeverityColor(session.severity)} text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded`}>
                    {session.severity || "NORMAL"}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2 mt-2">
                  <div className="text-xs font-medium text-gray-600">Match Confidence</div>
                  <div className="text-sm font-bold text-gray-900">{session.confidence || "N/A"}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">

                  <button
                    onClick={(e) => handleAction(e, session.session_id, 'approve')}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-colors ${session.status === 'approved' ? 'bg-green-100 text-green-700 cursor-default' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    disabled={session.status === 'approved' || session.status === 'rejected'}
                  >
                    <CheckCircleIcon className="w-4 h-4" /> {session.status === 'approved' ? 'APPROVED' : 'APPROVE'}
                  </button>
                  <button
                    onClick={(e) => handleAction(e, session.session_id, 'reject')}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-colors ${session.status === 'rejected' ? 'bg-red-100 text-red-700 cursor-default' : 'bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600'}`}
                    disabled={session.status === 'approved' || session.status === 'rejected'}
                  >
                    <XCircleIcon className="w-4 h-4" /> {session.status === 'rejected' ? 'REJECTED' : 'REJECT'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Main Interface Grid */}
        <section className="grid grid-cols-12 gap-6 h-[900px]">

          {/* Live Feed (Spans Full Width of Top Row if we wanted, but sticking to requested layout) 
                Wait, prompt said Middle Section is Live Feed. But usually dashboard has hierarchical view. 
                Let's make the Top 2/3rds the Live Feed and Bottom 1/3rd split between Clip and Details.
            */}

          <div className="col-span-12 h-[65%] relative group bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            {selectedSession ? (
              <>
                <img
                  src={selectedSession.live_url}
                  className="w-full h-full object-cover"
                  alt="Live Feed"
                />

                {/* Overlay Controls */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-bold tracking-wider animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    LIVE FEED
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm text-gray-200 px-3 py-1 rounded text-xs font-mono border border-white/10 uppercase">
                    {selectedSession.camera_id} - MAIN PLAZA
                  </div>
                </div>

                <div className="absolute top-6 right-6 flex gap-2">
                  <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white border border-white/20 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> AI: ON
                  </div>
                  <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white border border-white/20">
                    4K • 60FPS
                  </div>
                </div>



              </>
            ) : (
              // Default View (No Incident Selected) - Show Camera 1 Feed
              <div className="w-full h-full relative">
                <img
                  src="http://localhost:8000/video_feed/cam1"
                  className="w-full h-full object-cover"
                  alt="Live Camera Feed"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    LIVE MONITORING
                  </div>
                  <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
                    CAM 01
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Recorded Clip (Left) and Details (Right) */}
          <div className="col-span-8 bg-black rounded-xl overflow-hidden relative border border-gray-800 h-[33%] shadow-lg">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <VideoCameraIcon className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-white uppercase tracking-wider animate-pulse">Incident Recording</span>
              <span className="text-[10px] text-gray-400 font-mono">#{selectedSession?.session_id.slice(0, 8)}</span>
            </div>
            {selectedSession && selectedSession.video_url ? (
              <video
                src={selectedSession.video_url}
                className="w-full h-full object-cover"
                autoPlay loop muted playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900 border-2 border-dashed border-gray-800">
                <p>No recorded clip available</p>
              </div>
            )}
          </div>

          <div className="col-span-4 bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-[33%] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <div className="bg-gray-200 p-1 rounded-full"><div className="w-1 h-1 bg-gray-500 rounded-full"></div></div>
                Clip Details
              </h3>
              <button className="text-gray-400 hover:text-gray-600"><span className="text-xl">⋮</span></button>
            </div>

            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                {selectedSession ? getIconForSession(selectedSession.description) : <div />}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  {selectedSession?.description || "No Incident Selected"}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed mt-1">
                  AI detected patterns consistent with {selectedSession?.severity || "Normal"} activity.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time</div>
                <div className="font-mono font-medium text-gray-800">{selectedSession?.created_at?.split(' ')[1] || "--:--"} UTC</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Confidence</div>
                <div className="font-mono font-bold text-green-600">{selectedSession?.confidence || "--%"}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Camera</div>
                <div className="font-mono font-medium text-gray-800">{selectedSession?.camera_id || "CAM 01"} (Static)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Zone</div>
                <div className="font-mono font-medium text-gray-800">Corridor A</div>
              </div>
            </div>

            {/* Action Buttons for Selected Session */}
            {selectedSession && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={(e) => handleAction(e, selectedSession.session_id, 'approve')}
                  disabled={selectedSession.status !== 'pending'}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
                            ${selectedSession.status === 'approved'
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : selectedSession.status === 'rejected'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30'
                    }`}
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  {selectedSession.status === 'approved' ? 'INCIDENT RESOLVED' : 'CONFIRM INCIDENT'}
                </button>

                <button
                  onClick={(e) => handleAction(e, selectedSession.session_id, 'reject')}
                  disabled={selectedSession.status !== 'pending'}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
                            ${selectedSession.status === 'rejected'
                      ? 'bg-red-100 text-red-700 cursor-default'
                      : selectedSession.status === 'approved'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700'
                    }`}
                >
                  <XCircleIcon className="w-5 h-5" />
                  {selectedSession.status === 'rejected' ? 'MARKED FALSE ALARM' : 'REJECT ALERT'}
                </button>
              </div>
            )}
          </div>


        </section >
      </main >
    </div >
  );
}
