'use client';
import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Make sure the path is correct
import Link from 'next/link';

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: { target: { files: React.SetStateAction<null>[]; }; }) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    setKeywords([]);
    setSummary('');
    setIsLoading(true); // Start loading

    if (!file) {
      alert('Please select a file to upload');
      setIsLoading(false); // Stop loading because there is no file
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setKeywords(response.data.filename.important_keywords);
      setSummary(response.data.filename.summary);
    } catch (error) {
      console.error('Error uploading file: ', error);
      setKeywords([]);
      setSummary('');
    }
    setIsLoading(false); // Stop loading after the request is finished
  };



  return (
    <div className="dashboard">
      <aside className="sidebar">
        <header className="sidebar-header">Upload your PDF</header>
        <form onSubmit={handleSubmit} className="upload-form">
          <input type="file" onChange={handleFileChange} />
          <button type="submit" className="sidebar-btn">Upload</button>
        </form>
        <Link href="/">
        <button
        className="home-btn">
        Home
        </button>
      </Link>
      </aside>
      <main className="content">
        <div className="chart-container">
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <><table>
              <thead>
                <tr>
                  <th><b>Keyword:</b></th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((keyword, index) => (
                  <tr key={index}>
                    <td>{keyword}</td>
                  </tr>
                ))}
              </tbody>
            </table><table>
                <thead>
                  <tr>
                    <th><b>Summary:</b></th>
                  </tr>
                </thead>
              </table><p>{summary}</p></>
          )}
        </div>
      </main>
    </div>
  );
};

export default FileUploadPage;
