'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { ManualRecordEntry } from '@/types/health';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_MANUAL_RECORDS } from '@/data/mockData';
import { 
  PlusCircle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

export default function ManualRecordsPage() {
  const { overview, repository } = useHealth();
  const [records, setRecords] = useState<ManualRecordEntry[]>(INITIAL_MANUAL_RECORDS);

  // New Record Form State
  const [showForm, setShowForm] = useState(false);
  const [testType, setTestType] = useState<ManualRecordEntry['testType']>('Blood Glucose');
  const [testValue, setTestValue] = useState('94');
  const [unit, setUnit] = useState('mg/dL');
  const [deviceUsed, setDeviceUsed] = useState('Mission Handheld Glucometer Cartridge');
  const [techniqueNotes, setTechniqueNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTestTypeChange = (type: ManualRecordEntry['testType']) => {
    setTestType(type);
    if (type === 'Blood Glucose') {
      setUnit('mg/dL');
      setTestValue('92');
      setDeviceUsed('Mission Handheld Glucometer Cartridge');
    } else if (type === 'Vision Acuity (SANS Check)') {
      setUnit('Snellen Scale');
      setTestValue('20/20 Left, 20/20 Right');
      setDeviceUsed('Standardized Near-Vision Test Card (40cm)');
    } else if (type === 'Urine Hydration Index') {
      setUnit('Specific Gravity');
      setTestValue('1.015');
      setDeviceUsed('Digital Optical Refractometer');
    } else if (type === 'Salivary Cortisol') {
      setUnit('nmol/L');
      setTestValue('12.4');
      setDeviceUsed('Saliva Biomarker Swab & Colorimetric Reader');
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ManualRecordEntry = {
      id: `rec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      missionDay: overview?.missionDay || 90,
      testType,
      value: testValue,
      unit,
      deviceUsed,
      techniqueNotes: techniqueNotes || 'Sample collected under standard flight calibration.',
      origin: 'manual',
      status: 'green'
    };
    await repository.addManualRecord(newRecord);
    setRecords((prev) => [newRecord, ...prev]);
    setSaveSuccess(true);
    setShowForm(false);
    setTechniqueNotes('');
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
              Laboratory & Diagnostic Records
            </span>
            <span className="text-xs text-[#60716E]">
              Manual Instrument Ingestion
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Manual Assessment Records
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Log and review test results requiring specialized hardware (glucometers, SANS vision cards, refractometers).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <PlusCircle size={15} />
          <span>{showForm ? 'Hide Form' : 'Log Diagnostic Record'}</span>
        </button>
      </div>

      {/* Scope Disclaimer */}
      <div className="p-4 rounded-xl bg-[#EAF0ED] border border-[#D9E2DE] text-xs text-[#172A2B] flex items-start gap-2.5">
        <Info size={16} className="text-[#176B68] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Hardware Separation Notice:</strong> AAHMS stores and visualizes manual entries. The software does not directly perform blood analysis, optical fundoscopy, or chemical assays. All lab values must be generated using approved flight hardware kits.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#E4F2E9] border border-[#BDE0CB] text-[#247A55] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Diagnostic record successfully logged and +25 protocol points awarded!</span>
        </div>
      )}

      {/* New Diagnostic Entry Form */}
      {showForm && (
        <form
          onSubmit={handleAddRecord}
          className="bg-white rounded-xl border border-[#176B68] p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
            <h3 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
              New Manual Diagnostic Entry
            </h3>
            <span className="text-xs text-[#176B68] font-bold">
              Sol {overview?.missionDay || 90}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#172A2B] mb-1">
                Diagnostic Test Type
              </label>
              <select
                value={testType}
                onChange={(e) => handleTestTypeChange(e.target.value as ManualRecordEntry['testType'])}
                className="w-full px-3 py-2 border border-[#D9E2DE] rounded-lg bg-white font-medium"
              >
                <option value="Blood Glucose">Blood Glucose (Capillary Fasting)</option>
                <option value="Vision Acuity (SANS Check)">Vision Acuity (SANS Near-Vision)</option>
                <option value="Urine Hydration Index">Urine Hydration (Refractometer)</option>
                <option value="Salivary Cortisol">Salivary Cortisol (Stress Index)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#172A2B] mb-1">
                Measured Value & Unit
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={testValue}
                  onChange={(e) => setTestValue(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9E2DE] rounded-lg font-bold tabular-data"
                  placeholder="e.g. 94"
                />
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-28 px-3 py-2 border border-[#D9E2DE] rounded-lg font-mono text-xs bg-[#F4F6F4]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#172A2B] mb-1">
                Hardware Device Used
              </label>
              <input
                type="text"
                value={deviceUsed}
                onChange={(e) => setDeviceUsed(e.target.value)}
                className="w-full px-3 py-2 border border-[#D9E2DE] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172A2B] mb-1">
              Sample Notes & Technique Observations
            </label>
            <input
              type="text"
              value={techniqueNotes}
              onChange={(e) => setTechniqueNotes(e.target.value)}
              placeholder="e.g. Fasting 8 hours. Cartridge Lot #B24 calibrated."
              className="w-full px-3 py-2 text-xs border border-[#D9E2DE] rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-[#D9E2DE] text-xs font-semibold hover:bg-[#F4F6F4] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] cursor-pointer"
            >
              Submit Manual Record
            </button>
          </div>
        </form>
      )}

      {/* Manual Records Table */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
          <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
            Verified Manual Assessment History
          </h2>
          <span className="text-xs text-[#60716E]">
            {records.length} Records Ingested
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F6F4] text-[#172A2B] font-semibold border-b border-[#D9E2DE]">
              <tr>
                <th scope="col" className="px-3 py-2.5">Mission Sol</th>
                <th scope="col" className="px-3 py-2.5">Assessment Type</th>
                <th scope="col" className="px-3 py-2.5">Result</th>
                <th scope="col" className="px-3 py-2.5">Hardware / Device</th>
                <th scope="col" className="px-3 py-2.5">Technique Notes</th>
                <th scope="col" className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E2DE]">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F9FBFA]">
                  <td className="px-3 py-3 font-mono font-bold text-[#172A2B]">
                    Sol {rec.missionDay}
                  </td>
                  <td className="px-3 py-3 font-semibold text-[#172A2B]">
                    {rec.testType}
                  </td>
                  <td className="px-3 py-3 font-bold tabular-nums text-[#172A2B]">
                    {rec.value} <span className="text-xs font-normal text-[#60716E]">{rec.unit}</span>
                  </td>
                  <td className="px-3 py-3 text-[#60716E]">
                    {rec.deviceUsed}
                  </td>
                  <td className="px-3 py-3 text-[#60716E] max-w-xs truncate">
                    {rec.techniqueNotes || 'Nominal protocol'}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={rec.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
