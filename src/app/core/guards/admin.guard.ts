
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
function tokenHasAdmin(): boolean { const t=localStorage.getItem('token'); if(!t) return false; try{ const p=JSON.parse(atob(t.split('.')[1]||'')); const roles=p?.roles||p?.authorities||p?.role||[]; const list:string[]=Array.isArray(roles)?roles:[roles]; return list.some(r=>String(r).toUpperCase().includes('ADMIN')); }catch{return false;} }
export const adminGuard: CanActivateFn = () => { const r=inject(Router); if(tokenHasAdmin()) return true; r.navigate(['/']); return false; };
