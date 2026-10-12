import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { StudentProfile, RecruiterProfile, PagedResponse } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatters';
import {
  Users,
  Search,
  GraduationCap,
  Building,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AdminUserManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'RECRUITERS'>('STUDENTS');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const [studentsData, setStudentsData] = useState<PagedResponse<StudentProfile> | null>(null);
  const [recruitersData, setRecruitersData] = useState<PagedResponse<RecruiterProfile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Status toggle confirmation
  const [userToToggle, setUserToToggle] = useState<{ id: number; name: string; active: boolean } | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  // Profile inspect modal
  const [inspectStudent, setInspectStudent] = useState<StudentProfile | null>(null);
  const [inspectRecruiter, setInspectRecruiter] = useState<RecruiterProfile | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'STUDENTS') {
        const data = await adminApi.getStudents(debouncedSearch || undefined, page, 10);
        setStudentsData(data);
      } else {
        const data = await adminApi.getRecruiters(debouncedSearch || undefined, page, 10);
        setRecruitersData(data);
      }
    } catch (err) {
      console.error('Failed to load user directory', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab, debouncedSearch, page]);

  const handleToggleStatusConfirm = async () => {
    if (!userToToggle) return;
    setIsToggling(true);
    try {
      await adminApi.toggleUserStatus(userToToggle.id, !userToToggle.active);
      setUserToToggle(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Accounts & Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student candidate records and verified employer organizations across the network.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1 w-full sm:w-80">
            <button
              onClick={() => {
                setActiveTab('STUDENTS');
                setPage(0);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'STUDENTS'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Students ({studentsData?.totalElements || 0})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('RECRUITERS');
                setPage(0);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'RECRUITERS'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Recruiters ({recruitersData?.totalElements || 0})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder={`Search ${activeTab.toLowerCase()} by name or email...`}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Directory Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : activeTab === 'STUDENTS' ? (
        !studentsData || studentsData.content.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Students Found"
            description="No student accounts match the search parameters."
          />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="py-3.5 px-4">Student Profile</th>
                    <th className="py-3.5 px-4">University & Major</th>
                    <th className="py-3.5 px-4">CGPA</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Registered</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsData.content.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900 text-sm">{student.fullName}</p>
                        <p className="text-[11px] text-slate-400">{student.email}</p>
                      </td>

                      <td className="py-4 px-4 text-slate-700">
                        <p className="font-semibold">{student.university || 'Unspecified'}</p>
                        <p className="text-[11px] text-slate-400">{student.degree}</p>
                      </td>

                      <td className="py-4 px-4 font-bold text-emerald-700">
                        {student.cgpa ? `${student.cgpa} / 4.0` : 'N/A'}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            student.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {student.active ? 'Active' : 'Deactivated'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {formatDate(student.createdAt)}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setInspectStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setUserToToggle({
                                id: student.userId,
                                name: student.fullName,
                                active: student.active,
                              })
                            }
                            className={`p-1.5 rounded-lg transition-colors text-xs font-semibold ${
                              student.active
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={student.active ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {student.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : !recruitersData || recruitersData.content.length === 0 ? (
        <EmptyState
          icon={Building}
          title="No Recruiters Found"
          description="No employer organizations match the search parameters."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-4">Employer Company</th>
                  <th className="py-3.5 px-4">Recruiter Lead</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recruitersData.content.map((recruiter) => (
                  <tr key={recruiter.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 text-sm">{recruiter.companyName}</p>
                      {recruiter.companyWebsite && (
                        <a
                          href={recruiter.companyWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-brand-600 hover:underline inline-flex items-center gap-1"
                        >
                          {recruiter.companyWebsite} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-700">
                      <p className="font-semibold">{recruiter.fullName}</p>
                      <p className="text-[11px] text-slate-400">
                        {recruiter.designation || 'Talent Acquisition'}
                      </p>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-600">
                      {recruiter.location || 'Remote / Unspecified'}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          recruiter.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {recruiter.active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setInspectRecruiter(recruiter)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Inspect Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setUserToToggle({
                              id: recruiter.userId,
                              name: `${recruiter.companyName} (${recruiter.fullName})`,
                              active: recruiter.active,
                            })
                          }
                          className={`p-1.5 rounded-lg transition-colors text-xs font-semibold ${
                            recruiter.active
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={recruiter.active ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {recruiter.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Student Modal */}
      <Modal
        isOpen={!!inspectStudent}
        onClose={() => setInspectStudent(null)}
        title={`Student Profile: ${inspectStudent?.fullName}`}
        maxWidth="lg"
      >
        {inspectStudent && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl">
              <div>
                <span className="text-slate-400 font-bold block">Email</span>
                <span className="font-semibold text-slate-800">{inspectStudent.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Phone</span>
                <span className="font-semibold text-slate-800">{inspectStudent.phoneNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">University</span>
                <span className="font-semibold text-slate-800">{inspectStudent.university || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Major / Degree</span>
                <span className="font-semibold text-slate-800">{inspectStudent.degree || 'N/A'}</span>
              </div>
            </div>

            {inspectStudent.skills && (
              <div>
                <span className="text-slate-400 font-bold block mb-1">Skills</span>
                <div className="flex flex-wrap gap-1">
                  {inspectStudent.skills.split(',').map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md font-semibold">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {inspectStudent.profileSummary && (
              <div>
                <span className="text-slate-400 font-bold block mb-1">Summary</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl">{inspectStudent.profileSummary}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Inspect Recruiter Modal */}
      <Modal
        isOpen={!!inspectRecruiter}
        onClose={() => setInspectRecruiter(null)}
        title={`Employer: ${inspectRecruiter?.companyName}`}
        maxWidth="lg"
      >
        {inspectRecruiter && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl">
              <div>
                <span className="text-slate-400 font-bold block">Company Name</span>
                <span className="font-semibold text-slate-800">{inspectRecruiter.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Website</span>
                <span className="font-semibold text-slate-800">{inspectRecruiter.companyWebsite || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Recruiter Lead</span>
                <span className="font-semibold text-slate-800">{inspectRecruiter.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Email</span>
                <span className="font-semibold text-slate-800">{inspectRecruiter.email}</span>
              </div>
            </div>

            {inspectRecruiter.companyDescription && (
              <div>
                <span className="text-slate-400 font-bold block mb-1">Company Description</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl">{inspectRecruiter.companyDescription}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Toggle Account Status Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!userToToggle}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleToggleStatusConfirm}
        title={userToToggle?.active ? 'Deactivate User Account' : 'Activate User Account'}
        message={`Are you sure you want to ${
          userToToggle?.active ? 'deactivate' : 'activate'
        } the account for "${userToToggle?.name}"?`}
        confirmText={userToToggle?.active ? 'Deactivate' : 'Activate'}
        isDangerous={userToToggle?.active}
        isLoading={isToggling}
      />
    </div>
  );
};
