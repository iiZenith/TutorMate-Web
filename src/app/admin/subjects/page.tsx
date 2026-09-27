"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ═══════════════════════════════════════════════════
   Admin — Hierarchical Subjects Management
   Firestore path: platform_metadata / subjects_hierarchy
   Structure:
   {
     hierarchy: {
       "Level Name": {
         "Grade Name": ["Subject 1", "Subject 2"]
       }
     }
   }
   ═══════════════════════════════════════════════════ */

const COLLECTION = "platform_metadata";
const DOCUMENT = "subjects_hierarchy";

type Hierarchy = Record<string, Record<string, string[]>>;

export default function SubjectsPage() {
  const [hierarchy, setHierarchy] = useState<Hierarchy>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selection states
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  // Input states
  const [newLevel, setNewLevel] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newSubject, setNewSubject] = useState("");

  /* ── Fetch hierarchy ── */
  useEffect(() => {
    async function fetchHierarchy() {
      try {
        const snap = await getDoc(doc(db, COLLECTION, DOCUMENT));
        if (snap.exists()) {
          setHierarchy(snap.data()?.hierarchy || {});
        } else {
          // Initialize if missing
          setHierarchy({
            "Primary": { "Grade 1": [], "Grade 2": [] },
            "Secondary": { "Grade 9": [], "Grade 10": [] },
          });
        }
      } catch (err) {
        console.error("Failed to fetch hierarchy:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHierarchy();
  }, []);

  /* ── Save to Firestore ── */
  const saveHierarchy = async (newHierarchy: Hierarchy) => {
    setSaving(true);
    try {
      const ref = doc(db, COLLECTION, DOCUMENT);
      await setDoc(ref, { hierarchy: newHierarchy }, { merge: true });
      setHierarchy(newHierarchy);
    } catch (error) {
      console.error("Error saving hierarchy:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Handlers ── */
  const handleAddLevel = () => {
    const trimmed = newLevel.trim();
    if (!trimmed || hierarchy[trimmed]) return;
    saveHierarchy({ ...hierarchy, [trimmed]: {} });
    setNewLevel("");
  };

  const handleDeleteLevel = (level: string) => {
    if (!confirm(`Delete level "${level}" and all its grades?`)) return;
    const clone = { ...hierarchy };
    delete clone[level];
    if (selectedLevel === level) {
      setSelectedLevel(null);
      setSelectedGrade(null);
    }
    saveHierarchy(clone);
  };

  const handleAddGrade = () => {
    if (!selectedLevel) return;
    const trimmed = newGrade.trim();
    if (!trimmed || hierarchy[selectedLevel]?.[trimmed]) return;
    
    const clone = { ...hierarchy };
    clone[selectedLevel][trimmed] = [];
    saveHierarchy(clone);
    setNewGrade("");
  };

  const handleDeleteGrade = (grade: string) => {
    if (!selectedLevel) return;
    if (!confirm(`Delete grade "${grade}"?`)) return;
    
    const clone = { ...hierarchy };
    delete clone[selectedLevel][grade];
    if (selectedGrade === grade) setSelectedGrade(null);
    saveHierarchy(clone);
  };

  const handleAddSubject = () => {
    if (!selectedLevel || !selectedGrade) return;
    const trimmed = newSubject.trim();
    const subjects = hierarchy[selectedLevel][selectedGrade] || [];
    if (!trimmed || subjects.includes(trimmed)) return;
    
    const clone = { ...hierarchy };
    clone[selectedLevel][selectedGrade] = [...subjects, trimmed];
    saveHierarchy(clone);
    setNewSubject("");
  };

  const handleDeleteSubject = (subject: string) => {
    if (!selectedLevel || !selectedGrade) return;
    if (!confirm(`Delete subject "${subject}"?`)) return;
    
    const clone = { ...hierarchy };
    clone[selectedLevel][selectedGrade] = clone[selectedLevel][selectedGrade].filter(s => s !== subject);
    saveHierarchy(clone);
  };

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">
          Hierarchical Subjects Management
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Manage subjects by Level and Grade/Stream.
        </p>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* COL 1: LEVELS */}
          <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="bg-surface p-4 border-b border-border-default shrink-0">
              <h3 className="font-semibold text-text-primary mb-3">Levels</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddLevel()}
                  placeholder="e.g. High School"
                  className="flex-1 rounded-lg border border-border-default bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                />
                <button
                  onClick={handleAddLevel}
                  disabled={!newLevel.trim() || saving}
                  className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
            <ul className="overflow-y-auto flex-1 divide-y divide-border-default">
              {Object.keys(hierarchy).map(level => (
                <li key={level} className="flex">
                  <button
                    onClick={() => { setSelectedLevel(level); setSelectedGrade(null); }}
                    className={`flex-1 text-left px-4 py-3 text-sm font-medium transition-colors ${selectedLevel === level ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300" : "text-text-primary hover:bg-surface-sunken"}`}
                  >
                    {level}
                  </button>
                  <button onClick={() => handleDeleteLevel(level)} className="px-3 text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors">
                    ×
                  </button>
                </li>
              ))}
              {Object.keys(hierarchy).length === 0 && (
                <li className="p-4 text-sm text-text-muted text-center">No levels defined.</li>
              )}
            </ul>
          </div>

          {/* COL 2: GRADES */}
          <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="bg-surface p-4 border-b border-border-default shrink-0">
              <h3 className="font-semibold text-text-primary mb-3">
                {selectedLevel ? `Grades in ${selectedLevel}` : "Select a Level"}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddGrade()}
                  placeholder="e.g. Grade 10"
                  disabled={!selectedLevel}
                  className="flex-1 rounded-lg border border-border-default bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 disabled:opacity-50"
                />
                <button
                  onClick={handleAddGrade}
                  disabled={!selectedLevel || !newGrade.trim() || saving}
                  className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
            <ul className="overflow-y-auto flex-1 divide-y divide-border-default">
              {!selectedLevel ? (
                <li className="p-4 text-sm text-text-muted text-center">Select a level to view grades.</li>
              ) : (
                <>
                  {Object.keys(hierarchy[selectedLevel] || {}).map(grade => (
                    <li key={grade} className="flex">
                      <button
                        onClick={() => setSelectedGrade(grade)}
                        className={`flex-1 text-left px-4 py-3 text-sm font-medium transition-colors ${selectedGrade === grade ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300" : "text-text-primary hover:bg-surface-sunken"}`}
                      >
                        {grade}
                      </button>
                      <button onClick={() => handleDeleteGrade(grade)} className="px-3 text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors">
                        ×
                      </button>
                    </li>
                  ))}
                  {Object.keys(hierarchy[selectedLevel] || {}).length === 0 && (
                    <li className="p-4 text-sm text-text-muted text-center">No grades defined.</li>
                  )}
                </>
              )}
            </ul>
          </div>

          {/* COL 3: SUBJECTS */}
          <div className="rounded-2xl border border-border-default bg-surface-raised shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="bg-surface p-4 border-b border-border-default shrink-0">
              <h3 className="font-semibold text-text-primary mb-3">
                {selectedGrade ? `Subjects in ${selectedGrade}` : "Select a Grade"}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                  placeholder="e.g. Physics"
                  disabled={!selectedGrade}
                  className="flex-1 rounded-lg border border-border-default bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 disabled:opacity-50"
                />
                <button
                  onClick={handleAddSubject}
                  disabled={!selectedGrade || !newSubject.trim() || saving}
                  className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
            <ul className="overflow-y-auto flex-1 divide-y divide-border-default">
              {!selectedGrade ? (
                <li className="p-4 text-sm text-text-muted text-center">Select a grade to view subjects.</li>
              ) : (
                <>
                  {(hierarchy[selectedLevel!]?.[selectedGrade] || []).map(subject => (
                    <li key={subject} className="flex px-4 py-3 text-sm text-text-primary hover:bg-surface-sunken">
                      <span className="flex-1">{subject}</span>
                      <button onClick={() => handleDeleteSubject(subject)} className="text-text-muted hover:text-red-500 ml-2">
                        ×
                      </button>
                    </li>
                  ))}
                  {(hierarchy[selectedLevel!]?.[selectedGrade] || []).length === 0 && (
                    <li className="p-4 text-sm text-text-muted text-center">No subjects defined.</li>
                  )}
                </>
              )}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
