import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { fileSystemFolders, fileSystemFiles, fileSystemShares, fileSystemFavorites, fileSystemRecent } from '@shared/schema';
import { insertFileSystemFolderSchema, insertFileSystemFileSchema } from '@shared/schema';
import { eq, and, isNull, like, desc } from 'drizzle-orm';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Allow all file types for training documents
    cb(null, true);
  }
});

// Helper function to generate file path
const generateFilePath = (fileName: string, folderId?: number) => {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const folderPath = folderId ? `folder_${folderId}` : 'root';
  return `uploads/${folderPath}/${timestamp}_${sanitizedName}`;
};

// Helper function to ensure directory exists
const ensureDirectoryExists = async (filePath: string) => {
  const dir = path.dirname(filePath);
  try {
    await stat(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
};

// Helper function to build folder path
const buildFolderPath = async (folderId: number | null, userId: number): Promise<string> => {
  if (!folderId) return '/';
  
  const folder = await db.query.fileSystemFolders.findFirst({
    where: and(
      eq(fileSystemFolders.id, folderId),
      eq(fileSystemFolders.userId, userId)
    )
  });
  
  if (!folder) return '/';
  
  if (folder.parentId) {
    const parentPath = await buildFolderPath(folder.parentId, userId);
    return `${parentPath}${folder.name}/`;
  }
  
  return `/${folder.name}/`;
};

// Get folders
router.get('/folders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parentId = req.query.parentId ? parseInt(req.query.parentId as string) : null;
    
    const folders = await db.query.fileSystemFolders.findMany({
      where: and(
        eq(fileSystemFolders.userId, userId),
        parentId ? eq(fileSystemFolders.parentId, parentId) : isNull(fileSystemFolders.parentId)
      ),
      orderBy: [fileSystemFolders.name]
    });

    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get files
router.get('/files', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const folderId = req.query.folderId ? parseInt(req.query.folderId as string) : null;
    
    const files = await db.query.fileSystemFiles.findMany({
      where: and(
        eq(fileSystemFiles.userId, userId),
        folderId ? eq(fileSystemFiles.folderId, folderId) : isNull(fileSystemFiles.folderId)
      ),
      orderBy: [fileSystemFiles.name]
    });

    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get breadcrumbs
router.get('/breadcrumbs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const folderId = req.query.folderId ? parseInt(req.query.folderId as string) : null;
    
    if (!folderId) {
      return res.json([]);
    }

    const breadcrumbs = [];
    let currentFolderId = folderId;

    while (currentFolderId) {
      const folder = await db.query.fileSystemFolders.findFirst({
        where: and(
          eq(fileSystemFolders.id, currentFolderId),
          eq(fileSystemFolders.userId, userId)
        )
      });

      if (!folder) break;

      breadcrumbs.unshift({
        id: folder.id,
        name: folder.name,
        path: folder.path
      });

      currentFolderId = folder.parentId;
    }

    res.json(breadcrumbs);
  } catch (error) {
    console.error('Error fetching breadcrumbs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create folder
router.post('/folders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, parentId } = insertFileSystemFolderSchema.parse(req.body);
    
    // Build the full path
    const parentPath = await buildFolderPath(parentId || null, userId);
    const fullPath = `${parentPath}${name}/`;

    const [folder] = await db.insert(fileSystemFolders).values({
      userId,
      name,
      parentId: parentId || null,
      path: fullPath,
      isRoot: !parentId
    }).returning();

    res.status(201).json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update folder
router.patch('/folders/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = parseInt(req.params.id);
    const { name } = z.object({ name: z.string().min(1) }).parse(req.body);

    const [folder] = await db.update(fileSystemFolders)
      .set({ name, updatedAt: new Date() })
      .where(and(
        eq(fileSystemFolders.id, id),
        eq(fileSystemFolders.userId, userId)
      ))
      .returning();

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    res.json(folder);
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete folder
router.delete('/folders/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = parseInt(req.params.id);

    // Check if folder has children
    const childFolders = await db.query.fileSystemFolders.findMany({
      where: and(
        eq(fileSystemFolders.parentId, id),
        eq(fileSystemFolders.userId, userId)
      )
    });

    const childFiles = await db.query.fileSystemFiles.findMany({
      where: and(
        eq(fileSystemFiles.folderId, id),
        eq(fileSystemFiles.userId, userId)
      )
    });

    if (childFolders.length > 0 || childFiles.length > 0) {
      return res.status(400).json({ error: 'Cannot delete folder with contents' });
    }

    await db.delete(fileSystemFolders)
      .where(and(
        eq(fileSystemFolders.id, id),
        eq(fileSystemFolders.userId, userId)
      ));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload file
router.post('/files/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;
    const originalName = req.file.originalname;
    const fileName = `${Date.now()}_${originalName}`;
    const filePath = generateFilePath(fileName, folderId || undefined);
    const fileExtension = path.extname(originalName);
    const mimeType = req.file.mimetype;

    // Ensure directory exists
    await ensureDirectoryExists(filePath);

    // Save file to disk
    await writeFile(filePath, req.file.buffer);

    // Save file record to database
    const [file] = await db.insert(fileSystemFiles).values({
      userId,
      folderId,
      name: originalName,
      originalName,
      fileName,
      fileSize: req.file.size,
      mimeType,
      fileExtension,
      filePath,
      fileUrl: `/uploads/${path.basename(filePath)}`,
      description: req.body.description || null,
      tags: req.body.tags ? req.body.tags.split(',') : []
    }).returning();

    res.status(201).json(file);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update file
router.patch('/files/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = parseInt(req.params.id);
    const { name } = z.object({ name: z.string().min(1) }).parse(req.body);

    const [file] = await db.update(fileSystemFiles)
      .set({ name, updatedAt: new Date() })
      .where(and(
        eq(fileSystemFiles.id, id),
        eq(fileSystemFiles.userId, userId)
      ))
      .returning();

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete file
router.delete('/files/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = parseInt(req.params.id);

    // Get file info for cleanup
    const file = await db.query.fileSystemFiles.findFirst({
      where: and(
        eq(fileSystemFiles.id, id),
        eq(fileSystemFiles.userId, userId)
      )
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file from disk
    try {
      await promisify(fs.unlink)(file.filePath);
    } catch (error) {
      console.error('Error deleting file from disk:', error);
    }

    // Delete file record from database
    await db.delete(fileSystemFiles)
      .where(and(
        eq(fileSystemFiles.id, id),
        eq(fileSystemFiles.userId, userId)
      ));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download file
router.get('/files/:id/download', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = parseInt(req.params.id);

    const file = await db.query.fileSystemFiles.findFirst({
      where: and(
        eq(fileSystemFiles.id, id),
        eq(fileSystemFiles.userId, userId)
      )
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Update download count and last accessed time
    await db.update(fileSystemFiles)
      .set({ 
        downloadCount: (file.downloadCount || 0) + 1,
        lastAccessedAt: new Date()
      })
      .where(eq(fileSystemFiles.id, id));

    // Add to recent files
    await db.insert(fileSystemRecent).values({
      userId,
      itemId: id,
      itemType: 'file'
    }).onConflictDoUpdate({
      target: [fileSystemRecent.userId, fileSystemRecent.itemId, fileSystemRecent.itemType],
      set: { accessedAt: new Date() }
    });

    res.download(file.filePath, file.originalName);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search files and folders
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }

    const searchPattern = `%${query}%`;

    const folders = await db.query.fileSystemFolders.findMany({
      where: and(
        eq(fileSystemFolders.userId, userId),
        like(fileSystemFolders.name, searchPattern)
      ),
      limit: 20
    });

    const files = await db.query.fileSystemFiles.findMany({
      where: and(
        eq(fileSystemFiles.userId, userId),
        like(fileSystemFiles.name, searchPattern)
      ),
      limit: 20
    });

    const results = [
      ...folders.map(f => ({ ...f, type: 'folder' })),
      ...files.map(f => ({ ...f, type: 'file' }))
    ];

    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent files
router.get('/recent', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const recent = await db.query.fileSystemRecent.findMany({
      where: eq(fileSystemRecent.userId, userId),
      orderBy: [desc(fileSystemRecent.accessedAt)],
      limit: 20
    });

    res.json(recent);
  } catch (error) {
    console.error('Error fetching recent files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle favorite
router.post('/favorites/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const itemId = parseInt(req.params.id);
    const { type } = z.object({ type: z.enum(['file', 'folder']) }).parse(req.body);

    const existing = await db.query.fileSystemFavorites.findFirst({
      where: and(
        eq(fileSystemFavorites.userId, userId),
        eq(fileSystemFavorites.itemId, itemId),
        eq(fileSystemFavorites.itemType, type)
      )
    });

    if (existing) {
      await db.delete(fileSystemFavorites)
        .where(eq(fileSystemFavorites.id, existing.id));
      res.json({ favorited: false });
    } else {
      await db.insert(fileSystemFavorites).values({
        userId,
        itemId,
        itemType: type
      });
      res.json({ favorited: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get favorites
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const favorites = await db.query.fileSystemFavorites.findMany({
      where: eq(fileSystemFavorites.userId, userId),
      orderBy: [desc(fileSystemFavorites.createdAt)]
    });

    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;