export default function Topbar() {
  return (
    <div className="flex justify-between items-center border-b border-slate-800 p-5">

      <h2 className="text-2xl font-bold">
        AI Workspace
      </h2>

      <div className="flex gap-4">

        <select className="bg-slate-800 p-2 rounded">
          <option>DeepSeek</option>
          <option>GPT-4.1</option>
          <option>Claude</option>
          <option>Gemini</option>
        </select>

        <select className="bg-slate-800 p-2 rounded">
          <option>DSA Mentor</option>
          <option>Debug Code</option>
          <option>Hint Only</option>
          <option>Mock Interview</option>
        </select>

      </div>

    </div>
  );
}