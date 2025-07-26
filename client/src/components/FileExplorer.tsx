import React, { useState, useEffect, useCallback } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  ChevronRight,
  ChevronDown,
  Upload,
  Download,
  Trash2,
  Edit,
  Copy,
  Cut,
  Paste,
  Star,
  Clock,
  Search,
  Grid,
  List,
  MoreHorizontal,
  Plus,
  Home,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Settings,
  X,
  Check,
  FolderPlus,
  FileUp,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { FileSystemFolder, FileSystemFile } from '@shared/schema';

interface FileExplorerProps {
  className?: string;
}

interface FileSystemItem {
  id: number;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  lastModified: Date;
  isShared: boolean;
  path: string;
  parentId?: number;
  mimeType?: string;
  fileExtension?: string;
  icon?: string;
  color?: string;
}

interface BreadcrumbItem {
  id: number;
  name: string;
  path: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const FileExplorer: React.FC<FileExplorerProps> = ({ className }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameItemId, setRenameItemId] = useState<number | null>(null);
  const [renameName, setRenameName] = useState('');
  const [draggedItem, setDraggedItem] = useState<FileSystemItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [clipboard, setClipboard] = useState<{ items: FileSystemItem[]; operation: 'copy' | 'cut' } | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<{ folderId: number | null; path: string }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Queries
  const { data: folders = [], isLoading: foldersLoading } = useQuery<FileSystemFolder[]>({
    queryKey: ['/api/file-system/folders', currentFolderId],
    queryFn: () => apiRequest(`/api/file-system/folders?parentId=${currentFolderId || ''}`),
  });

  const { data: files = [], isLoading: filesLoading } = useQuery<FileSystemFile[]>({
    queryKey: ['/api/file-system/files', currentFolderId],
    queryFn: () => apiRequest(`/api/file-system/files?folderId=${currentFolderId || ''}`),
  });

  const { data: breadcrumbs = [] } = useQuery<BreadcrumbItem[]>({
    queryKey: ['/api/file-system/breadcrumbs', currentFolderId],
    queryFn: () => apiRequest(`/api/file-system/breadcrumbs?folderId=${currentFolderId || ''}`),
  });

