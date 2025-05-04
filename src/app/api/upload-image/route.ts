// app/api/upload-image/route.ts - Use this instead if you're using the App Router

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import cloudinary from '@/lib/cloudinary';
import { promises as fs } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Use the Request object directly (no formidable needed in App Router)
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert the file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique filename
    const filename =  file.name.replace(/\s/g, '_');
    
    // Create a temporary directory
    const tempDir = join(process.cwd(), 'tmp');
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
    
    // Save to temporary file
    const tempFilePath = join(tempDir, filename);
    await writeFile(tempFilePath, buffer);
    
    console.log(`File saved to ${tempFilePath}`);
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'next-uploads',
    });
    
    // Clean up temp file
    try {
      await fs.unlink(tempFilePath);
    } catch (error) {
      console.warn('Could not delete temp file:', error);
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Server error during upload' 
      },
      { status: 500 }
    );
  }
}

// This route handler only accepts POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}