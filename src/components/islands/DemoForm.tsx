import { useState, type FormEvent } from 'react';

type Values = { name: string; email: string; business: string; industry: string; message: string };
const initial: Values = { name: '', email: '', business: '', industry: '', message: '' };

export default function DemoForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const change = (field: keyof Values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Values> = {};
    if (!values.name.trim()) next.name = 'Ingresá tu nombre.';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Ingresá un correo válido.';
    if (!values.business.trim()) next.business = 'Contanos el nombre de tu negocio.';
    if (!values.industry) next.industry = 'Elegí un rubro.';
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }
    const body = `Nombre: ${values.name}\nCorreo: ${values.email}\nNegocio: ${values.business}\nRubro: ${values.industry}\nMensaje: ${values.message}`;
    window.location.href = `mailto:hola@turnate.com?subject=${encodeURIComponent('Solicitud de demo de Turnate')}&body=${encodeURIComponent(body)}`;
  };
  const field = (key: 'name' | 'email' | 'business', label: string, type = 'text') => (
    <div className="field"><label htmlFor={key}>{label}</label><input id={key} name={key} type={type} autoComplete={{ name: 'name', email: 'email', business: 'organization' }[key]} required value={values[key]} onChange={(event) => change(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} />{errors[key] && <span id={`${key}-error`} className="field-error">{errors[key]}</span>}</div>
  );
  return <form className="main-demo-form" onSubmit={submit} noValidate>
    <div className="form-row">{field('name', 'NOMBRE Y APELLIDO')}{field('email', 'CORREO ELECTRÓNICO', 'email')}</div>
    {field('business', 'NOMBRE DEL NEGOCIO')}
    <div className="field"><label htmlFor="industry">RUBRO</label><select id="industry" name="industry" required value={values.industry} onChange={(event) => change('industry', event.target.value)} aria-invalid={!!errors.industry} aria-describedby={errors.industry ? 'industry-error' : undefined}><option value="">Seleccioná una opción</option><option>Barbería</option><option>Estética</option><option>Consultorio</option><option>Entrenamiento</option><option>Mascotas</option><option>Otro</option></select>{errors.industry && <span id="industry-error" className="field-error">{errors.industry}</span>}</div>
    <div className="field"><label htmlFor="message">CONTANOS UN POCO MÁS (OPCIONAL)</label><textarea id="message" name="message" value={values.message} onChange={(event) => change('message', event.target.value)} /></div>
    <button className="button button--light" type="submit" data-magnetic>Solicitar mi demo <span className="arrow">→</span></button>
    <p className="form-note">Se abrirá tu aplicación de correo para enviar la solicitud.</p>
  </form>;
}
