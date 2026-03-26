import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, MapPin, Droplet, LogOut, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Form State for New Donor
  const [formData, setFormData] = useState({
    name: '', bloodGroup: 'O+', city: '', phone: ''
  });

  const navigate = useNavigate();

  // 1. Fetch all donors from the database
  const fetchDonors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donors');
      setDonors(res.data);
    } catch (err) {
      console.error("Error fetching donors");
    }
  };

  useEffect(() => { fetchDonors(); }, []);

  // 2. Add New Donor Function
  const handleAddDonor = async (e) => {
    e.preventDefault();
    try {
      // We use our register API to add donors for now
      await axios.post('http://localhost:5000/api/register', {
        name: formData.name,
        email: `${formData.name.replace(/\s/g, '').toLowerCase()}${Math.floor(Math.random() * 1000)}@test.com`,
        password: 'password123',
        bloodGroup: formData.bloodGroup,
        city: formData.city,
        phone: formData.phone
      });
      setShowModal(false);
      fetchDonors(); // Refresh the list
      setFormData({ name: '', bloodGroup: 'O+', city: '', phone: '' });
    } catch (err) {
      alert("Error adding donor");
    }
  };

  // 3. Logout Function
  const handleLogout = () => {
    navigate('/');
  };

  // 4. Filter logic
  const filteredDonors = donors.filter(d => 
    (d.bloodGroup || "").includes(filterGroup) && 
    (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Droplet className="text-red-600" /> Blood Management
          </h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition font-semibold"
            >
              <Plus size={20} /> Add Donor
            </button>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition p-2"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or city..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 font-medium"
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {/* Donor List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map(donor => (
            <div key={donor._id} className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-red-600 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{donor.name}</h3>
                  <p className="text-red-600 font-bold">{donor.bloodGroup || 'O+'}</p>
                </div>
                <div className="bg-red-50 p-2 rounded-lg">
                  <Droplet className="text-red-600" size={20} />
                </div>
              </div>
              <div className="space-y-2 text-gray-600 mb-6 text-sm">
                <p className="flex items-center gap-2"><MapPin size={16}/> {donor.city || 'Not Specified'}</p>
                <p className="flex items-center gap-2"><Phone size={16}/> {donor.phone || 'No Contact'}</p>
              </div>
              <a href={`tel:${donor.phone}`} className="block w-full text-center bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition font-medium">
                Call Donor
              </a>
            </div>
          ))}
        </div>

        {/* ADD DONOR MODAL (POPUP) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
              <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-black">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Donor</h2>
              <form onSubmit={handleAddDonor} className="space-y-4">
                <input 
                  type="text" placeholder="Full Name" required
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <select 
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                <input 
                  type="text" placeholder="City" required
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <input 
                  type="text" placeholder="Phone Number" required
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">
                  Save Donor
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}