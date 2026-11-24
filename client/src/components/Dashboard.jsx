import React from 'react';

export default function Dashboard({ 
  user, 
  message, 
  registrationSuccess, 
  registrationDetails, 
  handleResetRegistration, 
  setCurrentTab 
}) {
  return (
    <div className="max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-8 mt-6 shadow-2xl space-y-6 transition-all duration-300">
      
      {/* Dashboard Header */}
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-slate-400">
          Manage your hackathon registrations and team details.
        </p>
      </div>

      {message && (
        <div className="bg-indigo-950 border border-indigo-700 text-indigo-200 p-3 rounded-lg text-sm animate-fade-in">
          {message}
        </div>
      )}

      {/* Registration Status Section */}
      {registrationSuccess && registrationDetails ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-emerald-950/40 border border-emerald-700/50 p-4 rounded-xl">
            <h3 className="text-emerald-400 font-bold text-lg">Registration Successful!</h3>
            <p className="text-xs text-slate-300 mt-0.5">You have successfully registered for the Code-a-Nova Hackathon.</p>
          </div>

          {/* Detailed Card Showing Input Fields */}
          <div className="bg-slate-900/80 border border-slate-700 p-4 sm:p-6 rounded-xl space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-2">
              Your Registration Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50">
                <span className="block text-xs uppercase text-slate-400 font-bold">Mobile Number</span>
                <span className="text-white font-medium">{registrationDetails.mobileNumber || 'N/A'}</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50">
                <span className="block text-xs uppercase text-slate-400 font-bold">College Name</span>
                <span className="text-white font-medium break-words">{registrationDetails.collegeName || 'N/A'}</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50">
                <span className="block text-xs uppercase text-slate-400 font-bold">Course & Branch</span>
                <span className="text-white font-medium break-words">
                  {registrationDetails.course || 'N/A'} {registrationDetails.branch ? `- ${registrationDetails.branch}` : ''}
                </span>
              </div>

              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50">
                <span className="block text-xs uppercase text-slate-400 font-bold">Year of Study</span>
                <span className="text-white font-medium">{registrationDetails.yearOfStudy || 'N/A'}</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50">
                <span className="block text-xs uppercase text-slate-400 font-bold">Domain / Track</span>
                <span className="text-white font-medium">{registrationDetails.domainTrack || 'N/A'}</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50">
                <span className="block text-xs uppercase text-slate-400 font-bold">Project Name</span>
                <span className="text-white font-medium break-words">{registrationDetails.projectName || 'N/A'}</span>
              </div>

              {registrationDetails.pptLink && (
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50 sm:col-span-2">
                  <span className="block text-xs uppercase text-slate-400 font-bold">PPT Link</span>
                  <a href={registrationDetails.pptLink} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline truncate block">
                    {registrationDetails.pptLink}
                  </a>
                </div>
              )}

              {registrationDetails.prototypeLink && (
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50 sm:col-span-2">
                  <span className="block text-xs uppercase text-slate-400 font-bold">Prototype Link</span>
                  <a href={registrationDetails.prototypeLink} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline truncate block">
                    {registrationDetails.prototypeLink}
                  </a>
                </div>
              )}
            </div>

            {/* Team Members List */}
            {registrationDetails.teamMembers && registrationDetails.teamMembers.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <h5 className="text-xs uppercase font-bold text-slate-400 mb-2">Team Members</h5>
                <div className="space-y-2">
                  {registrationDetails.teamMembers.map((member, idx) => (
                    <div key={idx} className="bg-slate-800 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs text-slate-300">
                      <span className="break-words"><strong>Member {idx + 2}:</strong> {member.memberName}</span>
                      <span className="text-indigo-300 break-all">{member.memberEmail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Edit Registration Button Placed Exactly at the Bottom of Details */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={handleResetRegistration}
                className="w-full sm:w-auto bg-rose-600/80 hover:bg-rose-700 text-white text-xs px-6 py-3 rounded-xl font-bold transition cursor-pointer shadow-md text-center"
              >
                Edit Registration
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Not Registered Yet View */
        <div className="text-center py-10 space-y-4 bg-slate-900/40 rounded-xl border border-slate-700/50 p-6 animate-fade-in">
          <div className="text-indigo-400 text-lg font-semibold">You haven't registered for the hackathon yet!</div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Submit your project details along with your college info to complete your hackathon registration.
          </p>
          <button 
            onClick={() => setCurrentTab('register')}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg cursor-pointer"
          >
            Register Now
          </button>
        </div>
      )}

    </div>
  );
}