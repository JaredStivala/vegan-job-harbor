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

  return (
    <div className="flex gap-8 justify-center items-center text-white">
      <div className="flex items-center gap-2">
        <Briefcase className="w-4 h-4" />
        <span className="text-lg font-medium tracking-wide">
          <span className="font-semibold">{animatedJobCount}</span>{" "}
          Active Jobs
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span className="text-lg font-medium tracking-wide">
          <span className="font-semibold">{animatedCandidateCount}+</span>{" "}
          Candidates
        </span>
      </div>
    </div>
  );
};