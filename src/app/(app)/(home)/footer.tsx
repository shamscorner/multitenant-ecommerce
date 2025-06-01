export const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row border-t justify-between items-center gap-6 md:gap-0 font-medium p-6 bg-white">
      <div className="text-center md:text-left">
        <p>ShamsRoad, Inc.</p>
        <p className="text-xs mt-0.5 text-gray-500">&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
      <div className="flex items-center gap-5">
        <a className="text-teal-500 hover:underline" href="/privacy-policy">Privacy Policy</a>
        <a className="text-teal-500 hover:underline" href="/terms-of-service"> Terms of Service</a>
      </div>
    </footer>
  );
};
