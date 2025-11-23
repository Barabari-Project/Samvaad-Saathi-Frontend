"use client";

const Header = () => {
  return (
    <div className="navbar min-h-0 px-0 py-4">
      <div className="flex-1">
        <h3 className="text-[#1f285b] text-2xl font-bold uppercase tracking-wide">
          REACT Developer
        </h3>
      </div>

      <div className="flex-none">
        {/* Timer Container with Gradient Border */}
        <div className="relative p-[2px] rounded-xl bg-gradient-to-r from-pink-500 to-blue-600 shadow-md">
          <div className="bg-slate-50 rounded-[10px] px-6 py-2 min-w-[100px] flex items-center justify-center">
            <p className="font-orbitron text-2xl font-semibold text-slate-900 tracking-widest">
              25:59
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
