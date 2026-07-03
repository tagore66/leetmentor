import { FaComments, FaPlus, FaCog } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 h-screen p-5 flex flex-col">

      <h1 className="text-2xl font-bold text-cyan-400 mb-8">
        LeetMentor
      </h1>

      <button className="bg-cyan-500 text-black rounded-lg py-3 font-semibold mb-6">
        <FaPlus className="inline mr-2" />
        New Chat
      </button>

      <div className="flex flex-col gap-4 text-gray-300">

        <button className="text-left hover:text-cyan-400">
          <FaComments className="inline mr-2" />
          Chat History
        </button>

        <button className="text-left hover:text-cyan-400">
          <FaCog className="inline mr-2" />
          Settings
        </button>

      </div>

    </div>
  );
}