import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileUp, File, Download, Trash2, Clock, User, ExternalLink, Loader2 } from 'lucide-react';
import { fileApi } from '../api';
import { useWorkspace } from '../context/WorkspaceContext';
import LoadingSpinner from '../components/LoadingSpinner';

const FileManagement = () => {
  const { workspaceId, workspaceName } = useWorkspace();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchFiles();
    }
  }, [workspaceId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fileApi.getByWorkspace(workspaceId);
      if (res.success) setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);

    try {
      setUploading(true);
      const res = await fileApi.upload(formData);
      if (res.success) {
        setFiles([res.data, ...files]);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dashboard / Files</p>
          <h2 className="text-2xl font-semibold text-primary">Workspace Files — {workspaceName}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage shared documents and assets.</p>
        </div>
        
        <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 shadow-sm transition-all cursor-pointer">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} />}
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      {/* File List */}
      <div className="bg-surface rounded-xl shadow-sm border border-border flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-gray-50/50 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Storage used: {formatSize(files.reduce((acc, f) => acc + Number(f.file_size_bytes), 0))}</span>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">{files.length} Files</span>
        </div>

        <div className="overflow-y-auto flex-1">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
              <File size={48} className="opacity-20" />
              <p className="text-sm font-medium">No files uploaded yet.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50/30 font-extrabold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Uploaded At</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.file_id} className="border-b border-border hover:bg-gray-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-primary">
                          <File size={16} />
                        </div>
                        <span className="text-sm font-bold text-primary truncate max-w-[200px]">{file.file_name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-gray-500">{formatSize(file.file_size_bytes)}</td>
                    <td className="p-4">
                      <span className="text-[9px] font-extrabold bg-gray-100 text-gray-500 px-2 py-0.5 rounded border shadow-sm">
                        {file.mime_type ? (file.mime_type.includes('/') ? file.mime_type.split('/')[1].toUpperCase() : file.mime_type.toUpperCase()) : 'FILE'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-primary">{new Date(file.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={fileApi.getDownloadUrl(file.file_id)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          title="Download"
                        >
                          <Download size={16} />
                        </a>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManagement;
