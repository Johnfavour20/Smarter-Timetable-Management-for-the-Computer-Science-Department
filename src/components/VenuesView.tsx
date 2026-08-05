import React, { useState } from 'react';
import { Venue } from '../types';
import { 
  Building2, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  X, 
  RotateCcw, 
  Download, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Monitor,
  DoorOpen,
  Armchair,
  Tv,
  Wind,
  Wifi,
  Laptop,
  Lightbulb,
  Star,
  Wrench,
  Sparkles,
  MapPin
} from 'lucide-react';

interface VenuesViewProps {
  venues: Venue[];
  onAddVenue: (newVenue: Venue) => void;
  onUpdateVenue?: (updatedVenue: Venue) => void;
  onDeleteVenue: (id: string) => void;
  searchQuery?: string;
}

export const VenuesView: React.FC<VenuesViewProps> = ({
  venues,
  onAddVenue,
  onUpdateVenue,
  onDeleteVenue,
  searchQuery: externalSearchQuery = '',
}) => {
  // Filter States
  const [internalSearch, setInternalSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Slide-over Drawer State (Add / Edit)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  // View Details Modal State
  const [viewingVenue, setViewingVenue] = useState<Venue | null>(null);

  // Active Overflow Menu ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Add/Edit Drawer
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [building, setBuilding] = useState('ICT Building');
  const [type, setType] = useState<'Lecture Hall' | 'Laboratory' | 'Classroom'>('Lecture Hall');
  const [capacity, setCapacity] = useState<number>(150);
  const [hasProjector, setHasProjector] = useState(true);
  const [hasAC, setHasAC] = useState(true);
  const [hasSmartboard, setHasSmartboard] = useState(false);
  const [hasComputers, setHasComputers] = useState(false);
  const [hasInternet, setHasInternet] = useState(true);
  const [status, setStatus] = useState<'Active' | 'Maintenance' | 'Inactive'>('Active');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Combine external and internal search
  const effectiveSearch = (externalSearchQuery || internalSearch).trim().toLowerCase();

  // Get list of unique buildings for filter dropdown
  const uniqueBuildings = Array.from(
    new Set(['ICT Building', 'Faculty of Science', 'CS Faculty Block A', 'Software Engineering Complex', ...venues.map((v) => v.building)])
  );

  // Filter Logic
  const filteredVenues = venues.filter((v) => {
    if (effectiveSearch) {
      const q = effectiveSearch;
      const match =
        v.name.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.building.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (buildingFilter !== 'All' && v.building !== buildingFilter) {
      return false;
    }

    const venueType = v.type || (v.isLab ? 'Laboratory' : 'Lecture Hall');
    if (typeFilter !== 'All' && venueType !== typeFilter) {
      return false;
    }

    const venueStatus = v.status || 'Active';
    if (statusFilter !== 'All' && venueStatus !== statusFilter) {
      return false;
    }

    return true;
  });

  // KPI Calculations
  const totalVenuesCount = venues.length;
  const lectureHallsCount = venues.filter((v) => (v.type === 'Lecture Hall' || (!v.isLab && v.type !== 'Classroom'))).length;
  const computerLabsCount = venues.filter((v) => (v.isLab || v.type === 'Laboratory')).length;
  
  const avgUtilization = venues.length > 0
    ? Math.round(venues.reduce((acc, v) => acc + (v.utilizationPercentage || 65), 0) / venues.length)
    : 0;

  // Quick Insights Calculations
  const largestVenue = [...venues].sort((a, b) => b.capacity - a.capacity)[0];
  const smallestVenue = [...venues].sort((a, b) => a.capacity - b.capacity)[0];
  const mostUsedVenue = [...venues].sort((a, b) => (b.utilizationPercentage || 0) - (a.utilizationPercentage || 0))[0];

  const resetFilters = () => {
    setInternalSearch('');
    setBuildingFilter('All');
    setTypeFilter('All');
    setStatusFilter('All');
  };

  const handleOpenAddDrawer = () => {
    setEditingVenue(null);
    setName('');
    setCode('');
    setBuilding('ICT Building');
    setType('Lecture Hall');
    setCapacity(150);
    setHasProjector(true);
    setHasAC(true);
    setHasSmartboard(false);
    setHasComputers(false);
    setHasInternet(true);
    setStatus('Active');
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (v: Venue) => {
    setEditingVenue(v);
    setName(v.name);
    setCode(v.code);
    setBuilding(v.building);
    setType(v.type || (v.isLab ? 'Laboratory' : 'Lecture Hall'));
    setCapacity(v.capacity);
    setHasProjector(v.hasProjector);
    setHasAC(v.hasAC);
    setHasSmartboard(v.hasSmartboard);
    setHasComputers(v.hasComputers || v.isLab);
    setHasInternet(v.hasInternet !== undefined ? v.hasInternet : true);
    setStatus(v.status || 'Active');
    setIsDrawerOpen(true);
  };

  const handleSubmitDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const isLabSelected = type === 'Laboratory' || hasComputers;

    const venueData: Venue = {
      id: editingVenue ? editingVenue.id : `v-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      capacity: Number(capacity) || 50,
      building: building.trim(),
      type,
      status,
      hasProjector,
      hasAC,
      hasSmartboard,
      hasComputers,
      hasInternet,
      isLab: isLabSelected,
      utilizationPercentage: editingVenue ? editingVenue.utilizationPercentage : Math.floor(Math.random() * 25) + 65,
    };

    if (editingVenue) {
      if (onUpdateVenue) {
        onUpdateVenue(venueData);
      } else {
        // Fallback if onUpdateVenue is not passed
        onAddVenue(venueData);
      }
      showToast(`Updated venue details for ${venueData.code}.`);
    } else {
      onAddVenue(venueData);
      showToast(`Added new venue ${venueData.name} (${venueData.code}).`);
    }

    setIsDrawerOpen(false);
  };

  const handleToggleMaintenance = (v: Venue) => {
    const nextStatus: 'Active' | 'Maintenance' | 'Inactive' =
      v.status === 'Active' ? 'Maintenance' : 'Active';
    const updated = { ...v, status: nextStatus };
    if (onUpdateVenue) {
      onUpdateVenue(updated);
    }
    showToast(`Venue ${v.code} is now set to ${nextStatus}.`);
  };

  const handleDelete = (v: Venue) => {
    onDeleteVenue(v.id);
    showToast(`Deleted venue ${v.code}.`);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Venue Name,Code,Type,Building,Capacity,Status,Utilization,Projector,AC,Smartboard,Computers,Internet\n';
    const csvRows = filteredVenues
      .map((v) => {
        const vType = v.type || (v.isLab ? 'Laboratory' : 'Lecture Hall');
        const vStatus = v.status || 'Active';
        return `"${v.name}","${v.code}","${vType}","${v.building}",${v.capacity},"${vStatus}",${v.utilizationPercentage || 0}%,${v.hasProjector},${v.hasAC},${v.hasSmartboard},${!!v.hasComputers},${v.hasInternet !== false}`;
      })
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChronosCS_Venues_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast(`Exported ${filteredVenues.length} venue records to CSV.`);
  };

  const getVenueIcon = (v: Venue) => {
    const vType = v.type || (v.isLab ? 'Laboratory' : 'Lecture Hall');
    if (vType === 'Laboratory' || v.isLab) {
      return <Monitor className="w-4 h-4 text-purple-600" />;
    }
    if (vType === 'Classroom') {
      return <DoorOpen className="w-4 h-4 text-amber-600" />;
    }
    return <Building2 className="w-4 h-4 text-[#004384]" />;
  };

  return (
    <div className="space-y-6 antialiased text-slate-900 pb-16 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#081C3A] text-white px-4 py-3 rounded-xl shadow-xl border border-blue-400/30 flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#004384]" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Venues</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Manage classrooms, lecture halls, and laboratories available for timetable scheduling.
          </p>
        </div>

        <button
          onClick={handleOpenAddDrawer}
          id="addVenueBtn"
          className="bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Venue</span>
        </button>
      </div>

      {/* 2. SUMMARY CARDS (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Total Venues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider block">Total Venues</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004384]">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalVenuesCount}</span>
            <span className="text-[11px] font-bold text-[#004384] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Active Spaces
            </span>
          </div>
        </div>

        {/* KPI 2: Lecture Halls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider block">Lecture Halls</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{lectureHallsCount}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Large Cohorts
            </span>
          </div>
        </div>

        {/* KPI 3: Computer Labs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider block">Computer Labs</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
              <Monitor className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{computerLabsCount}</span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Practicals
            </span>
          </div>
        </div>

        {/* KPI 4: Avg. Utilization */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider block">Avg. Utilization</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{avgUtilization}%</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Weekly Rate
            </span>
          </div>
        </div>

      </div>

      {/* 3. MAIN DASHBOARD CONTENT (3 columns Table + 1 column Quick Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Filters & Venues Table */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search & Filters Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  placeholder="Search Venue Name or Code..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                
                {/* Building Dropdown */}
                <select
                  value={buildingFilter}
                  onChange={(e) => setBuildingFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384] cursor-pointer"
                >
                  <option value="All">All Buildings</option>
                  {uniqueBuildings.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                {/* Type Dropdown */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384] cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Lecture Hall">Lecture Hall</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Classroom">Classroom</option>
                </select>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384] cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>

                {/* Reset Filters */}
                {(internalSearch || buildingFilter !== 'All' || typeFilter !== 'All' || statusFilter !== 'All') && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset Filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                {/* Export Button */}
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export</span>
                </button>

              </div>

            </div>
          </div>

          {/* Venues Table Container */}
          {filteredVenues.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#004384] flex items-center justify-center mx-auto shadow-2xs">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-extrabold text-slate-900">No Venues Found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No venue records matched your filter criteria or search query.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={handleOpenAddDrawer}
                  className="px-4 py-2 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Venue</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-white">
                      <th className="py-3.5 px-5">Venue</th>
                      <th className="py-3.5 px-5">Code</th>
                      <th className="py-3.5 px-5">Type</th>
                      <th className="py-3.5 px-5">Building</th>
                      <th className="py-3.5 px-5">Capacity</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {filteredVenues.map((v) => {
                      const vType = v.type || (v.isLab ? 'Laboratory' : 'Lecture Hall');
                      const vStatus = v.status || 'Active';

                      return (
                        <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                          
                          {/* Venue Name with Icon Badge */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                vType === 'Laboratory' || v.isLab
                                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                                  : vType === 'Classroom'
                                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                                  : 'bg-blue-50 border-blue-200 text-[#004384]'
                              }`}>
                                {getVenueIcon(v)}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900">{v.name}</div>
                                <div className="text-[11px] text-slate-400">
                                  {v.hasProjector && 'Projector • '}
                                  {v.hasAC && 'AC • '}
                                  {v.hasSmartboard && 'Smartboard'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Code */}
                          <td className="py-4 px-5 font-mono text-slate-600 font-bold">
                            {v.code}
                          </td>

                          {/* Type */}
                          <td className="py-4 px-5 font-medium text-slate-700">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                              vType === 'Laboratory' || v.isLab
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : vType === 'Classroom'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-blue-50 text-[#004384] border-blue-200'
                            }`}>
                              {vType}
                            </span>
                          </td>

                          {/* Building */}
                          <td className="py-4 px-5 text-slate-700 font-medium">
                            {v.building}
                          </td>

                          {/* Capacity */}
                          <td className="py-4 px-5 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Armchair className="w-3.5 h-3.5 text-slate-400" />
                              <span>{v.capacity} Seats</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              vStatus === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : vStatus === 'Maintenance'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                vStatus === 'Active'
                                  ? 'bg-emerald-500'
                                  : vStatus === 'Maintenance'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`} />
                              {vStatus}
                            </span>
                          </td>

                          {/* Actions Overflow Menu */}
                          <td className="py-4 px-5 text-right relative">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === v.id ? null : v.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Popup */}
                            {activeMenuId === v.id && (
                              <div 
                                className="absolute right-5 top-12 z-30 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 text-left text-xs font-semibold space-y-0.5"
                                onMouseLeave={() => setActiveMenuId(null)}
                              >
                                {/* View Details */}
                                <button
                                  onClick={() => {
                                    setViewingVenue(v);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>View Details</span>
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => {
                                    handleOpenEditDrawer(v);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Edit Venue</span>
                                </button>

                                {/* Maintenance Toggle */}
                                <button
                                  onClick={() => {
                                    handleToggleMaintenance(v);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Wrench className="w-3.5 h-3.5 text-purple-600" />
                                  <span>{v.status === 'Maintenance' ? 'End Maintenance' : 'Set Maintenance'}</span>
                                </button>

                                <div className="h-px bg-slate-100 my-1" />

                                {/* Delete */}
                                <button
                                  onClick={() => {
                                    handleDelete(v);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Delete Venue</span>
                                </button>
                              </div>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
                <span>Showing <strong className="text-slate-900">{filteredVenues.length}</strong> of <strong className="text-slate-900">{venues.length}</strong> venue entries</span>
                <div className="flex items-center gap-1">
                  <button disabled className="p-1.5 rounded-lg border border-slate-200 opacity-50 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 font-bold text-[#004384] bg-white rounded-lg border border-slate-200">Page 1 of 1</span>
                  <button disabled className="p-1.5 rounded-lg border border-slate-200 opacity-50 cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Quick Insights Bento Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden relative">
            
            {/* Top Gradient Accent Bar */}
            <div className="h-1 bg-gradient-to-r from-[#004384] via-blue-500 to-indigo-600" />

            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#004384]" />
              <h3 className="font-extrabold text-slate-900 text-sm">Quick Insights</h3>
            </div>

            {/* Content Cards */}
            <div className="p-4 space-y-3 text-xs">
              
              {/* Largest Venue */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Largest Venue</span>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{largestVenue?.name || 'N/A'}</span>
                  <span className="font-bold text-[#004384] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 text-[11px]">
                    {largestVenue?.capacity || 0} Seats
                  </span>
                </div>
              </div>

              {/* Smallest Venue */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Smallest Venue</span>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{smallestVenue?.name || 'N/A'}</span>
                  <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                    {smallestVenue?.capacity || 0} Seats
                  </span>
                </div>
              </div>

              {/* Most Used */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Most Utilized</span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">{mostUsedVenue?.name || 'N/A'}</span>
                  </div>
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                    {mostUsedVenue?.utilizationPercentage || 0}% Used
                  </span>
                </div>
              </div>

              {/* Facility Capacity Overview */}
              <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100/80 space-y-2">
                <span className="text-[10px] font-bold text-[#004384] uppercase tracking-wider block">Total Seating Capacity</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">
                    {venues.reduce((acc, v) => acc + v.capacity, 0)} Seats
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">Across {venues.length} Spaces</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* 4. ADD / EDIT VENUE SLIDE-OVER DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            id="drawerOverlay"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" id="addVenueDrawer">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideIn">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingVenue ? `Edit Venue: ${editingVenue.code}` : 'Add New Venue'}
                  </h2>
                  <p className="text-xs text-slate-500">Configure a space for timetable scheduling.</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  id="closeDrawerBtn"
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form id="venueForm" onSubmit={handleSubmitDrawer} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                
                {/* Venue Name */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Venue Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lecture Theatre 1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                  />
                </div>

                {/* Venue Code */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Venue Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LT-001"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                  />
                </div>

                {/* Building & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Building</label>
                    <select
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                    >
                      <option value="ICT Building">ICT Building</option>
                      <option value="Faculty of Science">Faculty of Science</option>
                      <option value="CS Faculty Block A">CS Faculty Block A</option>
                      <option value="Software Engineering Complex">Software Engineering Complex</option>
                      <option value="Main Auditorium Complex">Main Auditorium Complex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                    >
                      <option value="Lecture Hall">Lecture Hall</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Classroom">Classroom</option>
                    </select>
                  </div>
                </div>

                {/* Capacity (Seats) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Capacity (Seats)</label>
                  <div className="relative">
                    <Armchair className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="10"
                      max="2000"
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                    />
                  </div>
                </div>

                {/* Equipment Checkboxes */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-slate-700 font-bold">Equipment Available</label>
                  <div className="flex flex-wrap gap-2">
                    
                    {/* Projector */}
                    <label className="cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasProjector}
                        onChange={(e) => setHasProjector(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 font-bold text-[11px] peer-checked:bg-blue-50 peer-checked:border-[#004384] peer-checked:text-[#004384] transition-all flex items-center gap-1.5">
                        <Tv className="w-3.5 h-3.5" /> Projector
                      </div>
                    </label>

                    {/* AC */}
                    <label className="cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasAC}
                        onChange={(e) => setHasAC(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 font-bold text-[11px] peer-checked:bg-blue-50 peer-checked:border-[#004384] peer-checked:text-[#004384] transition-all flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5" /> Air Conditioner
                      </div>
                    </label>

                    {/* Smartboard */}
                    <label className="cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasSmartboard}
                        onChange={(e) => setHasSmartboard(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 font-bold text-[11px] peer-checked:bg-blue-50 peer-checked:border-[#004384] peer-checked:text-[#004384] transition-all flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5" /> Smart Board
                      </div>
                    </label>

                    {/* Computers */}
                    <label className="cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasComputers}
                        onChange={(e) => setHasComputers(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 font-bold text-[11px] peer-checked:bg-blue-50 peer-checked:border-[#004384] peer-checked:text-[#004384] transition-all flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5" /> Computers
                      </div>
                    </label>

                    {/* Internet */}
                    <label className="cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hasInternet}
                        onChange={(e) => setHasInternet(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 font-bold text-[11px] peer-checked:bg-blue-50 peer-checked:border-[#004384] peer-checked:text-[#004384] transition-all flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5" /> Internet
                      </div>
                    </label>

                  </div>
                </div>

                {/* Active Status Switch */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <label className="text-slate-900 font-bold block">Status</label>
                    <span className="text-[11px] text-slate-500">
                      Venue is available for timetable scheduling
                    </span>
                  </div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-bold text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </form>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  id="cancelDrawerBtn"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="venueForm"
                  className="px-5 py-2.5 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Venue
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW VENUE DETAILS MODAL */}
      {viewingVenue && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#004384] font-black text-base flex items-center justify-center border border-blue-200 shadow-xs">
                  {viewingVenue.code}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {viewingVenue.name}
                  </h3>
                  <p className="text-xs font-bold text-[#004384]">
                    {viewingVenue.building} • {viewingVenue.type || (viewingVenue.isLab ? 'Laboratory' : 'Lecture Hall')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingVenue(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                  <span className="text-[#004384] block text-[10px] uppercase font-bold">Seating Capacity</span>
                  <span className="font-extrabold text-slate-900 text-base">{viewingVenue.capacity} Seats</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                  <span className="text-emerald-700 block text-[10px] uppercase font-bold">Weekly Utilization</span>
                  <span className="font-extrabold text-slate-900 text-base">{viewingVenue.utilizationPercentage}% Rate</span>
                </div>
              </div>

              {/* Equipment badges */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-900 block text-xs">Facility Equipment & AV Features:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                    viewingVenue.hasProjector ? 'bg-blue-50 border-blue-200 text-[#004384]' : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  }`}>
                    <Tv className="w-4 h-4" /> HD Projector
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                    viewingVenue.hasAC ? 'bg-blue-50 border-blue-200 text-[#004384]' : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  }`}>
                    <Wind className="w-4 h-4" /> Air Conditioning
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                    viewingVenue.hasSmartboard ? 'bg-blue-50 border-blue-200 text-[#004384]' : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  }`}>
                    <Monitor className="w-4 h-4" /> Smart Board
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                    viewingVenue.hasComputers || viewingVenue.isLab ? 'bg-blue-50 border-blue-200 text-[#004384]' : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                  }`}>
                    <Laptop className="w-4 h-4" /> Computer Workstations
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-bold">Current Operational Status:</span>
                <span className={`px-3 py-1 rounded-full font-extrabold text-xs border ${
                  viewingVenue.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : viewingVenue.status === 'Maintenance'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {viewingVenue.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  handleOpenEditDrawer(viewingVenue);
                  setViewingVenue(null);
                }}
                className="px-4 py-2 bg-[#004384] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#081C3A] cursor-pointer"
              >
                Edit Venue
              </button>
              <button
                onClick={() => setViewingVenue(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
