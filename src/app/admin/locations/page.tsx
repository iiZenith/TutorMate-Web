"use client";

import { useEffect, useState } from "react";
import { locationService, ProvinceDoc } from "@/lib/locationService";

export default function LocationsPage() {
  const [provinces, setProvinces] = useState<ProvinceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  // Selections
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // New inputs
  const [newDistrict, setNewDistrict] = useState("");
  const [newArea, setNewArea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setLoading(true);
    try {
      const data = await locationService.getLocationsTree();
      setProvinces(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    setError("");
    try {
      await locationService.seedLocationsIfEmpty();
      await fetchLocations();
    } catch (err) {
      console.error(err);
      setError("Failed to seed locations.");
    } finally {
      setSeeding(false);
    }
  }

  const activeProvince = provinces.find((p) => p.name === selectedProvince);
  const activeDistrictData = activeProvince && selectedDistrict ? activeProvince.districts[selectedDistrict] : null;

  async function handleAddDistrict() {
    if (!activeProvince || !newDistrict.trim()) return;
    setIsSubmitting(true);
    try {
      await locationService.addDistrict(activeProvince.name, newDistrict.trim());
      setNewDistrict("");
      await fetchLocations();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Failed to add district");
      } else {
        alert("Failed to add district");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddArea() {
    if (!activeProvince || !selectedDistrict || !newArea.trim()) return;
    setIsSubmitting(true);
    try {
      await locationService.addArea(activeProvince.name, selectedDistrict, newArea.trim());
      setNewArea("");
      await fetchLocations();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Failed to add area");
      } else {
        alert("Failed to add area");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteDistrict(districtName: string) {
    if (!activeProvince) return;
    if (!confirm(`Are you sure you want to delete the district "${districtName}" and all its areas?`)) return;
    try {
      await locationService.deleteDistrict(activeProvince.name, districtName);
      if (selectedDistrict === districtName) setSelectedDistrict(null);
      await fetchLocations();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteArea(areaName: string) {
    if (!activeProvince || !selectedDistrict) return;
    if (!confirm(`Are you sure you want to delete "${areaName}"?`)) return;
    try {
      await locationService.deleteArea(activeProvince.name, selectedDistrict, areaName);
      await fetchLocations();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Manage Locations</h2>
          <p className="mt-1 text-sm text-text-muted">
            Configure Provinces, Districts, and Local Areas.
          </p>
        </div>
        {provinces.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="rounded-xl bg-surface-raised px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "Seed Default Data"}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* PROVINCES COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="border-b border-border-default bg-surface p-4">
              <h3 className="font-semibold text-text-primary">1. Provinces</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {provinces.length === 0 ? (
                <p className="p-4 text-center text-sm text-text-muted">No data. Seed first.</p>
              ) : (
                <ul className="space-y-1">
                  {provinces.map((prov) => (
                    <li key={prov.name}>
                      <button
                        onClick={() => {
                          setSelectedProvince(prov.name);
                          setSelectedDistrict(null); // Reset district when province changes
                        }}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${selectedProvince === prov.name ? "bg-brand-50 text-brand-700" : "text-text-secondary hover:bg-surface " }`}
                      >
                        {prov.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* DISTRICTS COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="border-b border-border-default bg-surface p-4">
              <h3 className="font-semibold text-text-primary">2. Districts</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {!activeProvince ? (
                <p className="p-4 text-center text-sm text-text-muted">Select a province first.</p>
              ) : (
                <div className="space-y-4">
                  <div className="px-2 pt-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newDistrict}
                        onChange={(e) => setNewDistrict(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddDistrict()}
                        placeholder="Add district..."
                        className="flex-1 rounded-lg border border-border-default px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                      />
                      <button
                        onClick={handleAddDistrict}
                        disabled={!newDistrict.trim() || isSubmitting}
                        className="rounded-lg bg-brand-100 px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-200 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <ul className="space-y-1">
                    {Object.keys(activeProvince.districts).sort().map((districtName) => (
                      <li key={districtName} className="group flex items-center justify-between rounded-xl px-2">
                        <button
                          onClick={() => setSelectedDistrict(districtName)}
                          className={`flex-1 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${selectedDistrict === districtName ? "bg-brand-50 text-brand-700" : "text-text-secondary hover:bg-surface " }`}
                        >
                          {districtName}
                        </button>
                        <button
                          onClick={() => handleDeleteDistrict(districtName)}
                          className="invisible p-2 text-text-muted hover:text-red-500 group-hover:visible"
                          title="Delete District"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AREAS COLUMN */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="border-b border-border-default bg-surface p-4">
              <h3 className="font-semibold text-text-primary">3. Local Areas / Municipalities</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {!activeDistrictData ? (
                <p className="p-4 text-center text-sm text-text-muted">Select a district first.</p>
              ) : (
                <div className="space-y-4">
                  <div className="px-2 pt-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddArea()}
                        placeholder="Add local area..."
                        className="flex-1 rounded-lg border border-border-default px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                      />
                      <button
                        onClick={handleAddArea}
                        disabled={!newArea.trim() || isSubmitting}
                        className="rounded-lg bg-brand-100 px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-200 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <ul className="space-y-1">
                    {activeDistrictData.areas.map((area) => (
                      <li key={area} className="group flex items-center justify-between rounded-xl px-2 py-1 hover:bg-surface">
                        <span className="px-3 py-1.5 text-sm font-medium text-text-secondary">
                          {area}
                        </span>
                        <button
                          onClick={() => handleDeleteArea(area)}
                          className="invisible p-2 text-text-muted hover:text-red-500 group-hover:visible"
                          title="Delete Area"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </li>
                    ))}
                    {activeDistrictData.areas.length === 0 && (
                      <p className="px-5 py-4 text-sm text-text-muted">No areas added yet.</p>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
