import { Briefcase, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface JobStatsProps {
  jobCount: number;
}

export const JobStats = ({ jobCount }: JobStatsProps) => {
  const [animatedJobCount, setAnimatedJobCount] = useState(0);
  const [animatedCandidateCount, setAnimatedCandidateCount] = useState(0);
  const targetCandidateCount = 1000;
  
  useEffect(() => {
    // Animate job count
    const jobDuration = 1000; // 1 second
    const jobStartTime = Date.now();
    
    const animateJobs = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - jobStartTime;
      
      if (elapsed < jobDuration) {
        const progress = elapsed / jobDuration;
        setAnimatedJobCount(Math.floor(jobCount * progress));
        requestAnimationFrame(animateJobs);
      } else {
        setAnimatedJobCount(jobCount);
      }
    };
    
    // Animate candidate count
    const candidateDuration = 1500; // 1.5 seconds
    const candidateStartTime = Date.now();
    
    const animateCandidates = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - candidateStartTime;
      
      if (elapsed < candidateDuration) {
        const progress = elapsed / candidateDuration;
        setAnimatedCandidateCount(Math.floor(targetCandidateCount * progress));
        requestAnimationFrame(animateCandidates);
      } else {
        setAnimatedCandidateCount(targetCandidateCount);
      }
    };
    
    requestAnimationFrame(animateJobs);
    requestAnimationFrame(animateCandidates);
  }, [jobCount]);

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: animatedJobCount || 0 },
    { icon: Users, label: 'Candidates', value: `${animatedCandidateCount}+` }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="p-4 rounded-xl bg-white/10 border border-white/20"
        >
          <stat.icon className="w-6 h-6 text-white mb-2 mx-auto" />
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-white/80 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};