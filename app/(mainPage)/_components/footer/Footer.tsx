import { Facebook, Instagram, Mail, Phone } from "lucide-react";

const footerData = {
  company: {
    name: "Непосидько",
    tagline: "Інтернет-магазин дитячого взуття",
  },
  socialMedia: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/people/Neposidko-%D1%8F%D0%BA%D1%96%D1%81%D0%BD%D0%B5-%D0%B2%D0%B7%D1%83%D1%82%D1%82%D1%8F-%D1%82%D0%B0-%D0%BF%D1%80%D0%B8%D0%BA%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D0%B9-%D0%BE%D0%B4%D1%8F%D0%B3/61553676252337/?mibextid=wwXIfr%2F&rdid=726raA0HuLna9SR9&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15UDwjc7X2%2F%3Fmibextid%3DwwXIfr%252F",
      icon: (
        <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white transition-colors" />
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/neposidko/",
      icon: (
        <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white transition-colors" />
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
    <footer className="bg-neutral-800 text-white py-4 w-full">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm sm:text-base">
          <div className="text-center md:text-left">
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
                  aria-label={`Підписатись на ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Зв&apos;язатись з нами
            </h3>
            <div className="flex flex-col gap-2 items-center md:items-end">
              <a
                href={`mailto:${footerData.contact.email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Надіслати email"
              >
                <Mail className="w-5 h-5" />
                <span>{footerData.contact.email}</span>
              </a>
              <a
                href={`tel:${footerData.contact.phone}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Зателефонувати"
              >
                <Phone className="w-5 h-5" />
                <span>{footerData.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 border-t border-gray-700 pt-2 text-center text-xs sm:text-sm">
          <p className="text-gray-400">{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
};
