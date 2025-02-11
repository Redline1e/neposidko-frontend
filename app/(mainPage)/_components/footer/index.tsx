import { Facebook, Instagram, Mail, Phone } from "lucide-react";

const footerData = {
  company: {
    name: "Непосидько",
    tagline: "Інтернет-магазин дитячого взуття",
  },
  socialMedia: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/people/Neposidko/",
      icon: (
        <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/neposidko/",
      icon: (
        <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
      ),
    },
  ],
  contact: {
    email: "neposidko@ukr.net",
    phone: "+38 (050) 800-30-88",
  },
  copyright: "Непосидько. Всі права захищено. © 2025",
};

export const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-3 sm:py-4 w-full ">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          <div className="hidden sm:block text-left">
            <h2 className="text-xl sm:text-2xl font-bold">
              {footerData.company.name}
            </h2>
            <p className="mt-1 text-gray-400">{footerData.company.tagline}</p>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Підписатись на нас
            </h3>
            <div className="flex justify-center gap-3">
              {footerData.socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-right">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Зв'язатись з нами
            </h3>
            <div className="flex lg:justify-self-end sm:flex-col gap-4 sm:gap-1 sm:items-center justify-center ">
              <a
                href={`mailto:${footerData.contact.email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {footerData.contact.email}
                </span>
              </a>
              <a
                href={`tel:${footerData.contact.phone}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <Phone className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {footerData.contact.phone}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-3 border-t border-gray-700 pt-2 text-center text-xs sm:text-sm">
          <p className="text-gray-400">{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
};
