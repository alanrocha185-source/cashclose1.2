export type UserRole = 'admin' | 'staff';

const STORAGE_KEY = 'cashclose_role';

/* ==========================
   LOGIN
========================== */
export function setRole(role: UserRole) {
    localStorage.setItem(STORAGE_KEY, role);
}

/* ==========================
   GET ROLE
========================== */
export function getRole(): UserRole | null {
    return localStorage.getItem(STORAGE_KEY) as UserRole | null;
}

/* ==========================
   ADMIN CHECK
========================== */
export function isAdmin(role: UserRole | null): boolean {
    return role === 'admin';
}

/* ==========================
   LOGOUT
========================== */
export function logout() {
    localStorage.removeItem(STORAGE_KEY);
}
