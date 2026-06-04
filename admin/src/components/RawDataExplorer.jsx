import { useState, useMemo } from 'react';
import Modal from './Modal';
import { patchField } from '../api/adminApi';

function JsonViewer({ data }) {
  const formatValue = (value) => {
    if (value === null) return <span className="null">null</span>;
    if (typeof value === 'boolean') return <span className="boolean">{String(value)}</span>;
    if (typeof value === 'number') return <span className="number">{value}</span>;
    if (typeof value === 'string') return <span className="string">"{value}"</span>;
    return String(value);
  };

  return (
    <div className="json-viewer">
      {'{\n'}
      {Object.entries(data).map(([key, value], i, arr) => (
        <div key={key} style={{ paddingLeft: '20px' }}>
          <span className="key">"{key}"</span>: {formatValue(value)}
          {i < arr.length - 1 ? ',' : ''}
        </div>
      ))}
      {'}'}
    </div>
  );
}

export default function RawDataExplorer({ data, tableName, pkField, onRefresh }) {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [patchModal, setPatchModal] = useState(null);
  const [patchValue, setPatchValue] = useState('');
  const [patchLoading, setPatchLoading] = useState(false);

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const sortedData = useMemo(() => {
    if (!data) return [];
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortDir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [data, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handlePatch = async () => {
    setPatchLoading(true);
    try {
      await patchField(tableName, patchModal.recordId, patchModal.field, patchValue);
      setPatchModal(null);
      setPatchValue('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Patch failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setPatchLoading(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="glass-card empty-state">
        <h3>No data available</h3>
        <p>Select a table to explore its data.</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflow: 'auto', maxHeight: '600px' }}>
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className={`sortable ${sortField === col ? (sortDir === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}
                  >
                    {col}
                  </th>
                ))}
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, i) => (
                <tr key={row[pkField] || i}>
                  {columns.map((col) => (
                    <td
                      key={col}
                      style={{ maxWidth: '200px', cursor: 'pointer' }}
                      className="truncate"
                      title={String(row[col] ?? '')}
                      onDoubleClick={() => {
                        if (col !== pkField && col !== 'password_hash') {
                          setPatchModal({ recordId: row[pkField], field: col });
                          setPatchValue(String(row[col] ?? ''));
                        }
                      }}
                    >
                      {row[col] === null ? (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>null</span>
                      ) : typeof row[col] === 'boolean' ? (
                        <span className={`badge ${row[col] ? 'badge-emerald' : 'badge-slate'}`}>
                          {String(row[col])}
                        </span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn-icon"
                      title="View JSON"
                      onClick={() => setSelectedRecord(row)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          {sortedData.length} record(s) · Double-click a cell to edit
        </div>
      </div>

      {/* JSON Viewer Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Record Details"
      >
        {selectedRecord && <JsonViewer data={selectedRecord} />}
      </Modal>

      {/* Patch Field Modal */}
      <Modal
        isOpen={!!patchModal}
        onClose={() => setPatchModal(null)}
        title={`Edit ${patchModal?.field || ''}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setPatchModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePatch} disabled={patchLoading}>
              {patchLoading ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Table: <strong>{tableName}</strong> · Record ID: <strong>{patchModal?.recordId}</strong> · Field: <strong>{patchModal?.field}</strong>
          </label>
          <input
            type="text"
            value={patchValue}
            onChange={(e) => setPatchValue(e.target.value)}
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}
