import db from '@/lib/db';
import { ApiError } from './response';

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const [results] = await db.query(query, params);
    return Array.isArray(results) ? results as T[] : [];
  } catch (error: any) {
    console.error('Database query error:', error);
    throw new ApiError(500, 'Database operation failed', error.message);
  }
}

export async function executeQueryOne<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  try {
    const [results] = await db.query(query, params);
    const arrayResults = Array.isArray(results) ? results : [];
    return arrayResults.length > 0 ? (arrayResults[0] as T) : null;
  } catch (error: any) {
    console.error('Database query error:', error);
    throw new ApiError(500, 'Database operation failed', error.message);
  }
}

export async function executeInsert(query: string, params: any[] = []): Promise<number> {
  try {
    const [result] = await db.query(query, params);
    return (result as any).insertId;
  } catch (error: any) {
    console.error('Database insert error:', error);
    throw new ApiError(500, 'Database operation failed', error.message);
  }
}

export async function executeTransaction<T>(
  callback: (connection: any) => Promise<T>
): Promise<T> {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function findById<T = any>(
  table: string,
  id: number,
  fields: string = '*'
): Promise<T | null> {
  return executeQueryOne<T>(`SELECT ${fields} FROM ${table} WHERE id = ?`, [id]);
}

export async function exists(table: string, condition: string, params: any[]): Promise<boolean> {
  const result = await executeQueryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM ${table} WHERE ${condition}`,
    params
  );
  return result ? result.count > 0 : false;
}

