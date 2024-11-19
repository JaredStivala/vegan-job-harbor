import { Building2, Briefcase, Users } from "lucide-react";

interface JobStatsProps {
  jobCount: number;
}

export const JobStats = ({ jobCount }: JobStatsProps) => {
  const stats = [
    { icon: Building2, label: 'Companies', value: jobCount || 0 },
    { icon: Briefcase, label: 'Active Jobs', value: jobCount || 0 },
    { icon: Users, label: 'Candidates', value: '1000+' }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
        >
          <stat.icon className="w-6 h-6 text-white mb-2 mx-auto" />
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-white/80 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};