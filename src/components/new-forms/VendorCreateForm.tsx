import React from 'react';
import Button from '../UI/Button/Button';
import Dropdown from '../UI/Dropdown/Dropdown';

interface VendorCreateFormProps {
  onVendorCreated: (vendor: any) => void;
}

const VendorCreateForm: React.FC<VendorCreateFormProps> = ({ onVendorCreated }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor = {
      id: Date.now().toString(),
      ...formData,
      resourcesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onVendorCreated(newVendor);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
        <Dropdown
          options={['Staffing', 'Consulting', 'Technology', 'Healthcare']}
          value={formData.industry}
          onChange={(value) => setFormData({ ...formData, industry: value as string })}
          placeholder="Select Industry"
          required
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">Create Vendor</Button>
      </div>
    </form>
  );
};

export default VendorCreateForm;


