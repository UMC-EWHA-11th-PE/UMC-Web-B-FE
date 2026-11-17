type StudyMember = {
  id: number;
  name: string;
  isLeader?: boolean;
  githubId?: string;
};

const members: StudyMember[] = [
  { id: 1, name: "광수", isLeader: true, githubId: "gwangsoo" },
  { id: 2, name: "지수", isLeader: false },
];

function getMemberInfo(memberId: number) {
  const foundMember = members.find(
    (member) => member.id === memberId
  );

  if (foundMember) {
    const githubId = foundMember.githubId ?? "등록되지 않음";
    return (foundMember.name + " / GitHub: " + githubId);
  } else {
    return "존재하지 않는 회원입니다.";
  }
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));