import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../network/network';

const SelectBoxes = () => {
  const [logLevel, setLogLevel] = useState('');
  const [logTypeName, setLogTypeName] = useState('');
  const [logSource, setLogSource] = useState('');
  const [date, setDate] = useState('');
  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(2);
  const [serviceNames, setServiceNames] = useState([]);

  useEffect(() => {
    fetchData();
  }, [logLevel, logTypeName, logSource, date, searchText]);

  useEffect(() => {
    fetchServiceNames();
  }, []);

  const fetchServiceNames = async () => {
    try {
      const response = await axios.get('example.com/service-names');
      setServiceNames(response.data);
    } catch (error) {
      console.error('Error fetching service names:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(api, {
        params: { logLevel, logTypeName, logSource, date, searchText }
      });
      const fetchedLogs = response.data.hits.hits.map(hit => ({
        ...hit._source,
        date: formatDateTime(hit._source.date)
      }));
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Istanbul'
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString('en-GB', options);
  };

  const getLogClassName = (log) => {
    return log.logTypeName === 'ERROR' ? 'text-red-500' : 'text-green-500';
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full flex justify-between">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4 mt-12">
            <div className="mb-4">
              <label htmlFor="logLevel" className="block mb-2">Log Level:</label>
              <select id="logLevel" value={logLevel} onChange={(e) => setLogLevel(e.target.value)} className="border border-gray-300 border-blue-400 rounded px-3 py-1 w-full">
                <option value="">Select Log Level</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="logTypeName" className="block mb-2">Log Type Name:</label>
              <select id="logTypeName" value={logTypeName} onChange={(e) => setLogTypeName(e.target.value)} className="border border-blue-400 rounded px-3 py-1 w-full">
                <option value="">Select Log Type Name</option>
                <option value="ERROR">ERROR</option>
                <option value="INFO">INFO</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="logSource" className="block mb-2">Log Source:</label>
              <select id="logSource" value={logSource} onChange={(e) => setLogSource(e.target.value)} className="border border-blue-400 rounded px-3 py-1 w-full">
                <option value="">Select Log Source</option>
                {serviceNames.map((serviceName, index) => (
                  <option key={index} value={serviceName}>{serviceName}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block mb-2">Date:</label>
              <select id="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-blue-400 rounded px-3 py-1 w-full">
                <option value="">Select Date</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_week">Last Week</option>
                <option value="last_month">Last Month</option>
                <option value="older_than_month">Older Than a Month</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="search" className="block mb-2">Search:</label>
              <input type="text" id="search"
                className="border border-blue-400 rounded px-3 py-1 w-full" value={searchText} onChange={handleSearchChange} placeholder="Enter text to search" />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 w-full"
            >
              Fetch Logs
            </button>
          </form>
        </div>
        <LogsDisplay
          currentLogs={currentLogs}
          getLogClassName={getLogClassName}
          paginate={paginate}
          currentPage={currentPage}
          totalPages={totalPages}
          logsLength={logs.length}
          logsPerPage={logsPerPage}
          indexOfLastLog={indexOfLastLog} // buraya indexOfLastLog ekleyin
        />
      </div>
    </div>
  );
};

const LogsDisplay = ({ currentLogs, getLogClassName, paginate, currentPage, totalPages, logsLength, logsPerPage, indexOfLastLog }) => (
  <div className="w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-8">Logs</h2>
    <ul className="space-y-4">
      {currentLogs.map((log, index) => (
        <li key={index} className="border border-gray-300 p-4 rounded-md">
          <p><strong>Log Level:</strong> {log.logLevel}</p>
          <p><strong>Log Type: </strong><b className={getLogClassName(log)}>{log.logTypeName}</b></p>
          <p><strong>Log Source:</strong> {log.logSource}</p>
          <p><strong>Date:</strong> {log.date}</p>
          <p><strong>Subject:</strong> {log.subject}</p>
          {log.location && <p><strong>Location:</strong> {log.location}</p>}
          {log.params && (
            <>
              <strong>Params:</strong>
              <ul className="pl-4">
                {Object.entries(log.params).map(([key, value], i) => (
                  <li key={i}>
                    <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                  </li>
                ))}
              </ul>
            </>
          )}
        </li>
      ))}
    </ul>
    <nav className="mt-4" aria-label="Pagination">
      <ul className="flex justify-center">
        <li className="mr-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded-md"
          >
            Previous
          </button>
        </li>
        <li className="ml-2">
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={logsLength <= indexOfLastLog}
            className="px-3 py-1 bg-gray-200 rounded-md"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
    <p className="mt-4 text-center text-gray-500">Page {currentPage} of {totalPages}</p>
  </div>
);

export default SelectBoxes;
