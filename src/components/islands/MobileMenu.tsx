import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [{ href: '#funciones', label: 'Funciones' }, { href: '#rubros', label: 'Rubros' }, { href: '#como-funciona', label: 'Cómo funciona' }];
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  useEffect(() => { document.body.classList.toggle('mobile-menu-open', open); return () => document.body.classList.remove('mobile-menu-open'); }, [open]);
  return <><button className="menu-trigger" onClick={() => setOpen(true)} aria-label="Abrir menú" aria-expanded={open}><Menu size={23}/></button>{open && <div className="mobile-panel" role="dialog" aria-modal="true" aria-label="Menú principal"><button className="mobile-close" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X size={25}/></button><span className="mobile-brand">Ordina</span><nav>{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span>↗</span></a>)}</nav><a className="button button--dark mobile-cta" href="#demo" onClick={() => setOpen(false)}>Solicitar una demo <span className="arrow">→</span></a></div>}</>;
}