  // Mutations
  const createFolderMutation = useMutation({
    mutationFn: (data: { name: string; parentId?: number }) => 
      apiRequest('/api/file-system/folders', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/file-system/folders'] });
      setShowNewFolderDialog(false);
      setNewFolderName('');
      toast({ title: "Folder created successfully" });
    },
    onError: () => toast({ title: "Failed to create folder", variant: "destructive" }),
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, name, type }: { id: number; name: string; type: 'folder' | 'file' }) =>
      apiRequest(`/api/file-system/${type}s/${id}`, { method: 'PATCH', body: { name } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/file-system/folders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/file-system/files'] });
      setShowRenameDialog(false);
      setRenameItemId(null);
      setRenameName('');
      toast({ title: "Item renamed successfully" });
    },
    onError: () => toast({ title: "Failed to rename item", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, type }: { id: number; type: 'folder' | 'file' }) =>
      apiRequest(`/api/file-system/${type}s/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/file-system/folders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/file-system/files'] });
      toast({ title: "Item deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete item", variant: "destructive" }),
  });

  const uploadFileMutation = useMutation({
    mutationFn: (formData: FormData) => 
      apiRequest('/api/file-system/files/upload', { method: 'POST', body: formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/file-system/files'] });
      toast({ title: "File uploaded successfully" });
    },
    onError: () => toast({ title: "Failed to upload file", variant: "destructive" }),
  });

  // Helper functions
  const getFileIcon = (mimeType: string, extension: string) => {
    if (mimeType?.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (mimeType?.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (mimeType?.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (extension === '.zip' || extension === '.rar' || extension === '.7z') return <Archive className="w-4 h-4" />;
    if (extension === '.pdf' || extension === '.doc' || extension === '.docx') return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // Navigation functions
  const navigateToFolder = useCallback((folderId: number | null, path: string) => {
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push({ folderId, path });
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(folderId);
    setCurrentPath(path);
    setSelectedItems(new Set());
  }, [navigationHistory, historyIndex]);

  const navigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { folderId, path } = navigationHistory[newIndex];
      setHistoryIndex(newIndex);
      setCurrentFolderId(folderId);
      setCurrentPath(path);
      setSelectedItems(new Set());
    }
  };

  const navigateForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const { folderId, path } = navigationHistory[newIndex];
      setHistoryIndex(newIndex);
      setCurrentFolderId(folderId);
      setCurrentPath(path);
      setSelectedItems(new Set());
    }
  };

  const navigateToRoot = () => {
    navigateToFolder(null, '/');
  };

  // File operations
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      if (currentFolderId) {
        formData.append('folderId', currentFolderId.toString());
      }

      // Add to upload progress
      setUploadProgress(prev => [...prev, {
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }]);

      uploadFileMutation.mutate(formData);
    });
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolderMutation.mutate({
        name: newFolderName.trim(),
        parentId: currentFolderId || undefined
      });
    }
  };

  const handleRename = () => {
    if (renameName.trim() && renameItemId) {
      const item = [...combinedItems].find(item => item.id === renameItemId);
      if (item) {
        renameMutation.mutate({
          id: renameItemId,
          name: renameName.trim(),
          type: item.type
        });
      }
    }
  };

  const handleDelete = (item: FileSystemItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteMutation.mutate({ id: item.id, type: item.type });
    }
  };

  const handleCopy = () => {
    const items = [...combinedItems].filter(item => selectedItems.has(item.id));
    setClipboard({ items, operation: 'copy' });
    toast({ title: `Copied ${items.length} item(s)` });
  };

  const handleCut = () => {
    const items = [...combinedItems].filter(item => selectedItems.has(item.id));
    setClipboard({ items, operation: 'cut' });
    toast({ title: `Cut ${items.length} item(s)` });
  };

  const handlePaste = () => {
    if (clipboard) {
      // TODO: Implement paste functionality
      toast({ title: `Pasted ${clipboard.items.length} item(s)` });
      setClipboard(null);
    }
  };

  // Combine folders and files for display
  const combinedItems: FileSystemItem[] = [
    ...folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      type: 'folder' as const,
      lastModified: folder.updatedAt || folder.createdAt || new Date(),
      isShared: folder.isShared,
      path: folder.path,
      parentId: folder.parentId || undefined,
      icon: folder.icon,
      color: folder.color
    })),
    ...files.map(file => ({
      id: file.id,
      name: file.name,
      type: 'file' as const,
      size: file.fileSize,
      lastModified: file.updatedAt || file.createdAt || new Date(),
      isShared: file.isShared,
      path: file.filePath,
      parentId: file.folderId || undefined,
      mimeType: file.mimeType,
      fileExtension: file.fileExtension
    }))
  ];

  // Filter items based on search
  const filteredItems = combinedItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize navigation history
  useEffect(() => {
    if (navigationHistory.length === 0) {
      setNavigationHistory([{ folderId: null, path: '/' }]);
      setHistoryIndex(0);
    }
  }, [navigationHistory.length]);

  return (
    <div className={`bg-blue-800 text-white rounded-lg border border-blue-700 overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-blue-700 border-b border-blue-600">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            disabled={historyIndex <= 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateForward}
            disabled={historyIndex >= navigationHistory.length - 1}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToRoot}
          >
            <Home className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/file-system/folders'] });
              queryClient.invalidateQueries({ queryKey: ['/api/file-system/files'] });
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-blue-600 border-blue-500 text-white"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-3 bg-blue-700/50 border-b border-blue-600">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewFolderDialog(true)}
          >
            <FolderPlus className="w-4 h-4 mr-1" />
            New Folder
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <FileUp className="w-4 h-4 mr-1" />
            Upload
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {selectedItems.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCut}>
                <Cut className="w-4 h-4 mr-1" />
                Cut
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                disabled={!clipboard}
              >
                <Paste className="w-4 h-4 mr-1" />
                Paste
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const item = filteredItems.find(item => selectedItems.has(item.id));
                  if (item) handleDelete(item);
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-white">
          {selectedItems.size > 0 && (
            <span>{selectedItems.size} item(s) selected</span>
          )}
          <span>{filteredItems.length} item(s)</span>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center p-3 bg-blue-700/30 border-b border-blue-600">
        <div className="flex items-center space-x-1 text-sm">
          <Home className="w-4 h-4" />
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="w-4 h-4 text-blue-400" />
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-blue-400 hover:text-white"
                onClick={() => navigateToFolder(crumb.id, crumb.path)}
              >
                {crumb.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="p-3 bg-blue-700/50 border-b border-blue-600">
          <div className="space-y-2">
            {uploadProgress.map((upload, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm truncate">{upload.fileName}</span>
                <div className="flex items-center space-x-2">
                  {upload.status === 'uploading' && (
                    <Progress value={upload.progress} className="w-20" />
                  )}
                  {upload.status === 'completed' && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File/Folder Grid */}
      <div className="flex-1 overflow-auto p-4">
        {(foldersLoading || filesLoading) ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              : "space-y-1"
          }>
            {filteredItems.map((item) => (
              <ContextMenu key={item.id}>
                <ContextMenuTrigger>
                  <div
                    className={`
                      relative p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedItems.has(item.id) 
                        ? 'bg-blue-600/20 border-blue-500' 
                        : 'bg-blue-700/50 border-blue-600 hover:bg-blue-600/50'
                      }
                      ${viewMode === 'list' ? 'flex items-center space-x-3' : 'text-center'}
                    `}
                    onClick={(e) => {
                      if (e.ctrlKey || e.metaKey) {
                        const newSelected = new Set(selectedItems);
                        if (newSelected.has(item.id)) {
                          newSelected.delete(item.id);
                        } else {
                          newSelected.add(item.id);
                        }
                        setSelectedItems(newSelected);
                      } else {
                        setSelectedItems(new Set([item.id]));
                      }
                    }}
                    onDoubleClick={() => {
                      if (item.type === 'folder') {
                        navigateToFolder(item.id, item.path);
                      } else {
                        // TODO: Open file
                        toast({ title: `Opening ${item.name}` });
                      }
                    }}
                  >
                    <div className={`flex items-center ${viewMode === 'grid' ? 'justify-center mb-2' : ''}`}>
                      {item.type === 'folder' ? (
                        <Folder className="w-8 h-8 text-blue-400" />
                      ) : (
                        getFileIcon(item.mimeType || '', item.fileExtension || '')
                      )}
                      {item.isShared && (
                        <Star className="w-3 h-3 absolute top-1 right-1 text-yellow-400" />
                      )}
                    </div>
                    <div className={`${viewMode === 'grid' ? 'space-y-1' : 'flex-1'}`}>
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      {viewMode === 'grid' && (
                        <div className="text-xs text-white">
                          {formatDate(item.lastModified)}
                        </div>
                      )}
                      {viewMode === 'list' && (
                        <div className="flex items-center space-x-4 text-sm text-white">
                          <span>{formatDate(item.lastModified)}</span>
                          {item.size && <span>{formatFileSize(item.size)}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      if (item.type === 'folder') {
                        navigateToFolder(item.id, item.path);
                      }
                    }}
                  >
                    Open
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => {
                      setRenameItemId(item.id);
                      setRenameName(item.name);
                      setShowRenameDialog(true);
                    }}
                  >
                    Rename
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(item)}>
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !foldersLoading && !filesLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <Folder className="w-16 h-16 mb-4" />
            <p>This folder is empty</p>
            <p className="text-sm">Drop files here or click "Upload" to add files</p>
          </div>
        )}
      </div>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="New name"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!renameName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileExplorer;