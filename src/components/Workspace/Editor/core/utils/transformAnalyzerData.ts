import type { FieldInfo, MethodInfo, StructBoxMetadata } from '../types';

// Server analyzer output format (from go-struct-analyzer):
// {
//   structs: Array<{
//     name: string, package?: string,
//     fields?: Array<{ name, type, tag?, comment? }>,
//     methods?: Array<{ name, signature?, params?, returnType?, comment? }>,
//     description?: string, dependencies?: string[]
//   }>,
//   connections?: Array<{ from: string; to: string }>,
//   dependencies?: Array<{ fromId: string; toId: string }>
// }

// Frontend expected format
interface ImportStructData {
  id: string;
  x: number;
  y: number;
  metadata: StructBoxMetadata;
}

interface ImportData {
  structs: ImportStructData[];
  connections: { fromId: string; toId: string }[];
}

/**
 * Transform analyzer output to frontend format
 * Handles format mismatches between server and frontend expectations
 */
export function transformAnalyzerData(data: any): ImportData {
  console.log('[transformAnalyzerData] Raw input:', data);

  // If data already has the correct format, return as is
  if (data.structs?.[0]?.metadata?.type === 'struct-box') {
    console.log('[transformAnalyzerData] Data already in correct format');
    return data as ImportData;
  }

  // Transform structs
  const structs: ImportStructData[] = [];
  const rawStructs = data.structs || [];

  rawStructs.forEach((item: any, index: number) => {
    // Generate ID if not present
    const id = item.id || `struct-${item.name || index}-${Date.now()}`;

    // Calculate position - arrange in a grid
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = item.x ?? (100 + col * 320);
    const y = item.y ?? (100 + row * 280);

    // Transform fields
    const fields: FieldInfo[] = (item.fields || item.metadata?.fields || []).map((f: any) => ({
      name: f.name || 'unknown',
      type: f.type || 'any',
      expanded: f.expanded ?? false,
      description: f.comment || f.description || '',
    }));

    // Transform methods
    const methods: MethodInfo[] = (item.methods || item.metadata?.methods || []).map((m: any) => ({
      name: m.name || 'unknown',
      params: m.params || m.signature || '',
      returnType: m.returnType || m.return_type || '',
      description: m.comment || m.description || '',
      expanded: m.expanded ?? false,
    }));

    // Build metadata
    const metadata: StructBoxMetadata = {
      type: 'struct-box',
      name: item.name || item.metadata?.name || `Struct${index + 1}`,
      fields: fields.length > 0 ? fields : [{ name: 'id', type: 'int', expanded: false }],
      methods: methods,
      description: item.description || item.metadata?.description || '',
      descriptionTitle: item.descriptionTitle || item.metadata?.descriptionTitle,
      currentView: item.currentView || item.metadata?.currentView || 'fields',
      fontSize: item.fontSize || item.metadata?.fontSize,
      color: item.color || item.metadata?.color,
    };

    // If the input already has metadata, preserve any extra fields
    if (item.metadata) {
      Object.keys(item.metadata).forEach(key => {
        if (!(key in metadata)) {
          (metadata as any)[key] = item.metadata[key];
        }
      });
    }

    structs.push({ id, x, y, metadata });
  });

  // Transform connections
  let connections: { fromId: string; toId: string }[] = [];

  if (data.connections) {
    connections = data.connections.map((c: any) => ({
      fromId: c.fromId || c.from || c.source,
      toId: c.toId || c.to || c.target,
    })).filter((c: any) => c.fromId && c.toId);
  } else if (data.dependencies) {
    connections = data.dependencies.map((d: any) => ({
      fromId: d.fromId || d.from || d.source,
      toId: d.toId || d.to || d.target,
    })).filter((c: any) => c.fromId && c.toId);
  }

  const result = { structs, connections };
  console.log('[transformAnalyzerData] Transformed output:', result);
  return result;
}
