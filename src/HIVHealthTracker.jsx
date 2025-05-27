import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Check, AlertTriangle, ChevronDown, Plus, Save, X } from 'lucide-react';

const HIVHealthTracker = () => {
  // State for tracking health metrics
  const [healthData, setHealthData] = useState([]);
  const [medications, setMedications] = useState([]);
 
  // Form states
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
 
  // Health metrics input state
  const [newHealthRecord, setNewHealthRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    viralLoad: '',
    cd4Count: ''
  });
 
  // Medication input state
  const [newMedication, setNewMedication] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    supplyDays: '30',
    refillHistory: []
  });
 
  const [newRefill, setNewRefill] = useState({
    date: new Date().toISOString().split('T')[0],
    supplyDays: '30'
  });

  // Initialize with sample data
  useEffect(() => {
    // Sample data for demonstration
    const sampleHealthData = [
      { date: '2025-01-15', viralLoad: 1200, cd4Count: 350 },
      { date: '2025-02-15', viralLoad: 800, cd4Count: 420 },
      { date: '2025-03-15', viralLoad: 500, cd4Count: 480 },
      { date: '2025-04-15', viralLoad: 200, cd4Count: 550 },
      { date: '2025-05-01', viralLoad: 50, cd4Count: 620 }
    ];
   
    const sampleMedications = [
      {
        name: 'Biktarvy',
        startDate: '2025-01-01',
        supplyDays: '30',
        refillHistory: [
          { date: '2025-01-01', supplyDays: '30' },
          { date: '2025-02-01', supplyDays: '30' },
          { date: '2025-03-01', supplyDays: '30' },
          { date: '2025-04-01', supplyDays: '90' },
        ]
      }
    ];
   
    setHealthData(sampleHealthData);
    setMedications(sampleMedications);
  }, []);
 
  // Handle health record form input changes
  const handleHealthInputChange = (e) => {
    const { name, value } = e.target;
    setNewHealthRecord({
      ...newHealthRecord,
      [name]: name === 'date' ? value : Number(value)
    });
  };
 
  // Add new health record
  const addHealthRecord = () => {
    if (!newHealthRecord.viralLoad && !newHealthRecord.cd4Count) return;
   
    const newRecord = {
      date: newHealthRecord.date,
      viralLoad: newHealthRecord.viralLoad || null,
      cd4Count: newHealthRecord.cd4Count || null
    };
   
    const updatedHealthData = [...healthData, newRecord].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );
   
    setHealthData(updatedHealthData);
    setNewHealthRecord({
      date: new Date().toISOString().split('T')[0],
      viralLoad: '',
      cd4Count: ''
    });
    setShowHealthForm(false);
  };
 
  // Handle medication form input changes
  const handleMedicationInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication({
      ...newMedication,
      [name]: value
    });
  };
 
  // Handle refill form input changes
  const handleRefillInputChange = (e) => {
    const { name, value } = e.target;
    setNewRefill({
      ...newRefill,
      [name]: value
    });
  };
 
  // Add new medication
  const addMedication = () => {
    if (!newMedication.name) return;
   
    const medication = {
      ...newMedication,
      refillHistory: [
        {
          date: newMedication.startDate,
          supplyDays: newMedication.supplyDays
        }
      ]
    };
   
    setMedications([...medications, medication]);
    setNewMedication({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      supplyDays: '30',
      refillHistory: []
    });
    setShowMedicationForm(false);
  };
 
  // Add refill to medication
  const addRefill = (medicationIndex) => {
    const updatedMedications = [...medications];
    updatedMedications[medicationIndex].refillHistory.push(newRefill);
   
    // Sort refill history by date
    updatedMedications[medicationIndex].refillHistory.sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );
   
    setMedications(updatedMedications);
    setNewRefill({
      date: new Date().toISOString().split('T')[0],
      supplyDays: '30'
    });
  };
 
  // Check if there are adherence gaps in medication
  const checkAdherenceGaps = (refillHistory) => {
    const gaps = [];
   
    for (let i = 0; i < refillHistory.length - 1; i++) {
      const currentRefill = refillHistory[i];
      const nextRefill = refillHistory[i + 1];
     
      const currentEndDate = new Date(currentRefill.date);
      currentEndDate.setDate(currentEndDate.getDate() + parseInt(currentRefill.supplyDays));
     
      const nextRefillDate = new Date(nextRefill.date);
     
      // If there's more than 3 days gap, consider it a gap in adherence
      if ((nextRefillDate - currentEndDate) > (3 * 24 * 60 * 60 * 1000)) {
        gaps.push({
          gapStart: currentEndDate.toISOString().split('T')[0],
          gapEnd: nextRefill.date,
          days: Math.round((nextRefillDate - currentEndDate) / (24 * 60 * 60 * 1000))
        });
      }
    }
   
    return gaps;
  };
 
  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800">HIV Health Tracker</h1>
          <p className="text-gray-600 mt-2">Monitor your health metrics and medication adherence over time</p>
        </header>
       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Metrics Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Health Metrics</h2>
              <button
                onClick={() => setShowHealthForm(!showHealthForm)}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                <span>Add Record</span>
              </button>
            </div>
           
            {/* Add Health Record Form */}
            {showHealthForm && (
              <div className="mb-6 p-4 border border-blue-200 rounded-md bg-blue-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-blue-800">New Health Record</h3>
                  <button onClick={() => setShowHealthForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newHealthRecord.date}
                      onChange={handleHealthInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Viral Load</label>
                    <input
                      type="number"
                      name="viralLoad"
                      placeholder="copies/mL"
                      value={newHealthRecord.viralLoad}
                      onChange={handleHealthInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CD4 Count</label>
                    <input
                      type="number"
                      name="cd4Count"
                      placeholder="cells/mm³"
                      value={newHealthRecord.cd4Count}
                      onChange={handleHealthInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={addHealthRecord}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Save size={16} /> Save Record
                  </button>
                </div>
              </div>
            )}
           
            {/* Health Metrics Chart */}
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'viralLoad' ? `${value} copies/mL` : `${value} cells/mm³`,
                      name === 'viralLoad' ? 'Viral Load' : 'CD4 Count'
                    ]}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="viralLoad"
                    name="Viral Load"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cd4Count"
                    name="CD4 Count"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
           
            {/* Health Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viral Load</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CD4 Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {healthData.slice().reverse().map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.viralLoad !== null ? `${record.viralLoad} copies/mL` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.cd4Count !== null ? `${record.cd4Count} cells/mm³` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
         
          {/* Medication Adherence Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Medication Adherence</h2>
              <button
                onClick={() => setShowMedicationForm(!showMedicationForm)}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                <span>Add Medication</span>
              </button>
            </div>
           
            {/* Add Medication Form */}
            {showMedicationForm && (
              <div className="mb-6 p-4 border border-blue-200 rounded-md bg-blue-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-blue-800">New Medication</h3>
                  <button onClick={() => setShowMedicationForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newMedication.name}
                      onChange={handleMedicationInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={newMedication.startDate}
                      onChange={handleMedicationInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Supply</label>
                    <select
                      name="supplyDays"
                      value={newMedication.supplyDays}
                      onChange={handleMedicationInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="30">30 Day Supply</option>
                      <option value="90">90 Day Supply</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={addMedication}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Save size={16} /> Save Medication
                  </button>
                </div>
              </div>
            )}
           
            {/* Medications List */}
            {medications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No medications added yet</div>
            ) : (
              <div className="space-y-6">
                {medications.map((medication, medIndex) => {
                  const adherenceGaps = checkAdherenceGaps(medication.refillHistory);
                  const lastRefill = medication.refillHistory[medication.refillHistory.length - 1];
                  const lastRefillDate = new Date(lastRefill.date);
                  const supplyEndDate = new Date(lastRefillDate);
                  supplyEndDate.setDate(lastRefillDate.getDate() + parseInt(lastRefill.supplyDays));
                  const today = new Date();
                  const isActive = supplyEndDate >= today;
                  const daysRemaining = Math.ceil((supplyEndDate - today) / (1000 * 60 * 60 * 24));
                 
                  return (
                    <div key={medIndex} className="border rounded-md overflow-hidden">
                      <div className={`px-4 py-3 flex justify-between items-center ${isActive ? 'bg-green-50 border-b border-green-100' : 'bg-gray-50 border-b border-gray-100'}`}>
                        <div>
                          <h3 className="font-medium text-gray-900">{medication.name}</h3>
                          <div className="text-sm text-gray-600">Started: {formatDate(medication.startDate)}</div>
                        </div>
                        <div className="flex items-center">
                          {isActive ? (
                            <span className="flex items-center text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
                              <Check size={16} className="mr-1" />
                              {daysRemaining} days remaining
                            </span>
                          ) : (
                            <span className="flex items-center text-sm text-red-700 bg-red-100 px-2 py-1 rounded">
                              <AlertTriangle size={16} className="mr-1" />
                              Refill needed
                            </span>
                          )}
                        </div>
                      </div>
                     
                      <div className="p-4">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Refill History</h4>
                          <div className="space-y-2">
                            {medication.refillHistory.map((refill, refillIndex) => (
                              <div key={refillIndex} className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded">
                                <span className="flex items-center">
                                  <Calendar size={16} className="mr-2 text-gray-500" />
                                  {formatDate(refill.date)}
                                </span>
                                <span className="flex items-center">
                                  <Clock size={16} className="mr-2 text-gray-500" />
                                  {refill.supplyDays} day supply
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                       
                        {/* Add Refill Form */}
                        <div className="mb-4">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={newRefill.date}
                              onChange={(e) => handleRefillInputChange(e)}
                              name="date"
                              className="border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                            <select
                              value={newRefill.supplyDays}
                              onChange={(e) => handleRefillInputChange(e)}
                              name="supplyDays"
                              className="border border-gray-300 rounded px-3 py-2 text-sm"
                            >
                              <option value="30">30 Day Supply</option>
                              <option value="90">90 Day Supply</option>
                            </select>
                          </div>
                          <button
                            onClick={() => addRefill(medIndex)}
                            className="mt-2 w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition flex items-center justify-center gap-1"
                          >
                            <Plus size={16} /> Add Refill
                          </button>
                        </div>
                       
                        {/* Adherence Gaps */}
                        {adherenceGaps.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-red-700 mb-2">Adherence Gaps</h4>
                            <div className="space-y-2">
                              {adherenceGaps.map((gap, gapIndex) => (
                                <div key={gapIndex} className="flex justify-between items-center text-sm bg-red-50 px-3 py-2 rounded border border-red-100">
                                  <span>
                                    {formatDate(gap.gapStart)} - {formatDate(gap.gapEnd)}
                                  </span>
                                  <span className="font-medium text-red-700">{gap.days} days gap</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HIVHealthTracker;
