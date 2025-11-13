import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Get current user
const getCurrentUser = async (request: NextRequest) => {
  const token = await getToken({ req: request });
  if (!token) return null;

  return {
    id: token.sub || 'user-123',
    email: token.email || 'admin@testlogisticscompany.com',
    role: token.role || 'organization_admin',
    organizationId: token.organizationId || 'org-123',
  };
};

// Check permissions
const hasOrganizationAccess = (user: any) => {
  return user && (
    user.role === 'organization_admin' ||
    user.role === 'organization_driver'
  );
};

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Document types
const DOCUMENT_TYPES = [
  'commercial_register',
  'tax_id',
  'address_proof',
  'insurance',
  'license',
  'other',
] as const;

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Ensure upload directory exists
const ensureUploadDir = async () => {
  const uploadDir = join(process.cwd(), 'uploads', 'documents');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
  return uploadDir;
};

// Save uploaded file
const saveFile = async (file: File, uploadDir: string, documentId: string) => {
  const bytes = await file.arrayBuffer();
  const timestamp = Date.now();
  const filename = `${documentId}_${timestamp}_${file.name}`;
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, new Uint8Array(bytes));

  return {
    filename,
    filepath,
    size: file.size,
    type: file.type,
  };
};

/**
 * POST /api/organizations/documents/upload
 * Upload organization documents
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      );
    }

    if (!hasOrganizationAccess(user)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Organization access required'
          }
        },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const description = formData.get('description') as string;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'No file provided'
          }
        },
        { status: 400 }
      );
    }

    if (!documentType || !DOCUMENT_TYPES.includes(documentType as any)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_DOCUMENT_TYPE',
            message: 'Invalid document type',
            details: {
              allowedTypes: DOCUMENT_TYPES,
            }
          }
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Invalid file type',
            details: {
              allowedTypes: ALLOWED_FILE_TYPES,
              receivedType: file.type,
            }
          }
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size exceeds maximum limit',
            details: {
              maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
              receivedSize: `${file.size / 1024 / 1024}MB`,
            }
          }
        },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir();

    // Generate document ID
    const documentId = generateId();

    // Save file
    const savedFile = await saveFile(file, uploadDir, documentId);

    // Create document record (in a real implementation, this would be saved to database)
    const documentRecord = {
      id: documentId,
      organizationId: user.organizationId,
      type: documentType,
      filename: savedFile.filename,
      originalName: file.name,
      size: savedFile.size,
      type: savedFile.type,
      url: `/uploads/documents/${savedFile.filename}`,
      description: description || '',
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      expiryDate: null, // Would be set based on document type
      metadata: {
        lastModified: file.lastModified,
        name: file.name,
        webkitRelativePath: file.webkitRelativePath,
      },
    };

    // In a real implementation, save to database here
    // await db.document.create({ data: documentRecord });

    return NextResponse.json({
      success: true,
      data: documentRecord,
      message: 'Document uploaded successfully',
    });

  } catch (error) {
    console.error('Document upload error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Failed to upload document',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/organizations/documents/upload
 * Get upload status and information
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      );
    }

    if (!hasOrganizationAccess(user)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Organization access required'
          }
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        uploadConfig: {
          allowedFileTypes: ALLOWED_FILE_TYPES,
          maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
          documentTypes: DOCUMENT_TYPES,
          maxFiles: 10, // Maximum files per upload session
        },
        instructions: {
          acceptedFormats: ['PDF', 'JPG', 'PNG', 'DOC', 'DOCX', 'XLS', 'XLSX'],
          maxFileSizeDisplay: '10MB',
          supportedDocuments: {
            commercial_register: 'Business registration certificate',
            tax_id: 'Tax identification certificate',
            address_proof: 'Utility bill or lease agreement',
            insurance: 'Business liability insurance policy',
            license: 'Vehicle registration or driver license',
            other: 'Other relevant business documents',
          },
        },
      },
    });

  } catch (error) {
    console.error('Get upload info error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch upload information',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}