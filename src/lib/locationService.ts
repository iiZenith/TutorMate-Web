import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { NEPAL_PROVINCES } from "./nepalLocations";

export const LOCATIONS_COLLECTION = "locations";

export interface DistrictData {
  areas: string[];
}

export interface ProvinceDoc {
  name: string;
  // Map of district name to its data (currently just areas)
  districts: Record<string, DistrictData>;
}

export const locationService = {
  /**
   * Fetch the full hierarchical location tree
   */
  async getLocationsTree(): Promise<ProvinceDoc[]> {
    const snapshot = await getDocs(collection(db, LOCATIONS_COLLECTION));
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => doc.data() as ProvinceDoc).sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Save an entire province document
   */
  async saveProvince(provinceName: string, data: ProvinceDoc): Promise<void> {
    const docRef = doc(db, LOCATIONS_COLLECTION, provinceName);
    await setDoc(docRef, data);
  },

  /**
   * Add a new district to a province
   */
  async addDistrict(provinceName: string, districtName: string): Promise<void> {
    const docRef = doc(db, LOCATIONS_COLLECTION, provinceName);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Province not found");
    
    const data = snap.data() as ProvinceDoc;
    if (data.districts[districtName]) {
      throw new Error("District already exists");
    }
    
    data.districts[districtName] = { areas: [] };
    await setDoc(docRef, data);
  },

  /**
   * Add a new area to a district
   */
  async addArea(provinceName: string, districtName: string, areaName: string): Promise<void> {
    const docRef = doc(db, LOCATIONS_COLLECTION, provinceName);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Province not found");
    
    const data = snap.data() as ProvinceDoc;
    if (!data.districts[districtName]) {
      throw new Error("District not found");
    }
    if (data.districts[districtName].areas.includes(areaName)) {
      throw new Error("Area already exists");
    }
    
    data.districts[districtName].areas.push(areaName);
    data.districts[districtName].areas.sort();
    await setDoc(docRef, data);
  },

  /**
   * Delete an area
   */
  async deleteArea(provinceName: string, districtName: string, areaName: string): Promise<void> {
    const docRef = doc(db, LOCATIONS_COLLECTION, provinceName);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;
    
    const data = snap.data() as ProvinceDoc;
    if (data.districts[districtName]) {
      data.districts[districtName].areas = data.districts[districtName].areas.filter(a => a !== areaName);
      await setDoc(docRef, data);
    }
  },

  /**
   * Delete a district
   */
  async deleteDistrict(provinceName: string, districtName: string): Promise<void> {
    const docRef = doc(db, LOCATIONS_COLLECTION, provinceName);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;
    
    const data = snap.data() as ProvinceDoc;
    if (data.districts[districtName]) {
      delete data.districts[districtName];
      await setDoc(docRef, data);
    }
  },

  /**
   * Seed Firestore with default data if it doesn't exist
   */
  async seedLocationsIfEmpty(): Promise<void> {
    const existing = await this.getLocationsTree();
    if (existing.length > 0) return; // Already seeded

    const batch = writeBatch(db);
    for (const province of NEPAL_PROVINCES) {
      const docRef = doc(db, LOCATIONS_COLLECTION, province.name);
      
      const provinceData: ProvinceDoc = {
        name: province.name,
        districts: {}
      };
      
      for (const district of province.districts) {
        provinceData.districts[district.name] = {
          areas: district.areas.map(a => a.name).sort()
        };
      }
      
      batch.set(docRef, provinceData);
    }
    await batch.commit();
  }
};
