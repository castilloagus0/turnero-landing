import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, registerMotionPlugins } from '../../lib/animations/gsap';
import { Flip } from 'gsap/Flip';
import { features } from '../../data/features';

function ProductMockup({ active }: { active: string }) {
  const body = active === 'agenda' ? <div className="agenda-grid"><span></span><b className="person">Lucía</b><b className="person">Martín</b><b className="person">Noe</b><span>09:00</span><span></span><span></span><span className="event c">Coloración<b>09:00 · 10:00</b></span><span>10:00</span><span className="event a">Corte + barba<b>10:00 · 10:45</b></span><span></span><span></span><span>11:00</span><span></span><span className="event b">Corte<b>11:00 · 11:30</b></span><span></span><span>12:00</span><span></span><span></span><span></span></div> : active === 'booking' ? <div className="phone-booking"><span className="phone-time">11:30</span><div className="phone-pill">TURNATE · Reservá tu turno</div><h3>Elegí el servicio</h3><div className="phone-service">Corte clásico <span>40 min</span></div><div className="phone-service">Coloración <span>90 min</span></div><div className="phone-service">Barba + corte <span>55 min</span></div><div className="phone-next">Continuar <span>→</span></div></div> : active === 'clients' ? <div className="client-list">{[['ML','María López','Corte · Mañana'],['AS','Ana Suárez','Coloración · Jueves'],['FN','Franco Nuñez','Barba · Viernes']].map(([initials,name,next]) => <div className="client-row" key={name}><span className="avatar">{initials}</span><span><b>{name}</b><small>{next}</small></span><span className="tag">Frecuente</span></div>)}</div> : active === 'payments' ? <div className="payments-grid"><div className="payment-total"><span>Ingresos del mes</span><strong>$ 824k</strong></div><div className="bars">{[40,65,50,92,72,100,82].map((height, i) => <i key={i} className="bar" style={{height:`${height}%`}}/>)}</div></div> : <div className="reports"><div className="metric"><span>Reservas</span><strong>126</strong></div><div className="metric"><span>Ocupación</span><strong>84%</strong></div><div className="chart"><svg viewBox="0 0 300 130" aria-hidden="true"><path d="M0 106 C25 90 33 106 57 73 S105 70 128 80 S166 17 194 49 S232 79 254 33 S280 30 300 14" fill="none" stroke="#2d7587" strokeWidth="3"/><path d="M0 106 C25 90 33 106 57 73 S105 70 128 80 S166 17 194 49 S232 79 254 33 S280 30 300 14 V130 H0Z" fill="#2d758714"/></svg></div></div>;
  return <div className="product-window" aria-live="polite"><div className="product-topbar"><i className="dot"/><i className="dot"/><i className="dot"/><b>Turnate / {features.find(f => f.id === active)?.label}</b></div><div className="product-content"><span className="mock-label">VISTA DEMO · NOVIEMBRE</span>{body}</div></div>;
}
export default function FeatureTabs() {
  const [active, setActive] = useState('agenda');
  const activeRef = useRef(active);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const selected = features.find(feature => feature.id === active)!;

  const positionIndicator = (id: string, animate = false) => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    const target = list?.querySelector<HTMLElement>(`[data-feature-tab="${id}"]`);
    if (!list || !indicator || !target) return;
    const state = animate ? Flip.getState(indicator) : null;
    gsap.set(indicator, { x: target.offsetLeft + 8, y: target.offsetTop + target.offsetHeight - 3, width: Math.max(30, target.offsetWidth - 16) });
    if (state) Flip.from(state, { duration: 0.52, ease: 'power3.inOut', absolute: true });
  };

  useLayoutEffect(() => {
    registerMotionPlugins();
    gsap.registerPlugin(Flip);
    positionIndicator(active);
    const observer = new ResizeObserver(() => positionIndicator(activeRef.current));
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && productRef.current) {
      gsap.fromTo(productRef.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power2.out' });
    }
  }, [active]);

  const selectFeature = (id: string) => {
    if (id === active) return;
    activeRef.current = id;
    setActive(id);
    requestAnimationFrame(() => positionIndicator(id, !window.matchMedia('(prefers-reduced-motion: reduce)').matches));
  };

  return <div className="features-layout"><div className="features-visual" ref={productRef}><ProductMockup active={active}/></div><div className="features-info"><p className="eyebrow feature-kicker">EL PODER DE ORGANIZAR</p><h2 className="display features-title">Todo lo que necesitás para crecer.</h2><div className="features-list" ref={listRef}>{features.map((feature, index) => <button className={`feature-item ${active === feature.id ? 'active' : ''}`} data-feature-tab={feature.id} key={feature.id} onClick={() => selectFeature(feature.id)} aria-pressed={active === feature.id}><span>0{index + 1}</span><strong>{feature.label}</strong><i>↗</i></button>)}<span className="feature-active-indicator" ref={indicatorRef} aria-hidden="true"/></div><p className="feature-summary"><b>{selected.title}</b><br/>{selected.description}</p></div></div>;
}
