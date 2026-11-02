import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import 'swiper/css';
import { industries } from '../../data/industries';

export default function IndustriesCarousel() {
  const carousel = useRef<SwiperType | null>(null); const [index, setIndex] = useState(1);
  return <div className="industries-carousel"><Swiper slidesPerView={1.08} spaceBetween={14} breakpoints={{ 640: { slidesPerView: 1.35, spaceBetween: 20 }, 1024: { slidesPerView: 1.18, spaceBetween: 25 } }} onSwiper={(s) => carousel.current = s} onSlideChange={(s) => setIndex(s.realIndex + 1)}>{industries.map(industry => <SwiperSlide key={industry.id}><article className="industry-slide"><div className="industry-slide__texture"/><div className="industry-copy"><span className="industry-number">{industry.id} / RUBRO</span><h3 className="display industry-name">{industry.name}</h3><p>{industry.description}</p><a href="#demo" className="button button--line">Explorar solución <span className="arrow">→</span></a></div></article></SwiperSlide>)}</Swiper><div className="carousel-controls"><span className="carousel-fraction">0{index} — 0{industries.length}</span><div className="carousel-buttons"><button className="round-control" onClick={() => carousel.current?.slidePrev()} aria-label="Rubro anterior"><ArrowLeft size={17}/></button><button className="round-control" onClick={() => carousel.current?.slideNext()} aria-label="Rubro siguiente"><ArrowRight size={17}/></button></div></div></div>;
}
