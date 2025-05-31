import { motion } from "framer-motion";

export default function HeroAvatar() {
  return (
    <div className="max-w-3xl px-11 flex flex-col md:flex-row justify-between items-center mb-5 gap-7  md:gap-20">
        <div className="flex flex-wrap">
          <div className="flex flex-col md:flex-row text-center md:text-left items-center gap-7">
            {/* Avatar */}
            <img
              src="/images/avatar.jpg"
              alt="Hero Avatar"
              className="w-32 h-32 rounded-md  shadow-[0_0_0_7px_rgba(255,255,255,0.05)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            />
            <div className="flex-1">
              {/* Name */}
              <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">
                Manalaa B.
              </h1>

              {/* Class / Level / XP */}
              <div className="text-sm flex items-center gap-4 text-gray-400 text-base">
                <span>⚔️ FullStack Wizard</span>
                <span>⚡ level 13</span>
              </div>

              {/* XP Progress bar */}
              <div className="w-full bg-gray-700 rounded-sm h-2 mt-4 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full"
                  style={{ width: "77%" }}
                ></div>
              </div>

              <div className="text-xs text-yellow-400 mt-2">XP: 7455 / 10000</div>
            </div>

          </div>
        </div>
        <div>
          <button className="bg-black px-5 py-3 block rounded-md font-medium text-sm" href="/vcard.vcf">Add to the Contacts</button>
        </div>
    </div>

  );
}