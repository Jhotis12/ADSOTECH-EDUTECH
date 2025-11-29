import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">EduTech</h3>
                        <p className="text-sm text-gray-400">
                            Plataforma integral de gestión educativa para instituciones modernas.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-indigo-400 transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-indigo-400 transition-colors">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                            <li>
                                <Link to="/recursos" className="hover:text-indigo-400 transition-colors">
                                    Recursos
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-indigo-400 transition-colors">
                                    Iniciar Sesión
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/terms" className="hover:text-indigo-400 transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="hover:text-indigo-400 transition-colors">
                                    Política de Cookies
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal" className="hover:text-indigo-400 transition-colors">
                                    Aviso Legal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm mb-4">
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                <a href="mailto:info@edutech.edu.co" className="hover:text-indigo-400 transition-colors">
                                    info@edutech.edu.co
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} />
                                <span>+57 123 456 7890</span>
                            </li>
                        </ul>

                        {/* Social Media Links */}
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>© {currentYear} EduTech. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
