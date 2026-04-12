import logoSrc from '@assets/bluemarlin_logo_clean.png';

export default function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <img
      src={logoSrc}
      alt="BlueMarlin Tours Curaçao"
      className={`${className} object-contain drop-shadow-sm`}
      draggable={false}
    />
  );
}
