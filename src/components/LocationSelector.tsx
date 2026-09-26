"use client";

import { useEffect, useState } from "react";
import { locationService, ProvinceDoc } from "@/lib/locationService";
import { NEPAL_PROVINCES } from "@/lib/nepalLocations";

export interface LocationSelection {
  province: string;
  district: string;
  area: string;
}

interface LocationSelectorProps {
  value?: LocationSelection;
  onChange: (selection: LocationSelection) => void;
  className?: string;
}

export default function LocationSelector({ value, onChange, className = "" }: LocationSelectorProps) {
  const [provinces, setProvinces] = useState<ProvinceDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Local state for selections
  const [selectedProvince, setSelectedProvince] = useState<string>(value?.province || "");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(value?.district || "");
  const [selectedArea, setSelectedArea] = useState<string>(value?.area || "");

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await locationService.getLocationsTree();
        if (data && data.length > 0) {
          setProvinces(data);
        } else {
          // Fallback to local data if firestore is empty
          const fallbackData: ProvinceDoc[] = NEPAL_PROVINCES.map((p) => ({
            name: p.name,
            districts: p.districts.reduce((acc, d) => {
              acc[d.name] = { areas: d.areas.map(a => a.name).sort() };
              return acc;
            }, {} as Record<string, { areas: string[] }>)
          }));
          setProvinces(fallbackData);
        }
      } catch (err) {
        console.warn("Failed to load locations from Firestore, using fallback", err);
        const fallbackData: ProvinceDoc[] = NEPAL_PROVINCES.map((p) => ({
            name: p.name,
            districts: p.districts.reduce((acc, d) => {
              acc[d.name] = { areas: d.areas.map(a => a.name).sort() };
              return acc;
            }, {} as Record<string, { areas: string[] }>)
          }));
        setProvinces(fallbackData);
      } finally {
        setLoading(false);
      }
    }
    
    loadLocations();
  }, []);

  // Sync external value changes to local state
  useEffect(() => {
    if (value) {
      if (value.province !== selectedProvince) setSelectedProvince(value.province);
      if (value.district !== selectedDistrict) setSelectedDistrict(value.district);
      if (value.area !== selectedArea) setSelectedArea(value.area);
    }
  }, [value]);

  // Handle cascading changes
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = e.target.value;
    setSelectedProvince(p);
    setSelectedDistrict("");
    setSelectedArea("");
    onChange({ province: p, district: "", area: "" });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const d = e.target.value;
    setSelectedDistrict(d);
    setSelectedArea("");
    onChange({ province: selectedProvince, district: d, area: "" });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const a = e.target.value;
    setSelectedArea(a);
    onChange({ province: selectedProvince, district: selectedDistrict, area: a });
  };

  // Derived data for dropdowns
  const activeProvince = provinces.find((p) => p.name === selectedProvince);
  const districtList = activeProvince ? Object.keys(activeProvince.districts).sort() : [];
  
  const activeDistrictData = activeProvince && selectedDistrict ? activeProvince.districts[selectedDistrict] : null;
  const areaList = activeDistrictData ? activeDistrictData.areas : [];

  if (loading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-10 rounded-xl bg-slate-200"></div>
        <div className="h-10 rounded-xl bg-slate-200"></div>
        <div className="h-10 rounded-xl bg-slate-200"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Province Dropdown */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Province
        </label>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">Select Province</option>
          {provinces.map((prov) => (
            <option key={prov.name} value={prov.name}>
              {prov.name}
            </option>
          ))}
        </select>
      </div>

      {/* District Dropdown */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          District
        </label>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
        >
          <option value="">Select District</option>
          {districtList.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Area Dropdown */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Local Area / Municipality
        </label>
        <select
          value={selectedArea}
          onChange={handleAreaChange}
          disabled={!selectedDistrict}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
        >
          <option value="">Select Area</option>
          {areaList.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
