"use client";

import { Dot } from "lucide-react";
import { useRouter } from "next/navigation";

const PageContent = () => {
  const router = useRouter();

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
      name: "Truths",
      href: "/truths",
      enabled: false
    },
    {
      name: "Research",
      href: "/research",
      enabled: false
    },
    {
      name: "Settings",
      href: "/settings",
      enabled: false
    }
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
            <h1
              key={index}
              onClick={() => router.push(service.href)}
              className={`
                ${!service.enabled && 'text-muted-foreground pointer-events-none'} 
                text-4xl font-semibold font-serif cursor-pointer hover:text-muted-foreground transition`}
            >
              {service.name}
              {!service.enabled && (
                <span className="text-xs font-normal pl-2">
                  (soon)
                </span>
              )}
            </h1>
          ))}
        </div>
        <div className="flex justify-center items-center gap-2">
          {footerLinks.map((link, index) => (
            <span
              key={link.name}
              className="text-sm flex cursor-pointer items-center gap-2 text-muted-foreground hover:underline"
              onClick={() => router.push(link.href)}
            >
              {link.name}
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