import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { User, Cpu, Puzzle, CreditCard, Palette, Shield, Loader2, Save } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useExtension } from "../hooks/useExtension";

export default function Account() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isExtensionInstalled, extensionVersion, syncSettingsToExtension } = useExtension();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [passwordStep, setPasswordStep] = useState(0); // 0: button, 1: verify, 2: new password
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passwordState, setPasswordState] = useState({ loading: false, error: "", success: "" });
  const location = useLocation();
  const { updateUser } = useAuth();

  useEffect(() => {
    // Routing to tabs based on path or hash
    if (location.hash) {
      const tabId = location.hash.replace('#', '');
      setActiveTab(tabId);
    } else if (location.pathname === "/settings") {
      setActiveTab("ai-preferences");
    } else if (location.pathname === "/profile") {
      setActiveTab("general");
    }
    
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [location]);

  const handleSettingChange = (key: string, value: any) => {
    setProfile((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await api.put("/user/settings", { settings: profile.settings }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If we are changing extension settings, sync them
      syncSettingsToExtension(profile.settings);
      
      updateUser(profile);
    } catch (err) {
      console.log(err);
      alert("Failed to save settings");
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordState({ loading: true, error: "", success: "" });
    try {
      const token = localStorage.getItem("token");
      await api.post("/user/verify-password", {
        currentPassword: passwords.current,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setPasswordState({ loading: false, error: "", success: "" });
      setPasswordStep(2);
    } catch (err: any) {
      setPasswordState({ 
        loading: false, 
        error: err.response?.data?.message || "Incorrect current password", 
        success: "" 
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordState({ loading: false, error: "New passwords do not match", success: "" });
      return;
    }
    setPasswordState({ loading: true, error: "", success: "" });
    try {
      const token = localStorage.getItem("token");
      await api.put("/user/password", {
        currentPassword: passwords.current,
        newPassword: passwords.new
      }, { headers: { Authorization: `Bearer ${token}` } });
      setPasswordState({ loading: false, error: "", success: "Password updated successfully" });
      setPasswords({ current: "", new: "", confirm: "" });
      setPasswordStep(0);
    } catch (err: any) {
      setPasswordState({ 
        loading: false, 
        error: err.response?.data?.message || "Failed to update password", 
        success: "" 
      });
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <User size={18} /> },
    { id: "ai-preferences", label: "AI Preferences", icon: <Cpu size={18} /> },
    { id: "extension", label: "Extension", icon: <Puzzle size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <Loader2 className="animate-spin text-neutral-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-6">Account</h1>
          <nav className="flex flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? "bg-neutral-900 text-white" 
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#0a0a0a] border border-neutral-800/60 rounded-2xl p-8 min-h-[600px] relative">
          
          {/* Action Bar for saveable tabs */}
          {["ai-preferences", "extension", "appearance"].includes(activeTab) && (
            <div className="absolute top-6 right-6">
              <Button 
                variant="primary"
                onClick={saveSettings}
                disabled={saving}
                className="gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {/* GENERAL TAB */}
          {activeTab === "general" && profile && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-medium text-white mb-8">General</h2>
              
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center text-3xl font-medium text-white border border-neutral-700 shadow-inner">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{profile.name}</h3>
                  <p className="text-neutral-400 text-sm mb-1">{profile.email}</p>
                  <span className="inline-block px-2 py-0.5 bg-neutral-900 text-neutral-300 text-xs rounded-full border border-neutral-800">
                    Free Plan
                  </span>
                </div>
              </div>

              <div className="h-px bg-neutral-800 my-10"></div>

              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-6">AI Usage Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-black border border-neutral-800 rounded-xl p-5">
                  <p className="text-neutral-500 text-xs mb-1 font-medium">Today's Requests</p>
                  <p className="text-2xl font-semibold text-white">{profile.usage?.todayRequests || 0}</p>
                </div>
                <div className="bg-black border border-neutral-800 rounded-xl p-5">
                  <p className="text-neutral-500 text-xs mb-1 font-medium">Total Messages</p>
                  <p className="text-2xl font-semibold text-white">{profile.usage?.totalMessages || 0}</p>
                </div>
                <div className="bg-black border border-neutral-800 rounded-xl p-5">
                  <p className="text-neutral-500 text-xs mb-1 font-medium">Total Conversations</p>
                  <p className="text-2xl font-semibold text-white">{profile.usage?.totalConversations || 0}</p>
                </div>
                <div className="bg-black border border-neutral-800 rounded-xl p-5">
                  <p className="text-neutral-500 text-xs mb-1 font-medium">Problems Discussed</p>
                  <p className="text-2xl font-semibold text-white">{profile.usage?.problemsDiscussed || 0}</p>
                </div>
                <div className="bg-black border border-neutral-800 rounded-xl p-5">
                  <p className="text-neutral-500 text-xs mb-1 font-medium">Debug Sessions</p>
                  <p className="text-2xl font-semibold text-white">{profile.usage?.debugSessions || 0}</p>
                </div>
                <div className="bg-black border border-neutral-800 rounded-xl p-5">
                  <p className="text-neutral-500 text-xs mb-1 font-medium">Mock Interviews</p>
                  <p className="text-2xl font-semibold text-white">{profile.usage?.mockInterviews || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI PREFERENCES TAB */}
          {activeTab === "ai-preferences" && profile && (
            <div className="animate-in fade-in duration-300 max-w-xl">
              <h2 className="text-xl font-medium text-white mb-2">AI Preferences</h2>
              <p className="text-neutral-500 text-sm mb-8">Customize how the AI behaves and formats responses.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Default Model</label>
                  <select 
                    value={profile.settings?.defaultAIModel || "deepseek/deepseek-chat-v3-0324"}
                    onChange={(e) => handleSettingChange("defaultAIModel", e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors cursor-pointer"
                  >
                    <option value="deepseek/deepseek-chat-v3-0324">DeepSeek V3 (Default)</option>
                    <option value="openai/gpt-4o">GPT-4o (Pro)</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Pro)</option>
                  </select>
                </div>

                <div className="h-px bg-neutral-800/50 my-2"></div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200">Streaming Responses</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Show AI responses word-by-word as they generate.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={profile.settings?.streaming !== false}
                    onChange={(e) => handleSettingChange("streaming", e.target.checked)}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200">Markdown Formatting</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Render text with rich formatting (bold, lists, etc).</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={profile.settings?.markdown !== false}
                    onChange={(e) => handleSettingChange("markdown", e.target.checked)}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200">Code Highlighting</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Apply syntax highlighting to code blocks.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={profile.settings?.codeHighlighting !== false}
                    onChange={(e) => handleSettingChange("codeHighlighting", e.target.checked)}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* EXTENSION TAB */}
          {activeTab === "extension" && profile && (
            <div className="animate-in fade-in duration-300 max-w-xl">
              <h2 className="text-xl font-medium text-white mb-2">Extension</h2>
              <p className="text-neutral-500 text-sm mb-8">Manage the LeetMentor Chrome Extension settings.</p>

              <div className="bg-black border border-neutral-800 rounded-xl p-5 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {isExtensionInstalled ? (
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-neutral-600 rounded-full"></div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-white">{isExtensionInstalled ? "Extension Connected" : "Extension Not Installed"}</h3>
                    <p className="text-xs text-neutral-500">{isExtensionInstalled ? `Version ${extensionVersion || '1.0.0'}` : "Please install from Chrome Web Store"}</p>
                  </div>
                </div>
                {!isExtensionInstalled && (
                  <Button variant="secondary" size="sm" onClick={() => window.open("https://chrome.google.com/webstore/detail/leetmentor", "_blank")}>
                    Install
                  </Button>
                )}
                {isExtensionInstalled && (
                  <Button variant="secondary" size="sm" onClick={() => syncSettingsToExtension(profile.settings)}>
                    Resync
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200">Enable Extension</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Allow the extension to communicate with LeetMentor.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={profile.settings?.extensionEnabled !== false}
                    onChange={(e) => handleSettingChange("extensionEnabled", e.target.checked)}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200">Auto-Detect Problem</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Automatically pull context from the active LeetCode tab.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={profile.settings?.autoDetectProblem !== false}
                    onChange={(e) => handleSettingChange("autoDetectProblem", e.target.checked)}
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === "billing" && (
            <div className="animate-in fade-in duration-300 max-w-xl">
              <h2 className="text-xl font-medium text-white mb-2">Billing</h2>
              <p className="text-neutral-500 text-sm mb-8">Manage your subscription and billing details.</p>

              <div className="bg-black border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Current Plan</div>
                <div className="text-2xl font-semibold text-white mb-4">Free</div>
                
                <ul className="space-y-3 mb-8">
                  <li className="text-sm text-neutral-400 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-neutral-600"></div> DeepSeek V3 Model Access
                  </li>
                  <li className="text-sm text-neutral-400 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-neutral-600"></div> Standard Response Times
                  </li>
                  <li className="text-sm text-neutral-400 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-neutral-600"></div> 100 Messages / Day
                  </li>
                </ul>

                <Button variant="primary" fullWidth>
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && profile && (
            <div className="animate-in fade-in duration-300 max-w-xl">
              <h2 className="text-xl font-medium text-white mb-2">Appearance</h2>
              <p className="text-neutral-500 text-sm mb-8">Customize the look and feel of your workspace.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['dark', 'light', 'system'].map(t => (
                      <Button 
                        key={t}
                        variant={profile.settings?.theme === t ? "primary" : "secondary"}
                        fullWidth
                        onClick={() => handleSettingChange("theme", t)}
                        className="capitalize text-sm font-medium transition-colors"
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-200">Compact Mode</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Reduce padding and font sizes to fit more content.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300 max-w-xl">
              <h2 className="text-xl font-medium text-white mb-2">Security</h2>
              <p className="text-neutral-500 text-sm mb-8">Manage your account security and active sessions.</p>

              <div className="space-y-4 mb-10">
                {profile?.provider === "local" ? (
                  <div className="mb-10">
                    {passwordStep === 0 && (
                      <Button variant="secondary" fullWidth className="!justify-between !px-4 !py-4 text-left" onClick={() => setPasswordStep(1)}>
                        <div>
                          <h4 className="text-sm font-medium text-neutral-200">Change Password</h4>
                          <p className="text-xs text-neutral-500 mt-0.5">Update your account password</p>
                        </div>
                        <span className="text-neutral-500">→</span>
                      </Button>
                    )}

                    {passwordStep === 1 && (
                      <form onSubmit={handleVerifyPassword} className="p-5 bg-black border border-neutral-800 rounded-xl mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-neutral-200">Verify Current Password</h4>
                          <button type="button" onClick={() => { setPasswordStep(0); setPasswordState({ loading: false, error: "", success: "" }); }} className="text-xs text-neutral-500 hover:text-white transition-colors">Cancel</button>
                        </div>
                        
                        {passwordState.error && (
                          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-4">
                            {passwordState.error}
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-neutral-500 mb-1">Current Password</label>
                            <input 
                              type="password" 
                              required
                              value={passwords.current}
                              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                              className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="mt-5 flex justify-end">
                          <Button type="submit" variant="primary" size="sm" disabled={passwordState.loading}>
                            {passwordState.loading ? <Loader2 size={14} className="animate-spin" /> : "Verify Password"}
                          </Button>
                        </div>
                      </form>
                    )}

                    {passwordStep === 2 && (
                      <form onSubmit={handlePasswordUpdate} className="p-5 bg-black border border-neutral-800 rounded-xl mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-neutral-200">Set New Password</h4>
                          <button type="button" onClick={() => { setPasswordStep(0); setPasswords({current: "", new: "", confirm: ""}); setPasswordState({ loading: false, error: "", success: "" }); }} className="text-xs text-neutral-500 hover:text-white transition-colors">Cancel</button>
                        </div>
                        
                        {passwordState.error && (
                          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-4">
                            {passwordState.error}
                          </div>
                        )}
                        {passwordState.success && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg mb-4">
                            {passwordState.success}
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-neutral-500 mb-1">New Password</label>
                            <input 
                              type="password" 
                              required
                              value={passwords.new}
                              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                              className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                              autoFocus
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-500 mb-1">Confirm New Password</label>
                            <input 
                              type="password" 
                              required
                              value={passwords.confirm}
                              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                              className="w-full bg-[#111111] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                            />
                          </div>
                        </div>
                        <div className="mt-5 flex justify-end">
                          <Button type="submit" variant="primary" size="sm" disabled={passwordState.loading}>
                            {passwordState.loading ? <Loader2 size={14} className="animate-spin" /> : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="p-5 bg-black border border-neutral-800 rounded-xl mb-6">
                    <h4 className="text-sm font-medium text-neutral-200 mb-2">Change Password</h4>
                    <p className="text-sm text-neutral-500">
                      You are signed in with Google. Password management is handled securely by your provider.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-black border border-neutral-800 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-neutral-200">Active Sessions</h4>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-400">
                        💻
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Windows • Chrome</p>
                        <p className="text-xs text-emerald-500">Active now</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-white transition-colors">Log out</Button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800/50">
                <h4 className="text-sm font-medium text-rose-500 mb-2">Danger Zone</h4>
                <p className="text-xs text-neutral-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <Button variant="danger">
                  Delete Account
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
