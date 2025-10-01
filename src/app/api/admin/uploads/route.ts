import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Helper function to verify admin token
function verifyAdmin(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret') as JwtPayload;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file) continue;

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = join(uploadsDir, fileName);

      // Convert file to buffer and write to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      await writeFile(filePath, buffer);

      // Return the URL that can be used to access the file
      uploadedFiles.push({
        fileName: file.name,
        url: `/uploads/${fileName}`,
        size: file.size,
        type: file.type
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}