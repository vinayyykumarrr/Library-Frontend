
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
function isTokenValid(): boolean { const t = localStorage.getItem('token'); if(!t) return false; try{ const p=JSON.parse(atob(t.split('.')[1]||'')); const exp=p?.exp; if(!exp) return true; return Math.floor(Date.now()/1000)<exp; }catch{return false;} }
export const authGuard: CanActivateFn = () => { const r=inject(Router); if(isTokenValid()) return true; r.navigate(['/login']); return false; };
