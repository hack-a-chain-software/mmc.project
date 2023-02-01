import socials from '@/json/socials.json';

export const Socials = () => {
  return (
    <div
      className="flex items-center space-x-[32px]"
    >
      {socials.map(({ icon, path }, i) => (
        <a
          href={path}
          target="_blank"
          key={`mmc-navbar-social-${i}`}
          className="cursor-pointer hover:opacity-[.8] shrink-0"
        >
          <img loading="lazy" src={icon} className="h-6" />
        </a>
      ))}
    </div>
  );
};

export default Socials;
