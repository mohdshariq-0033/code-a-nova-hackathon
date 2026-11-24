import React from 'react';

export default function RegisterForm({ hackathonForm, setHackathonForm, message, loading, handleHackathonSubmit }) {
  return (
    <form onSubmit={handleHackathonSubmit} className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 mt-6 space-y-6">
      <h2 className="text-2xl font-bold border-b border-slate-700 pb-4">Hackathon Team Registration</h2>
      {message && <div className="bg-indigo-950 border border-indigo-700 text-indigo-200 p-3 rounded-lg text-sm">{message}</div>}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="mobileNumber" className="block text-xs uppercase font-bold text-slate-400 mb-1">Mobile Number (10 digits)</label>
            <input type="text" id="mobileNumber" name="mobileNumber" maxLength={10} value={hackathonForm.mobileNumber} onChange={e => setHackathonForm({...hackathonForm, mobileNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none" placeholder="9876543210" required />
          </div>
          <div>
            <label htmlFor="domainTrack" className="block text-xs uppercase font-bold text-slate-400 mb-1">Domain / Track</label>
            <select id="domainTrack" name="domainTrack" value={hackathonForm.domainTrack} onChange={e => setHackathonForm({...hackathonForm, domainTrack: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none">
              <option value="Web Dev">Web Dev</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Blockchain">Blockchain</option>
            </select>
          </div>
        </div>

        {/* College Name Dropdown[cite: 1] */}
        <div>
          <label htmlFor="collegeName" className="block text-xs uppercase font-bold text-slate-400 mb-1">College Name</label>
          <select id="collegeName" name="collegeName" value={hackathonForm.collegeName || 'Hi-Tech Institute of Technology'} onChange={e => setHackathonForm({...hackathonForm, collegeName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none" required>
            <option value="Hi-Tech Institute of Technology">Hi-Tech Institute of Technology</option>
            <option value="IIT Delhi">IIT Delhi</option>
            <option value="DTU">DTU</option>
            <option value="NIT Kurukshetra">NIT Kurukshetra</option>
            <option value="Amity University">Amity University</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Course & Branch Dropdowns[cite: 1] */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="course" className="block text-xs uppercase font-bold text-slate-400 mb-1">Course</label>
            <select id="course" name="course" value={hackathonForm.course || 'BCA'} onChange={e => setHackathonForm({...hackathonForm, course: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none" required>
              <option value="BCA">BCA</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MCA">MCA</option>
              <option value="BSc">BSc</option>
            </select>
          </div>
          <div>
            <label htmlFor="branch" className="block text-xs uppercase font-bold text-slate-400 mb-1">Branch</label>
            <select id="branch" name="branch" value={hackathonForm.branch || 'CSE'} onChange={e => setHackathonForm({...hackathonForm, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none" required>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>
        </div>

        {/* Year of Study Dropdown[cite: 1] */}
        <div>
          <label htmlFor="yearOfStudy" className="block text-xs uppercase font-bold text-slate-400 mb-1">Year of Study</label>
          <select id="yearOfStudy" name="yearOfStudy" value={hackathonForm.yearOfStudy || '2nd'} onChange={e => setHackathonForm({...hackathonForm, yearOfStudy: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none" required>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>

        <div>
          <label htmlFor="projectName" className="block text-xs uppercase font-bold text-slate-400 mb-1">Project Name (Min 5 chars)</label>
          <input type="text" id="projectName" name="projectName" value={hackathonForm.projectName} onChange={e => setHackathonForm({...hackathonForm, projectName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none" placeholder="Code-a-Nova Portal" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pptLink" className="block text-xs uppercase font-bold text-slate-400 mb-1">PPT Link (Drive URL)</label>
            <input type="url" id="pptLink" name="pptLink" value={hackathonForm.pptLink} onChange={e => setHackathonForm({...hackathonForm, pptLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none" placeholder="https://drive.google.com/..." />
          </div>
          <div>
            <label htmlFor="prototypeLink" className="block text-xs uppercase font-bold text-slate-400 mb-1">Prototype Link (GitHub/Figma)</label>
            <input type="url" id="prototypeLink" name="prototypeLink" value={hackathonForm.prototypeLink} onChange={e => setHackathonForm({...hackathonForm, prototypeLink: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none" placeholder="https://github.com/..." />
          </div>
        </div>

        <div>
          <label htmlFor="teamSize" className="block text-xs uppercase font-bold text-slate-400 mb-1">Team Size (1 - 5)</label>
          <select id="teamSize" name="teamSize" value={hackathonForm.teamSize} onChange={e => {
            const size = parseInt(e.target.value);
            const members = Array.from({length: size - 1}, () => ({memberName: '', memberEmail: ''}));
            setHackathonForm({...hackathonForm, teamSize: size, teamMembers: members});
          }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none">
            <option value={1}>1 (Solo)</option>
            <option value={2}>2 Members</option>
            <option value={3}>3 Members</option>
            <option value={4}>4 Members</option>
            <option value={5}>5 Members</option>
          </select>
        </div>

        {/* Dynamic Team Members Fields */}
        {hackathonForm.teamSize > 1 && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
              Team Members Information
            </h3>
            {hackathonForm.teamMembers.map((member, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                    Member {idx + 2} Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Member Name" 
                    value={member.memberName || ''} 
                    onChange={(e) => {
                      const updated = [...hackathonForm.teamMembers];
                      updated[idx].memberName = e.target.value;
                      setHackathonForm({ ...hackathonForm, teamMembers: updated });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                    Member {idx + 2} Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="member@example.com" 
                    value={member.memberEmail || ''} 
                    onChange={(e) => {
                      const updated = [...hackathonForm.teamMembers];
                      updated[idx].memberEmail = e.target.value;
                      setHackathonForm({ ...hackathonForm, teamMembers: updated });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-700 transition mt-4">
          {loading ? 'Submitting...' : 'Submit Registration & Send Confirmation Email'}
        </button>
      </div>
    </form>
  );
}