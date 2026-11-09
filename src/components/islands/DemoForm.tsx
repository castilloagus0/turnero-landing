import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Building2, Check, ChevronDown, Dumbbell, PawPrint, Scissors, Sparkles, Stethoscope, type LucideIcon } from 'lucide-react';

type Values = { name: string; email: string; business: string; industry: string; message: string };
type Status = 'idle' | 'sending' | 'success' | 'error';
const initial: Values = { name: '', email: '', business: '', industry: '', message: '' };
const recipient = 'castilloagustin.dev@gmail.com';
const whatsappNumber = '543534195762';
const industries: Array<{ label: string; Icon: LucideIcon }> = [
  { label: 'Barbería', Icon: Scissors },
  { label: 'Estética', Icon: Sparkles },
  { label: 'Consultorio', Icon: Stethoscope },
  { label: 'Entrenamiento', Icon: Dumbbell },
  { label: 'Mascotas', Icon: PawPrint },
  { label: 'Otro', Icon: Building2 },
];

export default function DemoForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const industryRef = useRef<HTMLDivElement>(null);
  const whatsappMessage = encodeURIComponent(`Hola Agustín, quiero coordinar una demo de tymly.${values.name ? ` Soy ${values.name}.` : ''}${values.business ? ` Mi negocio es ${values.business}.` : ''}`);
  const selectedIndustry = industries.find((industry) => industry.label === values.industry);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!industryRef.current?.contains(event.target as Node)) setIsIndustryOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, []);

  const change = (field: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === 'success' || status === 'error') setStatus('idle');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    const next: Partial<Values> = {};
    if (!values.name.trim()) next.name = 'Ingresá tu nombre.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = 'Ingresá un correo válido.';
    if (!values.business.trim()) next.business = 'Contanos el nombre de tu negocio.';
    if (!values.industry) next.industry = 'Elegí un rubro.';
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }

    const form = event.currentTarget;
    const honey = String(new FormData(form).get('_honey') ?? '');
    setStatus('sending');
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          negocio: values.business.trim(),
          rubro: values.industry,
          mensaje: values.message.trim() || 'Sin mensaje adicional',
          _subject: 'Nueva solicitud de demo de tymly',
          _replyto: values.email.trim(),
          _template: 'table',
          _honey: honey,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      // FormSubmit can reply with HTTP 200 and a string "false" before activation.
      // Never report delivery if the service says activation is still needed.
      if (!response.ok || (result.success !== true && result.success !== 'true') || /activat/i.test(String(result.message ?? ''))) throw new Error('Submission failed');
      setValues(initial);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const field = (key: 'name' | 'email' | 'business', label: string, type = 'text') => (
    <div className="field"><label htmlFor={key}>{label}</label><input id={key} name={key} type={type} autoComplete={{ name: 'name', email: 'email', business: 'organization' }[key]} maxLength={key === 'email' ? 254 : 120} required value={values[key]} onChange={(event) => change(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} />{errors[key] && <span id={`${key}-error`} className="field-error">{errors[key]}</span>}</div>
  );

  return <form className="main-demo-form" action={`https://formsubmit.co/${recipient}`} method="POST" onSubmit={submit}>
    <input type="hidden" name="_subject" value="Nueva solicitud de demo de tymly" />
    <input type="hidden" name="_template" value="table" />
    <div style={{ display: 'none' }} aria-hidden="true"><label htmlFor="demo-website">Sitio web</label><input id="demo-website" type="text" name="_honey" tabIndex={-1} autoComplete="off" /></div>
    <div className="form-row">{field('name', 'NOMBRE Y APELLIDO')}{field('email', 'CORREO ELECTRÓNICO', 'email')}</div>
    {field('business', 'NOMBRE DEL NEGOCIO')}
    <div className="field industry-dropdown" ref={industryRef}>
      <label htmlFor="industry">RUBRO</label>
      <input type="hidden" name="industry" value={values.industry} />
      <button id="industry" className={`industry-trigger${isIndustryOpen ? ' is-open' : ''}`} type="button" aria-haspopup="menu" aria-expanded={isIndustryOpen} aria-controls="industry-menu" aria-invalid={!!errors.industry} aria-describedby={errors.industry ? 'industry-error' : undefined} onClick={() => setIsIndustryOpen((isOpen) => !isOpen)} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); setIsIndustryOpen(true); } if (event.key === 'Escape') setIsIndustryOpen(false); }}>
        <span className={`industry-trigger__value${selectedIndustry ? ' has-value' : ''}`}>{selectedIndustry ? <><selectedIndustry.Icon aria-hidden="true" size={17} strokeWidth={1.6} />{selectedIndustry.label}</> : 'Seleccioná un rubro'}</span>
        <ChevronDown aria-hidden="true" size={17} strokeWidth={1.8} />
      </button>
      {isIndustryOpen && <div id="industry-menu" className="industry-menu" role="menu" aria-label="Rubros disponibles">
        {industries.map(({ label, Icon }) => <button className={`industry-choice${values.industry === label ? ' is-selected' : ''}`} type="button" role="menuitemradio" aria-checked={values.industry === label} key={label} onClick={() => { change('industry', label); setIsIndustryOpen(false); }}>
          <Icon aria-hidden="true" size={17} strokeWidth={1.6} />
          <span>{label}</span>
          {values.industry === label && <Check aria-hidden="true" size={15} strokeWidth={2} />}
        </button>)}
      </div>}
      {errors.industry && <span id="industry-error" className="field-error">{errors.industry}</span>}
    </div>
    <div className="field"><label htmlFor="message">CONTANOS UN POCO MÁS (OPCIONAL)</label><textarea id="message" name="message" maxLength={2000} value={values.message} onChange={(event) => change('message', event.target.value)} /></div>
    <button className="button button--light" type="submit" disabled={status === 'sending'} data-magnetic>{status === 'sending' ? 'Enviando…' : 'Solicitar mi demo'} <span className="arrow" aria-hidden="true">→</span></button>
    <div className="form-feedback" role="status" aria-live="polite">
      {status === 'success' && <p className="form-note">¡Gracias! Tu solicitud fue enviada.</p>}
      {status === 'error' && <div className="form-fallback"><p className="form-note">No pudimos enviar tu solicitud. Podés intentar nuevamente o contactarnos por WhatsApp.</p><a className="form-whatsapp" href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">Continuar por WhatsApp <span aria-hidden="true">↗</span><span className="sr-only"> (se abre en una pestaña nueva)</span></a></div>}
      {status === 'idle' && <p className="form-note">Te responderemos por correo para coordinar una demo.</p>}
    </div>
  </form>;
}
