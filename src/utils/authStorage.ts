import { UserRecord } from '../types/bio';

const USERS_STORAGE_KEY = 'bio_users_records_v1';

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'bio_salt_academic_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initial seed users simulating data/users.xlsx
const INITIAL_USERS: UserRecord[] = [
  {
    userId: 'BIO001',
    username: 'admin',
    // Hash for 'bio1234'
    passwordHash: 'c7c251d56e9c1851e3c2ee4054a7c1b52bc03dc5b1ae310a08e063c1a2f6fb39',
    registrationDate: '2026-09-01 10:00:00',
  },
  {
    userId: 'BIO002',
    username: 'student1',
    passwordHash: 'c7c251d56e9c1851e3c2ee4054a7c1b52bc03dc5b1ae310a08e063c1a2f6fb39',
    registrationDate: '2026-09-05 14:30:22',
  },
  {
    userId: 'BIO003',
    username: 'bio_researcher',
    passwordHash: 'c7c251d56e9c1851e3c2ee4054a7c1b52bc03dc5b1ae310a08e063c1a2f6fb39',
    registrationDate: '2026-09-12 09:15:40',
  },
];

export function getUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserRecord[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
}

export function generateNextUserId(users: UserRecord[]): string {
  let maxId = 0;
  for (const user of users) {
    const match = user.userId.match(/BIO(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    }
  }
  const nextNum = maxId + 1;
  return `BIO${String(nextNum).padStart(3, '0')}`;
}

export async function registerUser(
  username: string,
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string; user?: UserRecord }> {
  const trimmed = username.trim();
  if (!trimmed) {
    return { success: false, message: 'Username cannot be empty.' };
  }
  if (trimmed.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters.' };
  }
  if (!password) {
    return { success: false, message: 'Password cannot be empty.' };
  }
  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match.' };
  }

  const users = getUsers();
  const duplicate = users.some(u => u.username.toLowerCase() === trimmed.toLowerCase());
  if (duplicate) {
    return { success: false, message: `Username "${trimmed}" already exists. Please choose another.` };
  }

  const nextId = generateNextUserId(users);
  const passwordHash = await hashPassword(password);
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const newUser: UserRecord = {
    userId: nextId,
    username: trimmed,
    passwordHash,
    registrationDate: formattedDate,
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    message: `Signup successful! Your User ID is ${nextId}.`,
    user: newUser,
  };
}

export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; message: string; user?: UserRecord }> {
  const trimmed = username.trim();
  if (!trimmed || !password) {
    return { success: false, message: 'Invalid username or password.' };
  }

  const users = getUsers();
  const inputHash = await hashPassword(password);
  const user = users.find(
    u => u.username.toLowerCase() === trimmed.toLowerCase() && u.passwordHash === inputHash
  );

  if (!user) {
    return { success: false, message: 'Invalid username or password.' };
  }

  return {
    success: true,
    message: `Login successful. Welcome, ${user.username}.`,
    user,
  };
}

/**
 * Generates an Excel-compatible CSV / XML workbook representing data/users.xlsx
 */
export function exportUsersExcel(): void {
  const users = getUsers();
  const headers = ['User ID', 'Username', 'Password Hash', 'Registration Date'];
  const rows = users.map(u => [
    `"${u.userId}"`,
    `"${u.username}"`,
    `"${u.passwordHash}"`,
    `"${u.registrationDate}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'users.xlsx');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
