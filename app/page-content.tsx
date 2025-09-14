import { signOut } from "@workos-inc/authkit-nextjs";
import { Dot } from "lucide-react";
import Link from "next/link";

const PageContent = () => {
  const services = [
    {
      name: "Books", 
      href: "/books",
      enabled: true
    },
    {
      name: "Ads",
      href: "/ads",
      enabled: true
    },
    {
      name: "More soon",
      href: "/",
      enabled: false
    },
  ];

  const footerLinks = [
    {
      name: "Contact",
      href: "/contact"
    },
    {
      name: "Privacy",
      href: "/privacy"
    },
    {
      name: "Terms",
      href: "/terms"
    }
  ];

  return (
    <div className="h-dvh w-full flex justify-center md:pt-40 pt-20 p-4">
      <div className="h-full w-full max-w-xl text-center flex flex-col gap-8 justify-between">
        <div className="flex flex-col gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className={`
                ${service.enabled === false && 'pointer-events-none opacity-50'}
                text-4xl font-semibold font-serif cursor-pointer hover:text-muted-foreground transition  
              `}
            >
              <h1>{service.name}</h1>
            </Link>
          ))}
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button 
              type="submit"
              className="text-4xl font-semibold font-serif cursor-pointer hover:text-muted-foreground transition"
            >
              Sign Out
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center gap-2">
          {footerLinks.map((link, index) => (
            <span key={link.name} className="text-sm flex items-center gap-2">
              <Link
                href={link.href}
                className="text-muted-foreground hover:underline cursor-pointer"
              >
                {link.name}
              </Link>
              {index < footerLinks.length - 1 && (
                <Dot size={10} className="text-muted-foreground" />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageContent;