type StudyMember = {
  id: number;
  name: string;
  role: "leader" | "member";
  githubId?: string;
};

const members: StudyMember[] = [
  { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "member" }, 
];

function printMemberInfo(memberId: number): string {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return "해당 ID를 가진 회원을 찾을 수 없습니다.";
  }

  const displayGithubId = foundMember.githubId ?? "등록되지 않음";

  return foundMember.name + "님의 역할은 " + foundMember.role + "이고 깃허브 아이디는 " + displayGithubId;
}

console.log(printMemberInfo(1));   
console.log(printMemberInfo(2));  
console.log(printMemberInfo(999)); 