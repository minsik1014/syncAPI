import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { X, UserPlus, Shield, User, Trash2, Check, ChevronDown, Folder } from 'lucide-react';
import { useMemberStore } from '../store/useMemberStore';
import { useStore } from '../app/store/useStore';
import { grantFolderPermission } from '../api/memberApi';
import './MemberManagementModal.css';

interface MemberManagementModalProps {
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole: string; // "OWNER" 등
}

export const MemberManagementModal: React.FC<MemberManagementModalProps> = ({ 
  projectId, 
  isOpen, 
  onOpenChange,
  currentUserRole
}) => {
  const { members, fetchMembers, invite, remove, isLoading } = useMemberStore();
  const apiTrees = useStore((state) => state.apiTrees);
  const folders = apiTrees[projectId] || [];
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState('');

  // 모달이 열릴 때마다 최신 멤버 목록을 가져옵니다.
  useEffect(() => {
    if (isOpen && projectId) {
      fetchMembers(projectId);
    }
  }, [isOpen, projectId, fetchMembers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (role === 'DOMAIN_EDITOR' && selectedFolderIds.length === 0) {
      setError('최소 1개 이상의 도메인 폴더를 선택해주세요.');
      return;
    }
    setError('');
    setIsInviting(true);
    try {
      // 도메인 에디터의 경우, 프로젝트 전체 기본 권한은 'VIEWER'로 제한합니다.
      const actualRole = role === 'DOMAIN_EDITOR' ? 'VIEWER' : role;
      
      const newMember = await invite(projectId, email, actualRole);
      
      // 도메인 에디터였다면, 선택된 폴더들에 개별 권한(EDITOR)을 부여합니다.
      if (role === 'DOMAIN_EDITOR' && selectedFolderIds.length > 0) {
        if(newMember && newMember.userId) {
          await Promise.all(
            selectedFolderIds.map(folderId => 
              grantFolderPermission(folderId, newMember.userId, 'EDITOR')
            )
          );
        }
      }

      // 화면 새로고침 없이 깔끔하게 완료
      setEmail(''); 
      setRole('VIEWER');
      setSelectedFolderIds([]);
    } catch (err: any) {
      setError(err.response?.data?.message || '초대에 실패했습니다. 이메일을 확인해주세요.');
    } finally {
      setIsInviting(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    setSelectedFolderIds(prev => 
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <div className="modal-header">
            <Dialog.Title className="modal-title">
              <Shield className="icon-blue" />
              팀원 및 권한 관리
            </Dialog.Title>
            <Dialog.Description className="modal-desc">
              프로젝트에 팀원을 초대하고 도메인별 권한을 관리하세요.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="icon-button close-btn" aria-label="Close">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="modal-body">
            {/* 초대 폼 (방장인 OWNER에게만 보입니다) */}
            {currentUserRole === 'OWNER' && (
              <form onSubmit={handleInvite} className="invite-form glass-panel">
                <h3 className="form-title">새 팀원 초대하기</h3>
                <div className="invite-inputs">
                  <div className="input-group">
                    <User size={16} className="input-icon" />
                    <input 
                      type="email" 
                      placeholder="이메일 주소 입력..." 
                      className="text-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  {/* Radix UI의 접근성 높은 Select 컴포넌트 */}
                  <Select.Root value={role} onValueChange={setRole}>
                    <Select.Trigger className="select-trigger" aria-label="Role">
                      <Select.Value />
                      <Select.Icon className="select-icon">
                        <ChevronDown size={16} />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="select-content">
                        <Select.Viewport className="select-viewport">
                          <Select.Item value="EDITOR" className="select-item">
                            <Select.ItemText>전체 에디터 (모든 폴더)</Select.ItemText>
                            <Select.ItemIndicator className="select-indicator"><Check size={14}/></Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item value="DOMAIN_EDITOR" className="select-item">
                            <Select.ItemText>부분 에디터 (특정 도메인)</Select.ItemText>
                            <Select.ItemIndicator className="select-indicator"><Check size={14}/></Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item value="VIEWER" className="select-item">
                            <Select.ItemText>전체 뷰어 (읽기 전용)</Select.ItemText>
                            <Select.ItemIndicator className="select-indicator"><Check size={14}/></Select.ItemIndicator>
                          </Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  
                  <button type="submit" className="btn-primary" disabled={isInviting || !email}>
                    {isInviting ? '처리 중...' : <><UserPlus size={16} /> 초대</>}
                  </button>
                </div>

                {role === 'DOMAIN_EDITOR' && (
                  <div className="mt-4 p-4 bg-white/60 border border-indigo-100 rounded-xl animate-in slide-in-from-top-2">
                    <p className="text-xs font-bold text-indigo-900 mb-3 flex items-center gap-1">
                      <Folder size={12} /> 편집 권한을 줄 도메인 폴더 선택
                    </p>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {folders.length === 0 ? (
                        <p className="text-xs text-gray-500 py-2">프로젝트에 아직 폴더가 없습니다.</p>
                      ) : (
                        folders.map(f => (
                          <label key={f.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 cursor-pointer transition-colors">
                            <input 
                              type="checkbox" 
                              checked={selectedFolderIds.includes(f.id)}
                              onChange={() => toggleFolder(f.id)}
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">{f.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {error && <p className="error-text">{error}</p>}
              </form>
            )}

            {/* 참여 중인 멤버 리스트 */}
            <div className="members-section">
              <h3 className="section-title">참여 중인 팀원 ({members.length})</h3>
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <ul className="members-list">
                  {members.map((member) => (
                    <li key={member.id} className="member-item">
                      <div className="member-info">
                        <div className="avatar">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="member-details">
                          <span className="member-name">{member.name}</span>
                          <span className="member-email">{member.email}</span>
                        </div>
                      </div>
                      
                      <div className="member-actions">
                        {currentUserRole === 'OWNER' && member.role !== 'OWNER' ? (
                          <select 
                            value={member.role}
                            onChange={(e) => useMemberStore.getState().updateRole(member.id, e.target.value)}
                            className={`role-badge ${member.role.toLowerCase()} cursor-pointer border-none outline-none appearance-none pr-4 font-bold`}
                          >
                            <option value="EDITOR">EDITOR</option>
                            <option value="VIEWER">VIEWER</option>
                          </select>
                        ) : (
                          <span className={`role-badge ${member.role.toLowerCase()}`}>
                            {member.role}
                          </span>
                        )}
                        
                        {/* OWNER 권한을 가진 사람만 남을 추방할 수 있으며, 다른 OWNER는 추방 불가능 */}
                        {currentUserRole === 'OWNER' && member.role !== 'OWNER' && (
                          <button 
                            onClick={() => remove(member.id)}
                            className="icon-button danger-btn"
                            title="이 팀원 추방하기"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
