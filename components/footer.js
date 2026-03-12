import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 w-full">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-500 text-sm font-medium">
         @ {new Date().getFullYear()} <span className="text-blue-600 font-bold">Library Pro</span>. Built with MERN Stack.
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <FaGithub size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <FaLinkedin size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <FaEnvelope size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
