import { Link } from 'react-router-dom';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { SiInstagram, SiFacebook, SiWhatsapp, SiX } from 'react-icons/si';
import Logo from './Logo';

const PREFIX = '/demo/bluemarlin';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-muted/40 text-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="h-9 w-auto" />
            <h3 className="text-base font-semibold" data-testid="text-footer-brand">BlueMarlin Tours Curaçao</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Premium vessel charters departing from Willemstad. This is a fictional demo for an AI-assisted booking funnel.
          </p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <h4 className="font-semibold text-foreground">Contact</h4>
          <p className="flex items-center gap-3"><MapPin size={21} className="shrink-0 text-primary" /> Handelskade 14, Willemstad</p>
          <p className="flex items-center gap-3"><Phone size={21} className="shrink-0 text-primary" /> <a href="tel:+59996881585" className="transition hover:text-foreground">+5999 688 1585</a></p>
          <p className="flex items-center gap-3">
            <SiWhatsapp size={21} className="shrink-0 text-primary" />
            <a href="https://wa.me/15155005577" target="_blank" rel="noopener noreferrer" className="transition hover:text-foreground">Send WhatsApp</a>
          </p>
          <p className="flex items-center gap-3"><Mail size={21} className="shrink-0 text-primary" /> <a href="mailto:hello@wetakeyourjob.com" className="transition hover:text-foreground">hello@wetakeyourjob.com</a></p>
          <p className="flex items-center gap-3"><Clock3 size={21} className="shrink-0 text-primary" /> Mon-Sat 08:00-19:00</p>
          <div className="flex items-center gap-5 pt-3 pl-1">
            <a href="https://www.instagram.com/bluemarlincharters/" target="_blank" rel="noopener noreferrer" className="transition hover:opacity-80" data-testid="link-social-instagram">
              <SiInstagram size={21} className="text-[#E4405F]" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61587067585897" target="_blank" rel="noopener noreferrer" className="transition hover:opacity-80" data-testid="link-social-facebook">
              <SiFacebook size={21} className="text-[#1877F2]" />
            </a>
            <a href="https://x.com/Bluemarlin2026" target="_blank" rel="noopener noreferrer" className="transition hover:opacity-80" data-testid="link-social-x">
              <SiX size={21} className="text-[#000000]" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground">Navigation</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to={`${PREFIX}/`} className="transition hover:text-foreground" data-testid="link-footer-home">Home</Link>
            <Link to={`${PREFIX}/trips`} className="transition hover:text-foreground" data-testid="link-footer-trips">Trips</Link>
            <Link to={`${PREFIX}/booking`} className="transition hover:text-foreground" data-testid="link-footer-booking">Booking</Link>
            <Link to={`${PREFIX}/about`} className="transition hover:text-foreground" data-testid="link-footer-about">About</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} BlueMarlin Tours Curaçao &mdash; Demo Site
      </div>
    </footer>
  );
}
