import { create } from 'zustand';
import { getMembers, inviteMember, removeMember } from '../api/memberApi';

interface Member {
  id: string;
  projectId: string;
  userId: string;
  email: string;
  name: string;
  role: string;
}

interface MemberState {
  members: Member[];
  isLoading: boolean;
  fetchMembers: (projectId: string) => Promise<void>;
  invite: (projectId: string, email: string, role: string) => Promise<Member>;
  remove: (memberId: string) => Promise<void>;
  updateRole: (memberId: string, role: string) => Promise<void>;
}

export const useMemberStore = create<MemberState>((set) => ({
  members: [],
  isLoading: false,

  fetchMembers: async (projectId) => {
    set({ isLoading: true });
    try {
      const data = await getMembers(projectId);
      set({ members: data, isLoading: false });
    } catch (error) {
      console.error("멤버 목록 조회 실패:", error);
      set({ isLoading: false });
    }
  },

  invite: async (projectId, email, role) => {
    try {
      const newMember = await inviteMember(projectId, email, role);
      set((state) => ({ members: [...state.members, newMember] }));
      return newMember;
    } catch (error) {
      console.error("멤버 초대 실패:", error);
      throw error; // UI 컴포넌트에서 에러 팝업을 띄우기 위해 던짐
    }
  },

  remove: async (memberId) => {
    try {
      await removeMember(memberId);
      set((state) => ({
        members: state.members.filter((m) => m.id !== memberId)
      }));
    } catch (error) {
      console.error("멤버 추방 실패:", error);
      throw error;
    }
  },

  updateRole: async (memberId, role) => {
    // import { updateMemberRole } ... wait, need to import it at the top
    try {
      // We will do a dynamic import to avoid parsing errors if import is missing at top
      const { updateMemberRole } = await import('../api/memberApi');
      const updatedMember = await updateMemberRole(memberId, role);
      set((state) => ({
        members: state.members.map((m) => m.id === memberId ? updatedMember : m)
      }));
    } catch (error) {
      console.error("멤버 권한 수정 실패:", error);
      throw error;
    }
  }
}));
