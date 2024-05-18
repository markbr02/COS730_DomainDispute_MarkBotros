'use client'
import { useState } from 'react';

/** 
* This code was generated by v0 by Vercel. 
* @see https://v0.dev/t/BS75Pr7BqLf 
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app 
*/

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/

interface FormData {
  domains: string;
  complainantName: string;
  complainantContact: string;
  registrantName: string;
  registrantType: string;
  disputeType: string;
  evidence: string;
  description: string;
  files: File[];
}

export default function Component() {
  const [formData, setFormData] = useState<FormData>({
    domains: '',
    complainantName: '',
    complainantContact: '',
    registrantName: '',
    registrantType: '',
    disputeType: 'Trademark Infringement', // Default value for dispute type
    evidence: '',
    description: '',
    files: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      files: Array.from(e.target.files || [])
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sanity checks
    if (!formData.domains || !formData.complainantName || !formData.complainantContact || !formData.registrantName || !formData.registrantType || !formData.disputeType || !formData.evidence || !formData.description) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const form = new FormData();
    for (const key in formData) {
      if (key === 'files') {
        formData.files.forEach((file) => {
          form.append('files', file);
        });
      } else {
        form.append(key, formData[key as keyof FormData] as string);
      }
    }

    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: form
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Success:', result);
      setMessage({ type: 'success', text: 'Form submitted successfully.' });
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'An error occurred while submitting the form.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Domain Dispute</h1>
          <p className="mt-3 text-lg text-gray-500">
            Follow the steps below to initiate a domain dispute.
          </p>
        </div>
        {message && (
          <div className={`p-4 mb-4 text-sm ${message.type === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-lg`} role="alert">
            {message.text}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-black" htmlFor="domains">
                Step 1: Enter the Disputed Domains
              </label>
              <div className="mt-1">
                <textarea
                  className="block w-full rounded-md border-2 border-blue-600 shadow-sm focus:border-light-navy focus:ring-light-navy sm:text-sm text-gray-700"
                  id="domains"
                  name="domains"
                  placeholder="example.com, example.net, example.org"
                  rows={3}
                  value={formData.domains}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-black" htmlFor="complainantName">
                Step 2: Enter Complainant Details
              </label>
              <div className="mt-1">
                <input
                  className="block w-full rounded-md border-2 border-blue-600 shadow-sm focus:border-light-navy focus:ring-light-navy sm:text-sm text-gray-700"
                  id="complainantName"
                  name="complainantName"
                  placeholder="John Doe"
                  type="text"
                  value={formData.complainantName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-black" htmlFor="complainantContact">
                Complainant Contact
              </label>
              <div className="mt-1">
                <input
                  className="block w-full rounded-md border-2 border-blue-600 shadow-sm focus:border-light-navy focus:ring-light-navy sm:text-sm text-gray-700"
                  id="complainantContact"
                  name="complainantContact"
                  placeholder="example@email.com"
                  type="email"
                  value={formData.complainantContact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-black" htmlFor="registrantName">
                Step 3: Enter Registrant Details
              </label>
              <div className="mt-1">
                <input
                  className="block w-full rounded-md border-2 border-blue-600 shadow-sm focus:border-light-navy focus:ring-light-navy sm:text-sm text-gray-700"
                  id="registrantName"
                  name="registrantName"
                  placeholder="Jane Doe"
                  type="text"
                  value={formData.registrantName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-black" htmlFor="registrantType">
                Registrant Type
              </label>
              <div className="mt-1">
                <input
                  className="block w-full rounded-md border-2 border-blue-600 shadow-sm focus:border-light-navy focus:ring-light-navy sm:text-sm text-gray-700"
                  id="registrantType"
                  name="registrantType"
                  placeholder="Individual, Company, etc."
                  type="text"
                  value={formData.registrantType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black" htmlFor="disputeType">
              Step 4: Select Dispute Type
            </label>
            <div className="mt-1">
              <select
                className="block w-full rounded-md border-2 border-blue-600 shadow-sm focus:border-light-navy focus:ring-light-navy sm:text-sm text-gray-700"
                id="disputeType"
                name="disputeType"
                value={formData.disputeType}
                onChange={handleChange}
                required
              >
                <option>Trademark Infringement</option>
                <option>Cybersquatting</option>
                <option>Unfair Competition</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black" htmlFor="evidence">
              Step 5: Provide Evidence
            </label>
            <div className="mt-1">
              <textarea
                className="block w-full rounded-md border-2 border-blue-600 shadow-sm focus:border-light-navy focus:ring-light-navy sm:text-sm text-gray-700"
                id="evidence"
                name="evidence"
                placeholder="Describe the evidence supporting your dispute..."
                rows={5}
                value={formData.evidence}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black" htmlFor="description">
              Step 6: Provide a Dispute Description
            </label>
            <div className="mt-1">
              <textarea
                className="block w-full rounded-md border-2 border-blue-600 shadow-sm focus:border-light-navy focus:ring-light-navy sm:text-sm text-gray-700"
                id="description"
                name="description"
                placeholder="Provide a detailed description of your dispute..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black" htmlFor="files">
              Step 7: Upload Files
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-blue-600 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  aria-hidden="true"
                  className="mx-auto h-12 w-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    className="relative cursor-pointer rounded-md bg-white font-medium text-light-navy focus-within:outline-none focus-within:ring-2 focus-within:ring-light-navy focus-within:ring-offset-2 hover:text-light-navy"
                    htmlFor="files"
                  >
                    <span>Upload a file</span>
                    <input
                      className="sr-only"
                      id="files"
                      name="files"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                <ul className="text-xs text-gray-700">
                  {formData.files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className={`inline-flex items-center rounded-md border border-blue-300 bg-light-navy px-4 py-2 text-sm font-medium text-black shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark-navy focus:outline-none focus:ring-2 focus:ring-dark-navy focus:ring-offset-2'}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
